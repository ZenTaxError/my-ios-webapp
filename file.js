// Small helpers for install instructions UI
document.getElementById('show-install').addEventListener('click', () => {
  const el = document.getElementById('install-instructions');
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden','false');
});
document.getElementById('close-instructions').addEventListener('click', () => {
  const el = document.getElementById('install-instructions');
  el.classList.add('hidden');
  el.setAttribute('aria-hidden','true');
});

// Optional: detect PWA standalone mode on iOS
if (window.navigator.standalone) {
  document.documentElement.classList.add('is-standalone');
}
