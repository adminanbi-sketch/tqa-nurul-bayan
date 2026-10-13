// =========================================================
// HALAQAH
// =========================================================
function halaqahList() { return DB.halaqah.map(h => h.nama); }

function tambahHalaqah() {
  const nama = document.getElementById('newHalaqahNama').value.trim();
  const musyrif = document.getElementById('newHalaqahMusyrif').value;
  if (!nama) return toast('Nama halaqah harus diisi');
  if (DB.halaqah.some(h => h.nama.toLowerCase() === nama.toLowerCase())) return toast('Halaqah sudah ada');
  DB.halaqah.push({ id: Date.now(), nama, musyrif: musyrif || null });
  simpan();
  document.getElementById('newHalaqahNama').value = '';
  document.getElementById('newHalaqahMusyrif').value = '';
  render();
  toast('Halaqah ditambahkan');
}

async function hapusHalaqah(id) {
  const h = DB.halaqah.find(x => x.id === id);
  if (!h) return;
  if (DB.santri.some(s => s.halaqah === h.nama)) return toast('Tidak bisa hapus, masih ada santri di halaqah ini');
  const ok = await konfirmasi('Hapus halaqah ' + h.nama + '?', { title: 'Hapus Halaqah', okText: 'Ya, Hapus' });
  if (!ok) return;
  DB.halaqah = DB.halaqah.filter(x => x.id !== id);
  simpan();
  render();
  toast('Halaqah dihapus');
}

function renderHalaqahAdmin() {
  const el = document.getElementById('listHalaqahAdmin');
  if (!el) return;
  if (DB.halaqah.length === 0) {
    el.innerHTML = '<div style="font-size:12.5px;color:var(--text-muted)">Belum ada halaqah.</div>';
    return;
  }
  el.innerHTML = DB.halaqah.map(h => {
    const jumlahSantri = DB.santri.filter(s => s.halaqah === h.nama).length;
    const musyrifNama = h.musyrif && USERS[h.musyrif] ? USERS[h.musyrif].nama : '—';
    return `
      <div class="item" style="padding:10px">
        <div class="item-main">
          <div class="item-name">${h.nama}</div>
          <div class="item-meta">${jumlahSantri} santri · Musyrif: ${musyrifNama}</div>
        </div>
        <button class="btn btn-red" onclick="hapusHalaqah(${h.id})">Hapus</button>
      </div>
    `;
  }).join('');
}

function renderHalaqahDropdowns() {
  const list = halaqahList();
  const opt = list.map(h => `<option value="${h}">${h}</option>`).join('');
  const inH = document.getElementById('inHalaqahSantri');
  if (inH) inH.innerHTML = opt || '<option value="-">-</option>';
  const fH = document.getElementById('filterHalaqahSantri');
  if (fH) fH.innerHTML = '<option value="">Semua Halaqah</option>' + opt;
  const fL = document.getElementById('filterLbHalaqah');
  if (fL) fL.innerHTML = '<option value="">Semua Halaqah</option>' + opt;
  const lH = document.getElementById('inLaporanHalaqah');
  if (lH) lH.innerHTML = '<option value="">— Pilih halaqah —</option>' + opt;
  const nM = document.getElementById('newHalaqahMusyrif');
  if (nM) {
    const musyrifKeys = Object.keys(USERS).filter(k => USERS[k].role === 'musyrif');
    nM.innerHTML = '<option value="">— Tidak ada —</option>' + musyrifKeys.map(k => `<option value="${k}">${USERS[k].nama}</option>`).join('');
  }
}
// =========================================================
// HALAQAH — via API
// =========================================================
function halaqahList() { return DB.halaqah.map(h => h.nama); }

async function tambahHalaqah() {
  const nama = document.getElementById('newHalaqahNama').value.trim();
  const musyrif = document.getElementById('newHalaqahMusyrif').value;
  if (!nama) return toast('Nama halaqah harus diisi');
  if (DB.halaqah.some(h => h.nama.toLowerCase() === nama.toLowerCase())) return toast('Halaqah sudah ada');

  try {
    await api.addHalaqah({ nama, musyrif: musyrif || null });
    document.getElementById('newHalaqahNama').value = '';
    document.getElementById('newHalaqahMusyrif').value = '';
    await loadAllData();
    render();
    toast('Halaqah ditambahkan');
  } catch (e) {
    console.error('Error tambah halaqah:', e);
    toast('Gagal menambahkan: ' + e.message);
  }
}

async function hapusHalaqah(id) {
  const h = DB.halaqah.find(x => x.id === id);
  if (!h) return;
  if (DB.santri.some(s => s.halaqah === h.nama)) return toast('Tidak bisa hapus, masih ada santri di halaqah ini');

  const ok = await konfirmasi('Hapus halaqah ' + h.nama + '?', { title: 'Hapus Halaqah', okText: 'Ya, Hapus' });
  if (!ok) return;

  try {
    await api.deleteHalaqah(id);
    await loadAllData();
    render();
    toast('Halaqah dihapus');
  } catch (e) {
    console.error('Error hapus halaqah:', e);
    toast('Gagal menghapus: ' + e.message);
  }
}

function renderHalaqahAdmin() {
  const el = document.getElementById('listHalaqahAdmin');
  if (!el) return;
  if (DB.halaqah.length === 0) {
    el.innerHTML = '<div style="font-size:12.5px;color:var(--text-muted)">Belum ada halaqah.</div>';
    return;
  }
  el.innerHTML = DB.halaqah.map(h => {
    const jumlahSantri = DB.santri.filter(s => s.halaqah === h.nama).length;
    const musyrifNama = h.musyrif && USERS[h.musyrif] ? USERS[h.musyrif].nama : (h.musyrif || '—');
    return `
      <div class="item" style="padding:10px">
        <div class="item-main">
          <div class="item-name">${h.nama}</div>
          <div class="item-meta">${jumlahSantri} santri · Musyrif: ${musyrifNama}</div>
        </div>
        <button class="btn btn-red" onclick="hapusHalaqah(${h.id})">Hapus</button>
      </div>
    `;
  }).join('');
}

function renderHalaqahDropdowns() {
  const list = halaqahList();
  const opt = list.map(h => `<option value="${h}">${h}</option>`).join('');
  const inH = document.getElementById('inHalaqahSantri');
  if (inH) inH.innerHTML = opt || '<option value="-">-</option>';
  const fH = document.getElementById('filterHalaqahSantri');
  if (fH) fH.innerHTML = '<option value="">Semua Halaqah</option>' + opt;
  const fL = document.getElementById('filterLbHalaqah');
  if (fL) fL.innerHTML = '<option value="">Semua Halaqah</option>' + opt;
  const lH = document.getElementById('inLaporanHalaqah');
  if (lH) lH.innerHTML = '<option value="">— Pilih halaqah —</option>' + opt;
  const nM = document.getElementById('newHalaqahMusyrif');
  if (nM) {
    const musyrifKeys = Object.keys(USERS).filter(k => USERS[k].role === 'musyrif');
    nM.innerHTML = '<option value="">— Tidak ada —</option>' + musyrifKeys.map(k => `<option value="${k}">${USERS[k].nama}</option>`).join('');
  }
}