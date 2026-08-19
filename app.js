const $ = (id) => document.getElementById(id);
const toast = $('toast');
const lead = $('auth-lead');
const setupView = $('setupView');
const pinView = $('pinView');
const loginView = $('loginView');
const lockedView = $('lockedView');

// Level 3 authentication hardening (client UX only).
// IMPORTANT: real enforcement MUST happen server-side/Supabase in the authentication layer.
// No credentials, PINs, tokens, or authentication state are persisted in browser storage.

const SECURITY = {
  maxLocalAttempts: 5,
  lockoutMs: 60 * 1000,
  pinVerified: false,
  attempts: { pin: 0, login: 0, setup: 0 },
  lockedUntil: { pin: 0, login: 0, setup: 0 }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function showView(view) {
  [setupView, pinView, loginView, lockedView].forEach((item) => {
    item.hidden = item !== view;
  });
}

function setInvalid(input, invalid) {
  input.classList.toggle('invalid', invalid);
}

function validatePin(value) {
  return /^\d{6,12}$/.test(value);
}

function isLocallyLocked(stage) {
  return Date.now() < SECURITY.lockedUntil[stage];
}

function recordFailedAttempt(stage) {
  SECURITY.attempts[stage] += 1;
  if (SECURITY.attempts[stage] >= SECURITY.maxLocalAttempts) {
    SECURITY.lockedUntil[stage] = Date.now() + SECURITY.lockoutMs;
    SECURITY.attempts[stage] = 0;
    showToast('Too many attempts. Please wait and try again.');
    return true;
  }
  return false;
}

function resetAttempts(stage) {
  SECURITY.attempts[stage] = 0;
  SECURITY.lockedUntil[stage] = 0;
}

function validateSetup() {
  const email = $('setupEmail');
  const password = $('setupPassword');
  const confirm = $('setupConfirm');
  const pin = $('setupPin');
  const pinConfirm = $('setupPinConfirm');

  setInvalid(email, !email.validity.valid);
  setInvalid(password, password.value.length < 8);
  setInvalid(confirm, confirm.value !== password.value || confirm.value.length < 8);
  setInvalid(pin, !validatePin(pin.value));
  setInvalid(pinConfirm, pinConfirm.value !== pin.value || !validatePin(pinConfirm.value));

  return email.validity.valid &&
    password.value.length >= 8 &&
    confirm.value === password.value &&
    validatePin(pin.value) &&
    pinConfirm.value === pin.value;
}

$('setupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLocallyLocked('setup')) {
    showToast('Too many attempts. Please wait and try again.');
    return;
  }

  if (!validateSetup()) {
    recordFailedAttempt('setup');
    showToast('Please complete all setup fields correctly.');
    return;
  }

  resetAttempts('setup');
  showToast('Setup validated. Secure backend creation is required before credentials can be created.');
});

$('pinForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLocallyLocked('pin')) {
    showToast('Too many attempts. Please wait and try again.');
    return;
  }

  const input = $('loginPin');
  const valid = validatePin(input.value);
  setInvalid(input, !valid);

  if (!valid) {
    recordFailedAttempt('pin');
    showToast('Invalid Admin PIN format.');
    return;
  }

  // Do not treat format validation as authentication.
  // Backend/Supabase must verify the real PIN before this gate is passed.
  resetAttempts('pin');
  SECURITY.pinVerified = false;
  showToast('PIN format accepted. Secure backend verification is required.');
});

$('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLocallyLocked('login')) {
    showToast('Too many attempts. Please wait and try again.');
    return;
  }

  const email = $('loginEmail');
  const password = $('loginPassword');
  const valid = email.validity.valid && password.value.length > 0;

  setInvalid(email, !email.validity.valid);
  setInvalid(password, password.value.length === 0);

  if (!valid) {
    recordFailedAttempt('login');
    showToast('Invalid email or password format.');
    return;
  }

  resetAttempts('login');
  showToast('Login input accepted. Secure backend authentication is required.');
});

// The UI intentionally does not guess whether an owner exists.
// That state will come from Supabase/backend once the authentication service is connected.
lead.textContent = 'Owner authentication foundation is ready. Secure backend verification will control first-time setup and login.';
showView(setupView);
