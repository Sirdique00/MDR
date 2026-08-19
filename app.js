const button = document.getElementById('continueBtn');
const toast = document.getElementById('toast');

button.addEventListener('click', () => {
  toast.textContent = 'Owner authentication is scheduled for Level 2.';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
});
