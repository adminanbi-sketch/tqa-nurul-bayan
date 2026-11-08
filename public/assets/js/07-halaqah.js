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
    renderHalaqahDropdowns(); // Panggil ulang agar dropdown musyrif terisi
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
    renderHalaqahDropdowns();
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
    el.innerHTML = `
      <div class="halaqah-empty">
        <div class="halaqah-empty-icon">📂</div>
        <h3 style="font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px;">Belum Ada Halaqah</h3>
        <p style="font-size: 13px;">Silakan buat halaqah baru menggunakan form di atas.</p>
      </div>
    `;
    return;
  }

  el.innerHTML = DB.halaqah.map(h => {
    const jumlahSantri = DB.santri.filter(s => s.halaqah === h.nama).length;
    const musyrifNama = h.musyrif ? h.musyrif : null;
    
    const iconMusyrif = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
    const iconSantri = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;

    return `
      <div class="halaqah-card">
        <div class="halaqah-card-header">
          <div>
            <div class="halaqah-title">${h.nama}</div>
            ${musyrifNama 
              ? `<div class="halaqah-badge-musyrif">${iconMusyrif} ${musyrifNama}</div>` 
              : `<div class="halaqah-badge-musyrif" style="background: var(--border-soft); color: var(--text-muted);">${iconMusyrif} Belum ada musyrif</div>`
            }
          </div>
          <button class="btn-icon-action" onclick="hapusHalaqah(${h.id})" title="Hapus Halaqah">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
        
        <div class="halaqah-stats">
          <div class="halaqah-stat-item">
            ${iconSantri} ${jumlahSantri} Santri
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ✅ FUNGSI DROPDOWN DIPERBAIKI
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

  // ✅ Ambil user dari server dengan async
  const nM = document.getElementById('newHalaqahMusyrif');
  if (nM) {
    api.getUsers().then(users => {
      nM.innerHTML = '<option value="">— Tidak ada —</option>' + 
        users.map(u => `<option value="${u.username}">${u.nama}</option>`).join('');
    }).catch(e => {
      nM.innerHTML = '<option value="">— Gagal memuat —</option>';
    });
  }
}