// =========================================================
// LOGO TQA NURUL BAYAN
// =========================================================
const LOGO_DATA_URL = 'assets/img/logo-tqa.png';

// ✅ FIX: Tambahkan pengecekan (if) agar tidak error jika elemen tidak ditemukan
const logoSrcEl = document.getElementById('logoSrc');
if (logoSrcEl) logoSrcEl.src = LOGO_DATA_URL;

const headerLogoEl = document.getElementById('headerLogo');
if (headerLogoEl) headerLogoEl.src = LOGO_DATA_URL;