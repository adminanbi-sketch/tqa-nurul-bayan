// Database 114 surah Al-Qur’an (nama, jumlah ayat, dan juz berdasarkan rentang pembagian juz standar).
const QURAN = [
  {
    "nomor": 1,
    "surat": "Al-Fatihah",
    "ayat": 7,
    "juz": [
      1
    ]
  },
  {
    "nomor": 2,
    "surat": "Al-Baqarah",
    "ayat": 286,
    "juz": [
      1,
      2,
      3
    ]
  },
  {
    "nomor": 3,
    "surat": "Ali Imran",
    "ayat": 200,
    "juz": [
      3,
      4
    ]
  },
  {
    "nomor": 4,
    "surat": "An-Nisa",
    "ayat": 176,
    "juz": [
      4,
      5,
      6
    ]
  },
  {
    "nomor": 5,
    "surat": "Al-Ma’idah",
    "ayat": 120,
    "juz": [
      6,
      7
    ]
  },
  {
    "nomor": 6,
    "surat": "Al-An’am",
    "ayat": 165,
    "juz": [
      7,
      8
    ]
  },
  {
    "nomor": 7,
    "surat": "Al-A’raf",
    "ayat": 206,
    "juz": [
      8,
      9
    ]
  },
  {
    "nomor": 8,
    "surat": "Al-Anfal",
    "ayat": 75,
    "juz": [
      9,
      10
    ]
  },
  {
    "nomor": 9,
    "surat": "At-Taubah",
    "ayat": 129,
    "juz": [
      10,
      11
    ]
  },
  {
    "nomor": 10,
    "surat": "Yunus",
    "ayat": 109,
    "juz": [
      11
    ]
  },
  {
    "nomor": 11,
    "surat": "Hud",
    "ayat": 123,
    "juz": [
      11,
      12
    ]
  },
  {
    "nomor": 12,
    "surat": "Yusuf",
    "ayat": 111,
    "juz": [
      12,
      13
    ]
  },
  {
    "nomor": 13,
    "surat": "Ar-Ra’d",
    "ayat": 43,
    "juz": [
      13
    ]
  },
  {
    "nomor": 14,
    "surat": "Ibrahim",
    "ayat": 52,
    "juz": [
      13
    ]
  },
  {
    "nomor": 15,
    "surat": "Al-Hijr",
    "ayat": 99,
    "juz": [
      14
    ]
  },
  {
    "nomor": 16,
    "surat": "An-Nahl",
    "ayat": 128,
    "juz": [
      14
    ]
  },
  {
    "nomor": 17,
    "surat": "Al-Isra",
    "ayat": 111,
    "juz": [
      15
    ]
  },
  {
    "nomor": 18,
    "surat": "Al-Kahf",
    "ayat": 110,
    "juz": [
      15,
      16
    ]
  },
  {
    "nomor": 19,
    "surat": "Maryam",
    "ayat": 98,
    "juz": [
      16
    ]
  },
  {
    "nomor": 20,
    "surat": "Ta-Ha",
    "ayat": 135,
    "juz": [
      16
    ]
  },
  {
    "nomor": 21,
    "surat": "Al-Anbiya",
    "ayat": 112,
    "juz": [
      17
    ]
  },
  {
    "nomor": 22,
    "surat": "Al-Hajj",
    "ayat": 78,
    "juz": [
      17
    ]
  },
  {
    "nomor": 23,
    "surat": "Al-Mu’minun",
    "ayat": 118,
    "juz": [
      18
    ]
  },
  {
    "nomor": 24,
    "surat": "An-Nur",
    "ayat": 64,
    "juz": [
      18
    ]
  },
  {
    "nomor": 25,
    "surat": "Al-Furqan",
    "ayat": 77,
    "juz": [
      18,
      19
    ]
  },
  {
    "nomor": 26,
    "surat": "Asy-Syu’ara",
    "ayat": 227,
    "juz": [
      19
    ]
  },
  {
    "nomor": 27,
    "surat": "An-Naml",
    "ayat": 93,
    "juz": [
      19,
      20
    ]
  },
  {
    "nomor": 28,
    "surat": "Al-Qasas",
    "ayat": 88,
    "juz": [
      20
    ]
  },
  {
    "nomor": 29,
    "surat": "Al-Ankabut",
    "ayat": 69,
    "juz": [
      20,
      21
    ]
  },
  {
    "nomor": 30,
    "surat": "Ar-Rum",
    "ayat": 60,
    "juz": [
      21
    ]
  },
  {
    "nomor": 31,
    "surat": "Luqman",
    "ayat": 34,
    "juz": [
      21
    ]
  },
  {
    "nomor": 32,
    "surat": "As-Sajdah",
    "ayat": 30,
    "juz": [
      21
    ]
  },
  {
    "nomor": 33,
    "surat": "Al-Ahzab",
    "ayat": 73,
    "juz": [
      21,
      22
    ]
  },
  {
    "nomor": 34,
    "surat": "Saba",
    "ayat": 54,
    "juz": [
      22
    ]
  },
  {
    "nomor": 35,
    "surat": "Fatir",
    "ayat": 45,
    "juz": [
      22
    ]
  },
  {
    "nomor": 36,
    "surat": "Ya-Sin",
    "ayat": 83,
    "juz": [
      22,
      23
    ]
  },
  {
    "nomor": 37,
    "surat": "As-Saffat",
    "ayat": 182,
    "juz": [
      23
    ]
  },
  {
    "nomor": 38,
    "surat": "Sad",
    "ayat": 88,
    "juz": [
      23
    ]
  },
  {
    "nomor": 39,
    "surat": "Az-Zumar",
    "ayat": 75,
    "juz": [
      23,
      24
    ]
  },
  {
    "nomor": 40,
    "surat": "Ghafir",
    "ayat": 85,
    "juz": [
      24
    ]
  },
  {
    "nomor": 41,
    "surat": "Fussilat",
    "ayat": 54,
    "juz": [
      24,
      25
    ]
  },
  {
    "nomor": 42,
    "surat": "Asy-Syura",
    "ayat": 53,
    "juz": [
      25
    ]
  },
  {
    "nomor": 43,
    "surat": "Az-Zukhruf",
    "ayat": 89,
    "juz": [
      25
    ]
  },
  {
    "nomor": 44,
    "surat": "Ad-Dukhan",
    "ayat": 59,
    "juz": [
      25
    ]
  },
  {
    "nomor": 45,
    "surat": "Al-Jatsiyah",
    "ayat": 37,
    "juz": [
      25
    ]
  },
  {
    "nomor": 46,
    "surat": "Al-Ahqaf",
    "ayat": 35,
    "juz": [
      26
    ]
  },
  {
    "nomor": 47,
    "surat": "Muhammad",
    "ayat": 38,
    "juz": [
      26
    ]
  },
  {
    "nomor": 48,
    "surat": "Al-Fath",
    "ayat": 29,
    "juz": [
      26
    ]
  },
  {
    "nomor": 49,
    "surat": "Al-Hujurat",
    "ayat": 18,
    "juz": [
      26
    ]
  },
  {
    "nomor": 50,
    "surat": "Qaf",
    "ayat": 45,
    "juz": [
      26
    ]
  },
  {
    "nomor": 51,
    "surat": "Az-Zariyat",
    "ayat": 60,
    "juz": [
      26,
      27
    ]
  },
  {
    "nomor": 52,
    "surat": "At-Tur",
    "ayat": 49,
    "juz": [
      27
    ]
  },
  {
    "nomor": 53,
    "surat": "An-Najm",
    "ayat": 62,
    "juz": [
      27
    ]
  },
  {
    "nomor": 54,
    "surat": "Al-Qamar",
    "ayat": 55,
    "juz": [
      27
    ]
  },
  {
    "nomor": 55,
    "surat": "Ar-Rahman",
    "ayat": 78,
    "juz": [
      27
    ]
  },
  {
    "nomor": 56,
    "surat": "Al-Waqi’ah",
    "ayat": 96,
    "juz": [
      27
    ]
  },
  {
    "nomor": 57,
    "surat": "Al-Hadid",
    "ayat": 29,
    "juz": [
      27
    ]
  },
  {
    "nomor": 58,
    "surat": "Al-Mujadilah",
    "ayat": 22,
    "juz": [
      28
    ]
  },
  {
    "nomor": 59,
    "surat": "Al-Hasyr",
    "ayat": 24,
    "juz": [
      28
    ]
  },
  {
    "nomor": 60,
    "surat": "Al-Mumtahanah",
    "ayat": 13,
    "juz": [
      28
    ]
  },
  {
    "nomor": 61,
    "surat": "As-Saff",
    "ayat": 14,
    "juz": [
      28
    ]
  },
  {
    "nomor": 62,
    "surat": "Al-Jumu’ah",
    "ayat": 11,
    "juz": [
      28
    ]
  },
  {
    "nomor": 63,
    "surat": "Al-Munafiqun",
    "ayat": 11,
    "juz": [
      28
    ]
  },
  {
    "nomor": 64,
    "surat": "At-Taghabun",
    "ayat": 18,
    "juz": [
      28
    ]
  },
  {
    "nomor": 65,
    "surat": "At-Talaq",
    "ayat": 12,
    "juz": [
      28
    ]
  },
  {
    "nomor": 66,
    "surat": "At-Tahrim",
    "ayat": 12,
    "juz": [
      28
    ]
  },
  {
    "nomor": 67,
    "surat": "Al-Mulk",
    "ayat": 30,
    "juz": [
      29
    ]
  },
  {
    "nomor": 68,
    "surat": "Al-Qalam",
    "ayat": 52,
    "juz": [
      29
    ]
  },
  {
    "nomor": 69,
    "surat": "Al-Haqqah",
    "ayat": 52,
    "juz": [
      29
    ]
  },
  {
    "nomor": 70,
    "surat": "Al-Ma’arij",
    "ayat": 44,
    "juz": [
      29
    ]
  },
  {
    "nomor": 71,
    "surat": "Nuh",
    "ayat": 28,
    "juz": [
      29
    ]
  },
  {
    "nomor": 72,
    "surat": "Al-Jinn",
    "ayat": 28,
    "juz": [
      29
    ]
  },
  {
    "nomor": 73,
    "surat": "Al-Muzzammil",
    "ayat": 20,
    "juz": [
      29
    ]
  },
  {
    "nomor": 74,
    "surat": "Al-Muddatsir",
    "ayat": 56,
    "juz": [
      29
    ]
  },
  {
    "nomor": 75,
    "surat": "Al-Qiyamah",
    "ayat": 40,
    "juz": [
      29
    ]
  },
  {
    "nomor": 76,
    "surat": "Al-Insan",
    "ayat": 31,
    "juz": [
      29
    ]
  },
  {
    "nomor": 77,
    "surat": "Al-Mursalat",
    "ayat": 50,
    "juz": [
      29
    ]
  },
  {
    "nomor": 78,
    "surat": "An-Naba",
    "ayat": 40,
    "juz": [
      30
    ]
  },
  {
    "nomor": 79,
    "surat": "An-Nazi’at",
    "ayat": 46,
    "juz": [
      30
    ]
  },
  {
    "nomor": 80,
    "surat": "Abasa",
    "ayat": 42,
    "juz": [
      30
    ]
  },
  {
    "nomor": 81,
    "surat": "At-Takwir",
    "ayat": 29,
    "juz": [
      30
    ]
  },
  {
    "nomor": 82,
    "surat": "Al-Infitar",
    "ayat": 19,
    "juz": [
      30
    ]
  },
  {
    "nomor": 83,
    "surat": "Al-Mutaffifin",
    "ayat": 36,
    "juz": [
      30
    ]
  },
  {
    "nomor": 84,
    "surat": "Al-Insyiqaq",
    "ayat": 25,
    "juz": [
      30
    ]
  },
  {
    "nomor": 85,
    "surat": "Al-Buruj",
    "ayat": 22,
    "juz": [
      30
    ]
  },
  {
    "nomor": 86,
    "surat": "At-Tariq",
    "ayat": 17,
    "juz": [
      30
    ]
  },
  {
    "nomor": 87,
    "surat": "Al-A’la",
    "ayat": 19,
    "juz": [
      30
    ]
  },
  {
    "nomor": 88,
    "surat": "Al-Ghasyiyah",
    "ayat": 26,
    "juz": [
      30
    ]
  },
  {
    "nomor": 89,
    "surat": "Al-Fajr",
    "ayat": 30,
    "juz": [
      30
    ]
  },
  {
    "nomor": 90,
    "surat": "Al-Balad",
    "ayat": 20,
    "juz": [
      30
    ]
  },
  {
    "nomor": 91,
    "surat": "Asy-Syams",
    "ayat": 15,
    "juz": [
      30
    ]
  },
  {
    "nomor": 92,
    "surat": "Al-Lail",
    "ayat": 21,
    "juz": [
      30
    ]
  },
  {
    "nomor": 93,
    "surat": "Ad-Duha",
    "ayat": 11,
    "juz": [
      30
    ]
  },
  {
    "nomor": 94,
    "surat": "Asy-Syarh",
    "ayat": 8,
    "juz": [
      30
    ]
  },
  {
    "nomor": 95,
    "surat": "At-Tin",
    "ayat": 8,
    "juz": [
      30
    ]
  },
  {
    "nomor": 96,
    "surat": "Al-‘Alaq",
    "ayat": 19,
    "juz": [
      30
    ]
  },
  {
    "nomor": 97,
    "surat": "Al-Qadr",
    "ayat": 5,
    "juz": [
      30
    ]
  },
  {
    "nomor": 98,
    "surat": "Al-Bayyinah",
    "ayat": 8,
    "juz": [
      30
    ]
  },
  {
    "nomor": 99,
    "surat": "Az-Zalzalah",
    "ayat": 8,
    "juz": [
      30
    ]
  },
  {
    "nomor": 100,
    "surat": "Al-‘Adiyat",
    "ayat": 11,
    "juz": [
      30
    ]
  },
  {
    "nomor": 101,
    "surat": "Al-Qari’ah",
    "ayat": 11,
    "juz": [
      30
    ]
  },
  {
    "nomor": 102,
    "surat": "At-Takasur",
    "ayat": 8,
    "juz": [
      30
    ]
  },
  {
    "nomor": 103,
    "surat": "Al-‘Asr",
    "ayat": 3,
    "juz": [
      30
    ]
  },
  {
    "nomor": 104,
    "surat": "Al-Humazah",
    "ayat": 9,
    "juz": [
      30
    ]
  },
  {
    "nomor": 105,
    "surat": "Al-Fil",
    "ayat": 5,
    "juz": [
      30
    ]
  },
  {
    "nomor": 106,
    "surat": "Quraisy",
    "ayat": 4,
    "juz": [
      30
    ]
  },
  {
    "nomor": 107,
    "surat": "Al-Ma’un",
    "ayat": 7,
    "juz": [
      30
    ]
  },
  {
    "nomor": 108,
    "surat": "Al-Kausar",
    "ayat": 3,
    "juz": [
      30
    ]
  },
  {
    "nomor": 109,
    "surat": "Al-Kafirun",
    "ayat": 6,
    "juz": [
      30
    ]
  },
  {
    "nomor": 110,
    "surat": "An-Nasr",
    "ayat": 3,
    "juz": [
      30
    ]
  },
  {
    "nomor": 111,
    "surat": "Al-Lahab",
    "ayat": 5,
    "juz": [
      30
    ]
  },
  {
    "nomor": 112,
    "surat": "Al-Ikhlas",
    "ayat": 4,
    "juz": [
      30
    ]
  },
  {
    "nomor": 113,
    "surat": "Al-Falaq",
    "ayat": 5,
    "juz": [
      30
    ]
  },
  {
    "nomor": 114,
    "surat": "An-Nas",
    "ayat": 6,
    "juz": [
      30
    ]
  }
];
