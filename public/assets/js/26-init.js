
document.addEventListener('DOMContentLoaded', async () => {
  renderTajwidGrid();
  document.getElementById('inAbsenTanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('inMutabaahTanggal').value = new Date().toISOString().split('T')[0];

  const saved = localStorage.getItem('th_user');
  if (saved) user = JSON.parse(saved);

  try {
    await loadAllData();
  } catch (e) { toast('Gagal sinkronisasi data'); }

  if (user) {
    document.getElementById('loginScreen').style.display = 'none';
    applyRole();
  }
  render();
});