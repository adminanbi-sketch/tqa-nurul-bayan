// =========================================================
// CUSTOM CONFIRM
// =========================================================
let confirmResolve = null;

function konfirmasi(msg, opts = {}) {
  return new Promise(resolve => {
    confirmResolve = resolve;
    document.getElementById('cfTitle').textContent = opts.title || 'Konfirmasi';
    document.getElementById('cfMsg').textContent = msg;
    const okBtn = document.getElementById('cfOkBtn');
    okBtn.textContent = opts.okText || 'Ya, Lanjutkan';
    okBtn.className = 'btn btn-confirm' + (opts.danger === false ? ' safe' : '');
    document.getElementById('confirmOverlay').classList.add('on');
  });
}

function confirmOk() {
  document.getElementById('confirmOverlay').classList.remove('on');
  if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
}

function confirmCancel() {
  document.getElementById('confirmOverlay').classList.remove('on');
  if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
}

// Enter = OK, Esc = Cancel
document.addEventListener('keydown', e => {
  const overlay = document.getElementById('confirmOverlay');
  if (!overlay.classList.contains('on')) return;
  if (e.key === 'Enter') confirmOk();
  if (e.key === 'Escape') confirmCancel();
});
