/**
 * DonasiBerkat Tasikmalaya - Data File
 * Contains mock data for development and testing
 * In production, this would be replaced with API calls
 */

/**
 * Featured items for homepage
 */
const featuredItems = [
  {
    id: 1,
    title: "Sepeda Anak Kondisi Sangat Baik",
    description: "Sepeda anak ukuran 16 inch, cocok untuk anak usia 4-7 tahun. Bekas tapi kondisi sangat baik, hanya beberapa goresan kecil pada bagian samping. Sepeda memiliki roda bantu yang bisa dilepas.",
    category: "Mainan & Perlengkapan Anak",
    condition: "Bekas - Kondisi 80%",
    location: "Cihideung",
    donor: "Ahmad Fauzi",
    posted: "2023-05-10",
    image: "./assets/items/sepeda-anak.jpg",
    status: "active"
  },
  {
    id: 2,
    title: "Meja Belajar Kayu Jati",
    description: "Meja belajar dari kayu jati asli, ukuran 120x60x75 cm. Kondisi masih sangat bagus, ada sedikit goresan pada bagian atas meja tapi tidak mengurangi fungsi. Meja memiliki 2 laci penyimpanan.",
    category: "Furnitur",
    condition: "Bekas - Kondisi 90%",
    location: "Tawang",
    donor: "Siti Aminah",
    posted: "2023-05-12",
    image: "./assets/items/meja-belajar.jpg",
    status: "pending"
  },
  {
    id: 3,
    title: "Buku Pelajaran SD Kelas 4-6",
    description: "Set buku pelajaran SD kelas 4-6 sesuai kurikulum terbaru. Kondisi seperti baru, tidak ada coretan atau halaman yang rusak. Total 12 buku untuk semua mata pelajaran.",
    category: "Buku & Alat Tulis",
    condition: "Bekas - Kondisi 90%",
    location: "Indihiang",
    donor: "Budi Santoso",
    posted: "2023-05-15",
    image: "./assets/items/buku-pelajaran.jpg",
    status: "completed"
  },
  {
    id: 4,
    title: "Pakaian Anak Laki-laki Usia 5-7 Tahun",
    description: "Paket pakaian anak laki-laki untuk usia 5-7 tahun. Isi 10 potong baju dan 5 potong celana. Kondisi masih bagus, tidak ada yang robek atau bernoda.",
    category: "Pakaian",
    condition: "Bekas - Kondisi 80%",
    location: "Mangkubumi",
    donor: "Rina Wati",
    posted: "2023-05-17",
    image: "./assets/items/pakaian-anak.jpg"
  },
  {
    id: 5,
    title: "Kompor Gas 2 Tungku",
    description: "Kompor gas 2 tungku merk Rinnai. Kondisi masih berfungsi dengan baik, hanya ada sedikit karatan pada bagian kaki kompor. Dilengkapi dengan selang dan regulator.",
    category: "Peralatan Rumah Tangga",
    condition: "Bekas - Kondisi 70%",
    location: "Kawalu",
    donor: "Joko Widodo",
    posted: "2023-05-19",
    image: "./assets/items/kompor-gas.jpg"
  },
  {
    id: 6,
    title: "Smartphone Android 4G",
    description: "Smartphone Android 4G dengan RAM 3GB dan penyimpanan 32GB. Layar 6 inch, kamera belakang 12MP dan depan 8MP. Kondisi masih mulus, baterai masih awet. Bonus charger dan case.",
    category: "Elektronik",
    condition: "Bekas - Kondisi 80%",
    location: "Cihideung",
    donor: "Deni Permana",
    posted: "2023-05-21",
    image: "./assets/items/smartphone.jpg"
  }
];

/**
 * Testimonial data for slider
 */
const testimonialData = [
    {
        id: 1,
        quote: "Saya bisa membantu banyak orang dengan barang-barang yang tidak saya pakai lagi. Platform ini sangat membantu untuk menyalurkan barang bekas yang masih layak pakai.",
        author: "Ahmad Rusli, Pendonor"
    },
    {
        id: 2,
        quote: "Sebagai mahasiswa dari keluarga tidak mampu, saya sangat terbantu dengan adanya platform ini untuk mendapatkan peralatan kuliah yang saya butuhkan.",
        author: "Dina Maulida, Penerima Donasi"
    },
    {
        id: 3,
        quote: "DonasiBerkat memudahkan saya menemukan barang-barang bekas berkualitas untuk anak-anak panti asuhan yang saya bina. Prosesnya sangat transparan dan aman.",
        author: "Hendra Wijaya, Pengelola Panti Asuhan"
    },
    {
        id: 4,
        quote: "Selama ini saya bingung mau diapakan barang-barang bekas yang masih bagus. Sekarang melalui DonasiBerkat barang tersebut bisa bermanfaat bagi orang lain.",
        author: "Sri Wahyuni, Pendonor"
    }
];

/**
 * Statistics data for counter section
 */
const statsData = [
    {
        label: "Barang Terdonasi",
        value: 1240
    },
    {
        label: "Pengguna Terdaftar",
        value: 750
    },
    {
        label: "Transaksi Berhasil",
        value: 980
    },
    {
        label: "Kota & Kabupaten",
        value: 15
    }
];

/**
 * Categories for filtering
 */
const categories = [
  "Pakaian",
  "Furnitur",
  "Elektronik",
  "Mainan & Perlengkapan Anak",
  "Buku & Alat Tulis",
  "Peralatan Rumah Tangga",
  "Kesehatan & Kecantikan",
  "Olahraga & Hobi",
  "Lainnya"
];

/**
 * Format a date string to Indonesian format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return "";
  
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Mock chat data for demonstration
 */
const chatData = {
  conversations: [
    {
      id: 101,
      participants: [
        { id: 1, name: 'Ahmad Fauzi', avatar: '/assets/febnawan.jpg' },
        { id: 2, name: 'Siti Aminah', avatar: '/assets/leli.jpg' }
      ],
      donation: {
        id: 1, 
        title: 'Sepeda Anak Kondisi Sangat Baik',
        image: '/assets/items/sepeda-anak.jpg'
      },
      lastMessage: {
        content: 'Baik, nanti saya kabari lagi ya',
        timestamp: '2023-10-05T14:32:00',
        senderId: 1,
        read: true
      },
      unreadCount: 0
    },
    {
      id: 102,
      participants: [
        { id: 1, name: 'Ahmad Fauzi', avatar: '/assets/febnawan.jpg' },
        { id: 3, name: 'Budi Santoso', avatar: '/assets/arie.jpg' }
      ],
      donation: {
        id: 3, 
        title: 'Buku Pelajaran SD Kelas 4-6',
        image: '/assets/items/buku-pelajaran.jpg'
      },
      lastMessage: {
        content: 'Apakah buku masih tersedia?',
        timestamp: '2023-10-05T16:14:00',
        senderId: 3,
        read: false
      },
      unreadCount: 2
    }
  ],
  messages: [
    // Conversation 101 - Sepeda
    {
      id: 1001,
      conversationId: 101,
      senderId: 2,
      content: 'Halo, apakah sepeda anak masih tersedia?',
      timestamp: '2023-10-05T10:24:00',
      read: true
    },
    {
      id: 1002,
      conversationId: 101,
      senderId: 1,
      content: 'Selamat siang, iya masih tersedia. Apakah Anda berminat?',
      timestamp: '2023-10-05T10:30:00',
      read: true
    },
    {
      id: 1003,
      conversationId: 101,
      senderId: 2,
      content: 'Iya, saya berminat. Bisa tanya kondisinya bagaimana ya?',
      timestamp: '2023-10-05T10:35:00',
      read: true
    },
    {
      id: 1004,
      conversationId: 101,
      senderId: 1,
      content: 'Kondisinya masih sangat baik, hanya ada goresan kecil di bagian samping. Rem dan rantai masih berfungsi sempurna. Roda bantu juga masih ada.',
      timestamp: '2023-10-05T10:42:00',
      read: true
    },
    {
      id: 1005,
      conversationId: 101,
      senderId: 2,
      content: 'Baik, kalau begitu kapan dan dimana bisa mengambilnya?',
      timestamp: '2023-10-05T11:05:00',
      read: true
    },
    {
      id: 1006,
      conversationId: 101,
      senderId: 1,
      content: 'Bisa diambil besok sore di alamat saya di Jl. Cikuray No. 45, Cihideung. Sekitar jam 4 sore bagaimana?',
      timestamp: '2023-10-05T11:12:00',
      read: true
    },
    {
      id: 1007,
      conversationId: 101,
      senderId: 2,
      content: 'Oke, bisa. Besok saya akan datang sekitar jam 4. Terima kasih banyak atas kebaikannya!',
      timestamp: '2023-10-05T11:30:00',
      read: true
    },
    {
      id: 1008,
      conversationId: 101,
      senderId: 1,
      content: 'Sama-sama. Sampai ketemu besok ya.',
      timestamp: '2023-10-05T11:35:00',
      read: true
    },
    {
      id: 1009,
      conversationId: 101,
      senderId: 2,
      content: 'Maaf pak, untuk besok saya mungkin akan terlambat sedikit. Kira-kira sampai jam 5 tidak apa-apa?',
      timestamp: '2023-10-05T14:20:00',
      read: true
    },
    {
      id: 1010,
      conversationId: 101,
      senderId: 1,
      content: 'Baik, nanti saya kabari lagi ya',
      timestamp: '2023-10-05T14:32:00',
      read: true
    },
    
    // Conversation 102 - Buku
    {
      id: 2001,
      conversationId: 102,
      senderId: 3,
      content: 'Selamat sore, saya tertarik dengan buku pelajaran SD yang Anda donasikan.',
      timestamp: '2023-10-05T15:45:00',
      read: false
    },
    {
      id: 2002,
      conversationId: 102,
      senderId: 3,
      content: 'Apakah buku masih tersedia?',
      timestamp: '2023-10-05T16:14:00',
      read: false
    }
  ]
};

/**
 * Mock user donations for the "Donasi Saya" page
 */
const userDonations = [
  {
    id: 101,
    title: "Lemari Pakaian 2 Pintu",
    description: "Lemari pakaian 2 pintu dari kayu jati, ukuran 120x60x200 cm. Kondisi masih kokoh dan kuat, hanya ada beberapa goresan kecil. Lemari dilengkapi dengan 2 laci di bagian bawah dan gantungan baju di bagian dalam. Cocok untuk kamar ukuran sedang.",
    category: "Furnitur",
    condition: "Bekas - Kondisi 75%",
    location: "Tawang",
    date: "2025-08-15",
    status: "completed",
    image: "./assets/items/lemari.png",
    images: [
      "./assets/items/lemari.png",
    ],
    views: 67,
    interested: 5
  },
  {
    id: 102,
    title: "Seragam Sekolah SD Ukuran 9-10 tahun",
    description: "Paket seragam sekolah SD untuk anak usia 9-10 tahun. Terdiri dari 2 seragam putih merah, 2 batik, dan 1 pramuka. Kondisi masih sangat bagus, hanya dipakai satu semester. Ukuran baju lebar 40cm, panjang 55cm. Ukuran celana/rok lingkar pinggang 60cm (ada karet), panjang 70cm.",
    category: "Pakaian",
    condition: "Bekas - Kondisi 90%",
    location: "Indihiang",
    date: "2025-10-05",
    status: "pending",
    image: "./assets/items/seragam-sd.jpg",
    images: [
      "./assets/items/seragam-sd.jpg",
      "./assets/items/seragam-sd-2.jpg"
    ],
    views: 12,
    interested: 0
  }
];
