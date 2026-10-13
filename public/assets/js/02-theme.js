// =========================================================
// THEME
// =========================================================
function terapkanTema(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('th_theme', t);
  const btn = document.getElementById('themeBtn');
  const btnTxt = document.getElementById('themeBtnText');
  if (t === 'dark') {
    btn.textContent = '☀️';
    if (btnTxt) btnTxt.textContent = 'Nonaktifkan';
  } else {
    btn.textContent = '🌙';
    if (btnTxt) btnTxt.textContent = 'Aktifkan';
  }
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = t === 'dark' ? '#8b98a5' : '#65676b';
    Chart.defaults.borderColor = t === 'dark' ? '#2f3336' : '#f0f2f5';
  }
}
function toggleTema() {
  const cur = document.documentElement.getAttribute('data-theme');
  terapkanTema(cur === 'dark' ? 'light' : 'dark');
  render();
}
function autoTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  terapkanTema(prefersDark ? 'dark' : 'light');
  toast('Tema mengikuti sistem');
}
const savedTheme = localStorage.getItem('th_theme');
if (savedTheme) terapkanTema(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) terapkanTema('dark');
else terapkanTema('light');
