// Sadeeq first-page entry logic.
// No credentials or account state are persisted in browser storage.
// The real first-account creation will call SadeeqAuth.accountCreated()
// after the backend/Supabase transaction succeeds.

const landingActions = document.getElementById('landing-actions');

const SadeeqAuth = {
  accountCreated() {
    if (!landingActions) return;
    landingActions.classList.add('account-created');
  },
};

window.SadeeqAuth = Object.freeze(SadeeqAuth);
window.Sadeeq = Object.freeze({
  page: 'owner-only-landing',
  credentialsPersistedInBrowser: false,
});
