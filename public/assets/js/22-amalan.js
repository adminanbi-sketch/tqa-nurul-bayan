// =========================================================
// KELOLA AMALAN — via API
// =========================================================
function renderListAmalan() {
  const el = document.getElementById('listAmalan');
  if (!el) return;
  el.innerHTML = DB.amalan.map(a => `
    <div class="item" style="padding:8px 10px">
      <div class="item-main"><div class="item-name" style="font-size:13px">${a.t}</div></div>
      <button class="btn btn-red" onclick="hapusAmalan('${a.id}')">Hapus</button>
    </div>
  `).join('');
}

async function tambahAmalan() {
  const nama = document.getElementById('newAmalanNama').value.trim();
  if (!nama) return toast('Nama amalan harus diisi');

  try {
    await api.addAmalan(nama);
    document.getElementById('newAmalanNama').value = '';
    await loadAllData();
    renderListAmalan();
    toast('Amalan ditambahkan');
  } catch (e) {
    console.error('Error tambah amalan:', e);
    toast('Gagal: ' + e.message);
  }
}

async function hapusAmalan(id) {
  const ok = await konfirmasi('Hapus amalan ini?', { title: 'Hapus Amalan', okText: 'Ya, Hapus' });
  if (!ok) return;

  try {
    await api.deleteAmalan(id);
    await loadAllData();
    renderListAmalan();
    toast('Amalan dihapus');
  } catch (e) {
    console.error('Error hapus amalan:', e);
    toast('Gagal: ' + e.message);
  }
}