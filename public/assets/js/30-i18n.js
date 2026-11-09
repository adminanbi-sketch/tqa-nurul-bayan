// =========================================================
// MULTI-LANGUAGE (i18n) — ID, EN, AR
// =========================================================
const TRANSLATIONS = {
  id: {
    // Menu Sidebar
    santri: "Santri",
    setoran: "Setoran",
    absensi: "Absensi",
    mutabaah: "Mutaba'ah",
    halaqah: "Halaqah",
    peringkat: "Peringkat",
    laporan: "Laporan",
    pengaturan: "Pengaturan",
    keluar: "Keluar",
    // Statistik
    stat_santri: "Santri",
    stat_setoran: "Setoran",
    stat_hadir: "Kehadiran",
    stat_streak: "Streak",
    // Judul Box
    tambah_santri: "Tambah Data Santri",
    daftar_santri: "Daftar Santri",
    input_setoran: "Input Setoran",
    riwayat_setoran: "Riwayat Setoran",
    absensi_harian: "Absensi Harian",
    // Form
    nama_lengkap: "Nama lengkap",
    halaqah_opt: "Halaqah",
    target_juz: "Target (juz)",
    tgl_lahir: "Tanggal lahir (opsional)",
    hp_wali: "No. HP wali (opsional)",
    nama_wali: "Nama wali (opsional)",
    simpan: "Simpan",
    // ... (Anda bisa menambahkan key lainnya sesuai kebutuhan)
  },
  en: {
    santri: "Students",
    setoran: "Submissions",
    absensi: "Attendance",
    mutabaah: "Daily Habits",
    halaqah: "Groups",
    peringkat: "Leaderboard",
    laporan: "Reports",
    pengaturan: "Settings",
    keluar: "Logout",
    stat_santri: "Students",
    stat_setoran: "Submissions",
    stat_hadir: "Attendance",
    stat_streak: "Streak",
    tambah_santri: "Add Student Data",
    daftar_santri: "Student List",
    input_setoran: "Input Submission",
    riwayat_setoran: "Submission History",
    absensi_harian: "Daily Attendance",
    nama_lengkap: "Full name",
    halaqah_opt: "Group",
    target_juz: "Target (juz)",
    tgl_lahir: "Date of birth (optional)",
    hp_wali: "Parent Phone (optional)",
    nama_wali: "Parent Name (optional)",
    simpan: "Save",
  },
  ar: {
    santri: "الطلاب",
    setoran: "التسليمات",
    absensi: "الحضور",
    mutabaah: "المتابعة اليومية",
    halaqah: "الحلقات",
    peringkat: "لوحة المتصدرين",
    laporan: "التقارير",
    pengaturan: "الإعدادات",
    keluar: "تسجيل الخروج",
    stat_santri: "الطلاب",
    stat_setoran: "التسليمات",
    stat_hadir: "الحضور",
    stat_streak: "التتابع",
    tambah_santri: "إضافة بيانات طالب",
    daftar_santri: "قائمة الطلاب",
    input_setoran: "إدخال تسليم",
    riwayat_setoran: "سجل التسليمات",
    absensi_harian: "الحضور اليومي",
    nama_lengkap: "الاسم الكامل",
    halaqah_opt: "الحلقة",
    target_juz: "الهدف (جزء)",
    tgl_lahir: "تاريخ الميلاد (اختياري)",
    hp_wali: "رقم هاتف ولي الأمر (اختياري)",
    nama_wali: "اسم ولي الأمر (اختياري)",
    simpan: "حفظ",
  }
};

let currentLang = localStorage.getItem('th_lang') || 'id';

function ubahBahasa(lang) {
  currentLang = lang;
  localStorage.setItem('th_lang', lang);
  document.documentElement.lang = lang;
  
  // Ganti arah teks (RTL) jika bahasa Arab
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl-mode');
  } else {
    document.documentElement.removeAttribute('dir');
    document.body.classList.remove('rtl-mode');
  }

  applyTranslations();
  // Render ulang untuk teks yang di-generate oleh JS
  if (typeof render === 'function') render();
}

function applyTranslations() {
  const dict = TRANSLATIONS[currentLang];
  
  // Cari semua elemen yang memiliki atribut data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Jika elemen adalah input, ubah placeholder
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        // Jika tombol dengan ikon, pertahankan ikonnya (svg)
        const svg = el.querySelector('svg');
        if (svg) {
          el.innerHTML = svg.outerHTML + ' ' + dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    }
  });
}

// Panggil saat pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
  ubahBahasa(currentLang);
});