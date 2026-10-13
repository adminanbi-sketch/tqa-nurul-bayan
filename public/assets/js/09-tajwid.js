// =========================================================
// TAJWID CHECKBOX
// =========================================================
function renderTajwidGrid() {
  const el = document.getElementById('tajwidGrid');
  if (!el) return;
  el.innerHTML = TAJWID_KATEGORI.map(t => `
    <label class="tajwid-item">
      <input type="checkbox" id="tw-${t.id}">
      <span>${t.label}</span>
    </label>
  `).join('');
}
