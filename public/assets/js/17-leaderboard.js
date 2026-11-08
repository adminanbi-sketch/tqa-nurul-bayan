// =========================================================
// LEADERBOARD — Desain Modern
// =========================================================
let lbMode = 'setoran';

function filterLeaderboard(mode, btn) {
  lbMode = mode;
  document.querySelectorAll('#panel-leaderboard .chip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderLeaderboard();
}

function renderLeaderboard() {
  const el = document.getElementById('listLeaderboard');
  if (!el) return;

  const fHal = document.getElementById('filterLbHalaqah')?.value || '';
  let list = santriTerlihat();
  if (fHal) list = list.filter(s => s.halaqah === fHal);

  if (list.length === 0) {
    el.innerHTML = `
      <div class="nodata" style="padding: 40px; text-align: center; color: var(--text-muted);">
        <div style="font-size: 40px; margin-bottom: 12px;">🏆</div>
        <div style="font-weight: 600;">Belum ada data</div>
        <div style="font-size: 12px;">Tambahkan santri atau pilih halaqah lain.</div>
      </div>`;
    return;
  }

  const scored = list.map(s => {
    const st = statistik(s.id);
    let value, meta;
    if (lbMode === 'setoran') {
      value = st.setoran.length;
      meta = `${st.juzLancar.length} juz lancar`;
    } else if (lbMode === 'kehadiran') {
      value = st.persenHadir;
      meta = `${st.absen.filter(a => a.status === 'Hadir').length} hari hadir`;
    } else {
      value = st.rataMut;
      meta = `${st.mutabaah.length} hari mutaba'ah`;
    }
    return { s, value, meta };
  });

  scored.sort((a, b) => b.value - a.value);

  el.innerHTML = scored.map((d, i) => {
    // Tentukan warna medali berdasarkan peringkat
    let rankClass = '';
    let rankIcon = i + 1;
    let borderColor = 'var(--border)';
    
    if (i === 0) {
      rankClass = 'rank-1';
      rankIcon = '🥇';
      borderColor = '#fbbf24'; // Emas
    } else if (i === 1) {
      rankClass = 'rank-2';
      rankIcon = '🥈';
      borderColor = '#94a3b8'; // Perak
    } else if (i === 2) {
      rankClass = 'rank-3';
      rankIcon = '🥉';
      borderColor = '#d97706'; // Perunggu
    }

    return `
      <div class="lb-item ${rankClass}" style="
        display: flex; align-items: center; gap: 16px;
        padding: 16px; background: var(--bg-card);
        border: 1px solid ${borderColor}; border-radius: 12px;
        margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: transform 0.2s;
      ">
        <div class="lb-rank" style="
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--bg-input); display: flex; align-items: center;
          justify-content: center; font-size: ${i < 3 ? '20px' : '16px'};
          font-weight: 800; color: var(--text-muted); flex-shrink: 0;
        ">
          ${rankIcon}
        </div>
        
        <div class="lb-info" style="flex: 1;">
          <div class="lb-name" style="font-size: 15px; font-weight: 700; color: var(--text);">
            ${d.s.nama}
          </div>
          <div class="lb-meta" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            ${d.s.halaqah} · ${d.meta}
          </div>
        </div>
        
        <div class="lb-value" style="
          font-size: 18px; font-weight: 800; color: var(--primary);
          background: var(--primary-soft); padding: 6px 14px;
          border-radius: 20px; flex-shrink: 0;
        ">
          ${d.value}${lbMode !== 'setoran' ? '%' : ''}
        </div>
      </div>
    `;
  }).join('');
}