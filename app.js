const $ = (id) => document.getElementById(id);
const toast = $('toast');
const lead = $('auth-lead');
const setupView = $('setupView');
const pinView = $('pinView');
const loginView = $('loginView');
const lockedView = $('lockedView');

// This is UI flow only. No credentials are stored in localStorage/sessionStorage.
// Real first-time setup, PIN verification and login must be connected to the secure backend.

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function showView(view) {
  [setupView, pinView, loginView, lockedView].forEach((item) => { item.hidden = item !== view; });
}

function setInvalid(input, invalid) {
  input.classList.toggle('invalid', invalid);
}

function validatePin(value) {
  return /^\d{6,12}$/.test(value);
}

function validateSetup() {
  const email = $('setupEmail');
  const password = $('setupPassword');
  const confirm = $('setupConfirm');
  const pin = $('setupPin');
  const pinConfirm = $('setupPinConfirm');
  let ok = true;

  setInvalid(email, !email.validity.valid);
  setInvalid(password, password.value.length < 8);
  setInvalid(confirm, confirm.value !== password.value || confirm.value.length < 8);
  setInvalid(pin, !validatePin(pin.value));
  setInvalid(pinConfirm, pinConfirm.value !== pin.value || !validatePin(pinConfirm.value));

  ok = email.validity.valid && password.value.length >= 8 && confirm.value === password.value && validatePin(pin.value) && pinConfirm.value === pin.value;
  return ok;
}

$('setupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateSetup()) {
    showToast('Please complete all setup fields correctly.');
    return;
  }
  showToast('Setup form validated. Secure backend connection is required before credentials can be created.');
});

$('pinForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('loginPin');
  const valid = validatePin(input.value);
  setInvalid(input, !valid);
  if (!valid) {
    showToast('Admin PIN must contain 6–12 digits.');
    return;
  }
  showToast('PIN format verified. Secure backend verification is required.');
});

$('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = $('loginEmail');
  const password = $('loginPassword');
  const valid = email.validity.valid && password.value.length > 0;
  setInvalid(email, !email.validity.valid);
  setInvalid(password, password.value.length === 0);
  if (!valid) {
    showToast('Enter a valid email and password.');
    return;
  }
  showToast('Login form validated. Secure backend authentication is required.');
});

// The UI intentionally does not guess whether an owner already exists.
// That state will come from Supabase/backend once Level 5 authentication infrastructure is connected.
lead.textContent = 'Owner authentication foundation is ready. Secure backend verification will control first-time setup and login.';
showView(setupView);
