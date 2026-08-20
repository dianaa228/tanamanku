// Data mock Tanamanku — pengganti backend Laravel selama pengembangan.
// Struktur mengikuti docs/05-database.json & docs/06-api.json.

export const demoUser = {
  id: 1,
  name: 'Rina Kartika',
  email: 'rina@tanamanku.id',
  phone: '0812-3456-7890',
  role: 'customer',
  avatar: '🧑‍🌾',
  memberSince: '2025-11-03',
  address: {
    label: 'Rumah',
    recipient: 'Rina Kartika',
    phone: '0812-3456-7890',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    street: 'Jl. Senopati No. 12, RT 04/RW 02',
    postalCode: '12190',
  },
  stats: { plants: 4, orders: 12, posts: 8 },
}

export const categories = [
  { id: 1, slug: 'tanaman-hias', name: 'Tanaman Hias', icon: '🪴', count: 24, gradient: 'from-leaf-400 to-emerald-600', tagline: 'Hijaukan ruanganmu' },
  { id: 2, slug: 'sayuran-herbal', name: 'Sayuran & Herbal', icon: '🥬', count: 18, gradient: 'from-lime-400 to-green-600', tagline: 'Pangan segar dari rumah' },
  { id: 3, slug: 'buah', name: 'Buah', icon: '🍅', count: 9, gradient: 'from-red-400 to-rose-600', tagline: 'Panen manis di balkon' },
  { id: 4, slug: 'media-tanam', name: 'Media Tanam', icon: '🪨', count: 15, gradient: 'from-soil-300 to-soil-600', tagline: 'Fondasi tumbuh subur' },
  { id: 5, slug: 'pupuk-nutrisi', name: 'Pupuk & Nutrisi', icon: '🧪', count: 12, gradient: 'from-amber-300 to-orange-500', tagline: 'Nutrisi tanaman terbaik' },
  { id: 6, slug: 'peralatan', name: 'Peralatan Berkebun', icon: '🛠️', count: 20, gradient: 'from-slate-400 to-slate-600', tagline: 'Berkebun jadi mudah' },
  { id: 7, slug: 'pot-dekorasi', name: 'Pot & Dekorasi', icon: '🏺', count: 16, gradient: 'from-fuchsia-300 to-purple-500', tagline: 'Tampil cantik di rumah' },
]

export const products = [
  {
    id: 1, slug: 'monstera-deliciosa', name: 'Monstera Deliciosa 60–80cm', categoryId: 1,
    storeName: 'Nursery Hijau Lestari', storeId: 1, emoji: '🌿', gradient: 'from-leaf-400 to-emerald-700',
    price: 145000, originalPrice: 175000, rating: 4.9, reviewCount: 214, stock: 12, sold: 340, careLevel: 'mudah',
    tags: ['Tanaman Indoor', 'Filter Udara', 'Populer'],
    description:
      'Monstera ikonik dengan daun berlubang yang menawan. Tumbuh subur di dalam ruangan dengan cahaya tidak langsung. Menjadi pusat perhatian di ruang tamu maupun kantor.',
    benefits: ['Membersihkan udara', 'Cocok untuk pemula', 'Tumbuh cepat & mudah diperbanyak'],
    variants: ['Polos 60cm', 'Polos 80cm', 'Marbel 80cm'],
  },
  {
    id: 2, slug: 'sirih-gading-golden', name: 'Sirih Gading Golden Pothos', categoryId: 1,
    storeName: 'KebunKita', storeId: 2, emoji: '🍃', gradient: 'from-lime-300 to-green-600',
    price: 35000, originalPrice: null, rating: 4.8, reviewCount: 456, stock: 45, sold: 1200, careLevel: 'mudah',
    tags: ['Gantung', 'Tahan Banting', 'Hemat'],
    description:
      'Rambat hijau dengan corak kuning emas yang cantik. Tanaman paling tahan banting — cocok untuk area minim cahaya sekalipun.',
    benefits: ['Tahan di segala kondisi', 'Mudah diperbanyak dengan stek', 'Cocok digantung'],
    variants: ['Pot 15cm', 'Pot Gantung 20cm'],
  },
  {
    id: 3, slug: 'aglonema-lipstick', name: 'Aglonema Lipstick', categoryId: 1,
    storeName: 'Nursery Hijau Lestari', storeId: 1, emoji: '🪴', gradient: 'from-rose-300 to-red-500',
    price: 89000, originalPrice: 99000, rating: 4.7, reviewCount: 132, stock: 8, sold: 210, careLevel: 'sedang',
    tags: ['Daun Merah', 'Koleksi', 'Rare'],
    description:
      'Aglonema dengan semburat merah lipstik di daunnya. Koleksi wajib pecinta tanaman hias — elegan di meja maupun rak.',
    benefits: ['Warna daun unik', 'Toleran cahaya rendah', 'Perawatan ringan'],
    variants: ['Tinggi 25cm', 'Tinggi 35cm'],
  },
  {
    id: 4, slug: 'lidah-mertua-sansevieria', name: 'Lidah Mertua (Sansevieria) 40cm', categoryId: 1,
    storeName: 'KebunKita', storeId: 2, emoji: '🌵', gradient: 'from-emerald-400 to-teal-600',
    price: 55000, originalPrice: null, rating: 4.8, reviewCount: 301, stock: 30, sold: 890, careLevel: 'mudah',
    tags: ['Anti Polusi', 'Minimal Watering', 'Kamar'],
    description:
      'Ratu tanaman pembersih udara. Menghasilkan oksigen di malam hari — paling pas diletakkan di kamar tidur.',
    benefits: ['Filter udara terbaik', 'Hemat air', 'Ideal untuk kamar'],
    variants: ['Pot 17cm', 'Pot 25cm'],
  },
  {
    id: 5, slug: 'pakcoy-hidroponik', name: 'Pakcoy Hidroponik Siap Panen', categoryId: 2,
    storeName: 'Urban Farm Serpong', storeId: 3, emoji: '🥬', gradient: 'from-green-400 to-emerald-600',
    price: 25000, originalPrice: null, rating: 4.9, reviewCount: 88, stock: 50, sold: 460, careLevel: 'mudah',
    tags: ['Hidroponik', 'Panen 30 Hari', 'Organik'],
    description:
      'Bibit pakcoy hidroponik siap tanam. Dalam 30 hari sudah bisa dipanen untuk tumis atau sup segar.',
    benefits: ['Tanpa tanah', 'Panen cepat', 'Nutrisi terkontrol'],
    variants: ['6 Lubang', '12 Lubang'],
  },
  {
    id: 6, slug: 'cabai-rawit-keriting', name: 'Cabai Rawit Keriting 20cm', categoryId: 2,
    storeName: 'Urban Farm Serpong', storeId: 3, emoji: '🌶️', gradient: 'from-red-500 to-rose-700',
    price: 28000, originalPrice: 32000, rating: 4.6, reviewCount: 154, stock: 25, sold: 620, careLevel: 'sedang',
    tags: ['Balkon', 'Matahari Penuh', 'Sambal'],
    description:
      'Tanaman cabai rawit keriting yang produktif. Butuh sinar matahari penuh — panen hingga ratusan buah per musim.',
    benefits: ['Produktivitas tinggi', 'Bisa ditanam di pot', 'Hemat belanja dapur'],
    variants: ['Bibit 20cm', 'Bibit 30cm'],
  },
  {
    id: 7, slug: 'kemangi-aromatik', name: 'Kemangi Aromatik', categoryId: 2,
    storeName: 'KebunKita', storeId: 2, emoji: '🌿', gradient: 'from-lime-400 to-green-500',
    price: 15000, originalPrice: null, rating: 4.7, reviewCount: 97, stock: 60, sold: 510, careLevel: 'mudah',
    tags: ['Herbal', 'Aroma Wangi', 'Cepat Panen'],
    description:
      'Kemangi wangi untuk lalapan dan pelengkap masakan. Petik daunnya secara rutin agar semakin rimbun.',
    benefits: ['Panen pertama 2 minggu', 'Wanginya menenangkan', 'Mudah dirawat'],
    variants: ['Pot 12cm'],
  },
  {
    id: 8, slug: 'tomat-cherry-sweet-100', name: 'Tomat Cherry Sweet 100', categoryId: 3,
    storeName: 'Urban Farm Serpong', storeId: 3, emoji: '🍅', gradient: 'from-orange-400 to-red-600',
    price: 32000, originalPrice: null, rating: 4.8, reviewCount: 121, stock: 18, sold: 380, careLevel: 'sedang',
    tags: ['Sweet', 'Buah Balkon', 'Produktif'],
    description:
      'Tomat cherry super manis. Cocok untuk balkon dengan sinar matahari pagi yang cukup.',
    benefits: ['Rasa manis legit', 'Berbuah lebat', 'Kandungan likopen tinggi'],
    variants: ['Bibit 15cm', 'Bibit 25cm'],
  },
  {
    id: 9, slug: 'tanah-humus-subur', name: 'Tanah Humus Subur 5L', categoryId: 4,
    storeName: 'MediaTani', storeId: 4, emoji: '🪨', gradient: 'from-soil-300 to-soil-600',
    price: 22000, originalPrice: null, rating: 4.9, reviewCount: 233, stock: 100, sold: 1500, careLevel: 'mudah',
    tags: ['Organik', 'Drainase Baik', 'Campuran'],
    description:
      'Tanah humus berkualitas kaya unsur hara, tekstur gembur dengan drainase optimal untuk hampir semua tanaman.',
    benefits: ['Kaya nutrisi alami', 'Gembur & mudah disiram', 'Cocok semua tanaman'],
    variants: ['Kemasan 5L', 'Kemasan 15L'],
  },
  {
    id: 10, slug: 'cocopeat-serabut-kelapa', name: 'Cocopeat Serabut Kelapa 3kg', categoryId: 4,
    storeName: 'MediaTani', storeId: 4, emoji: '🥥', gradient: 'from-amber-200 to-soil-400',
    price: 18000, originalPrice: null, rating: 4.7, reviewCount: 176, stock: 80, sold: 980, careLevel: 'mudah',
    tags: ['Serbaguna', 'Hidroponik', 'Ringan'],
    description:
      'Media tanam dari serabut kelapa, tahan air, ringan, dan serbaguna untuk hidroponik maupun campuran pot.',
    benefits: ['Menahan kelembapan', 'Ramah lingkungan', 'Menggemburkan akar'],
    variants: ['3kg', '8kg'],
  },
  {
    id: 11, slug: 'pupuk-npk-mutiara', name: 'Pupuk NPK Mutiara 16-16-16 1kg', categoryId: 5,
    storeName: 'MediaTani', storeId: 4, emoji: '🧪', gradient: 'from-sky-300 to-blue-500',
    price: 30000, originalPrice: 36000, rating: 4.8, reviewCount: 289, stock: 65, sold: 2100, careLevel: 'mudah',
    tags: ['Slow Release', 'Terlaris', 'Serbaguna'],
    description:
      'Pupuk NPK seimbang untuk pertumbuhan daun, batang, dan buah. Larut perlahan — cukup 2 minggu sekali.',
    benefits: ['Kandungan lengkap NPK', 'Aman untuk semua tanaman', 'Hasil cepat terlihat'],
    variants: ['Kemasan 1kg', 'Kemasan 5kg'],
  },
  {
    id: 12, slug: 'nutrisi-ab-mix-hidroponik', name: 'Nutrisi AB Mix Hidroponik 500ml', categoryId: 5,
    storeName: 'Urban Farm Serpong', storeId: 3, emoji: '🧫', gradient: 'from-teal-300 to-cyan-600',
    price: 60000, originalPrice: null, rating: 4.9, reviewCount: 67, stock: 40, sold: 290, careLevel: 'sedang',
    tags: ['Hidroponik', 'Formula Lengkap', 'Sayuran'],
    description:
      'Set nutrisi A dan B untuk semua sistem hidroponik. Formula makro & mikro lengkap untuk sayur daun dan buah.',
    benefits: ['Mudah dilarutkan', 'Pertumbuhan cepat', 'Cukup untuk 100 liter'],
    variants: ['500ml', '1 Liter'],
  },
  {
    id: 13, slug: 'sprayer-tanaman-1l', name: 'Sprayer Tanaman 1 Liter', categoryId: 6,
    storeName: 'Toko Taman Raya', storeId: 5, emoji: '🚿', gradient: 'from-emerald-300 to-green-600',
    price: 45000, originalPrice: null, rating: 4.6, reviewCount: 142, stock: 35, sold: 520, careLevel: 'mudah',
    tags: ['Misting', 'Ergonomis', 'Wajib Punya'],
    description:
      'Sprayer kabut halus untuk menyemprot daun dan media semai. Nyaman digenggam, nozzle bisa diatur.',
    benefits: ['Kabut halus merata', 'Tidak membuat tangan pegal', 'Cocok untuk misting anggrek'],
    variants: ['1 Liter', '2 Liter'],
  },
  {
    id: 14, slug: 'set-hidroponik-mini', name: 'Set Hidroponik Mini 12 Lubang', categoryId: 6,
    storeName: 'Urban Farm Serpong', storeId: 3, emoji: '🌱', gradient: 'from-lime-400 to-emerald-500',
    price: 75000, originalPrice: 95000, rating: 4.7, reviewCount: 58, stock: 22, sold: 160, careLevel: 'sedang',
    tags: ['Starter Kit', 'Netpot', 'Balkon'],
    description:
      'Starter kit hidroponik lengkap: netpot, rockwool, dan nutrisi awal. Mulai berkebun tanpa tanah di rumah.',
    benefits: ['Semua termasuk', 'Pasang 15 menit', 'Cocok untuk pemula'],
    variants: ['12 Lubang', '24 Lubang'],
  },
  {
    id: 15, slug: 'pot-terakota-20cm', name: 'Pot Terakota 20cm', categoryId: 7,
    storeName: 'Toko Taman Raya', storeId: 5, emoji: '🏺', gradient: 'from-orange-300 to-soil-600',
    price: 42000, originalPrice: null, rating: 4.8, reviewCount: 198, stock: 55, sold: 760, careLevel: 'mudah',
    tags: ['Classic', 'Porositas Baik', 'Estetik'],
    description:
      'Pot tanah liat klasik dengan porositas sempurna — akar bernapas dan tidak mudah busuk.',
    benefits: ['Drainase alami', 'Tampilan hangat', 'Awet bertahun-tahun'],
    variants: ['15cm', '20cm', '25cm'],
  },
  {
    id: 16, slug: 'pot-gantung-rotan', name: 'Pot Gantung Rotan 22cm', categoryId: 7,
    storeName: 'KebunKita', storeId: 2, emoji: '🧺', gradient: 'from-amber-300 to-soil-500',
    price: 58000, originalPrice: 69000, rating: 4.6, reviewCount: 74, stock: 28, sold: 240, careLevel: 'mudah',
    tags: ['Boho', 'Gantung', 'Natural'],
    description:
      'Pot gantung rotan anyaman yang membawa nuansa hangat ke sudut ruangan. Lengkap dengan tali gantung.',
    benefits: ['Tampilan boho', 'Ringan & kuat', 'Cocok untuk sirih gading'],
    variants: ['Diameter 22cm', 'Diameter 28cm'],
  },
]

export const plantSpecies = [
  {
    id: 1, slug: 'monstera-deliciosa', name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa',
    emoji: '🌿', gradient: 'from-leaf-400 to-emerald-700', careLevel: 'mudah', growth: '60–90 hari',
    light: 'Cahaya terang tidak langsung', water: 'Siram saat 50% tanah kering (tiap 5–7 hari)',
    humidity: 'Sedang–tinggi (50–70%)', temperature: '18–29°C',
    tips: ['Bersihkan daun sebulan sekali agar fotosintesis optimal', 'Putar pot sepekan sekali agar tumbuh merata', 'Tiang lumut membantu daun tumbuh lebih besar'],
  },
  {
    id: 2, slug: 'sirih-gading', name: 'Sirih Gading', scientificName: 'Epipremnum aureum',
    emoji: '🍃', gradient: 'from-lime-300 to-green-600', careLevel: 'mudah', growth: '30–60 hari',
    light: 'Cahaya rendah hingga sedang', water: 'Siram saat tanah kering (tiap 7–10 hari)',
    humidity: 'Sedang (40–60%)', temperature: '18–30°C',
    tips: ['Tahan di kamar mandi berjendela', 'Perbanyak dengan stek di air', 'Pangkas sulur panjang agar rimbun'],
  },
  {
    id: 3, slug: 'aglonema', name: 'Aglonema', scientificName: 'Aglaonema commutatum',
    emoji: '🪴', gradient: 'from-rose-300 to-red-500', careLevel: 'sedang', growth: '45–75 hari',
    light: 'Cahaya tidak langsung', water: 'Jaga tanah lembap, jangan becek (tiap 5–7 hari)',
    humidity: 'Tinggi (60%+)', temperature: '20–28°C',
    tips: ['Daun kuning = terlalu banyak air', 'Semprot daun untuk kelembapan ekstra', 'Jauhkan dari AC langsung'],
  },
  {
    id: 4, slug: 'lidah-mertua', name: 'Lidah Mertua', scientificName: 'Dracaena trifasciata',
    emoji: '🌵', gradient: 'from-emerald-400 to-teal-600', careLevel: 'mudah', growth: '30–50 hari',
    light: 'Cahaya rendah hingga terang', water: 'Siram hemat (tiap 14–21 hari)',
    humidity: 'Rendah–sedang', temperature: '16–29°C',
    tips: ['Paling tahan jika sering lupa menyiram', 'Hindari genangan air di tengah daun', 'Berikan cahaya lebih untuk varian berpita kuning'],
  },
  {
    id: 5, slug: 'cabai-rawit', name: 'Cabai Rawit', scientificName: 'Capsicum frutescens',
    emoji: '🌶️', gradient: 'from-red-500 to-rose-700', careLevel: 'sedang', growth: '70–90 hari',
    light: 'Matahari penuh (6+ jam)', water: 'Siram rutin tiap 1–2 hari',
    humidity: 'Sedang', temperature: '21–32°C',
    tips: ['Goyangkan bunga agar penyerbukan maksimal', 'Panen saat buah merah menyala', 'Pupuk fosfor tinggi saat mulai berbunga'],
  },
  {
    id: 6, slug: 'tomat-cherry', name: 'Tomat Cherry', scientificName: 'Solanum lycopersicum var. cerasiforme',
    emoji: '🍅', gradient: 'from-orange-400 to-red-600', careLevel: 'sedang', growth: '60–80 hari',
    light: 'Matahari penuh (6+ jam)', water: 'Siram rutin, jaga kelembapan tanah',
    humidity: 'Sedang', temperature: '20–30°C',
    tips: ['Pasang ajir saat tanaman 20cm', 'Kurangi daun bawah agar buah terkena cahaya', 'Panen saat warna merah merata'],
  },
  {
    id: 7, slug: 'kemangi', name: 'Kemangi', scientificName: 'Ocimum basilicum',
    emoji: '🌿', gradient: 'from-lime-400 to-green-500', careLevel: 'mudah', growth: '20–30 hari',
    light: 'Matahari pagi–siang', water: 'Siram tiap 1–2 hari, tanah jangan kering',
    humidity: 'Sedang–tinggi', temperature: '20–32°C',
    tips: ['Petik pucuk agar bercabang & rimbun', 'Buang bunga sebelum mekar penuh agar daun tetap wangi', 'Panen dari atas, sisakan 2–3 ruas'],
  },
  {
    id: 8, slug: 'aloe-vera', name: 'Lidah Buaya', scientificName: 'Aloe barbadensis miller',
    emoji: '🌵', gradient: 'from-green-400 to-emerald-600', careLevel: 'mudah', growth: '45–60 hari',
    light: 'Cahaya terang tidak langsung', water: 'Siram hemat (tiap 10–14 hari)',
    humidity: 'Rendah–sedang', temperature: '15–29°C',
    tips: ['Dagingnya bisa untuk gel perawatan kulit', 'Pot harus punya lubang drainase', 'Hindari sinar sore yang menyengat'],
  },
]

export const userPlants = [
  {
    id: 1, speciesId: 1, nickname: 'Momo', location: 'Ruang Tamu', pot: 'Terakota 25cm',
    plantedAt: '2026-03-14', status: 'perlu-air', height: 68, waterFrequency: 6,
    lastWatered: '2026-08-08', nextWater: '2026-08-10', photoGradient: 'from-leaf-400 to-emerald-700',
    growthLogs: [
      { date: '2026-07-15', height: 60 }, { date: '2026-07-22', height: 62 },
      { date: '2026-07-29', height: 63 }, { date: '2026-08-05', height: 66 }, { date: '2026-08-09', height: 68 },
    ],
  },
  {
    id: 2, speciesId: 5, nickname: 'Cabe Kecil', location: 'Balkon', pot: 'Pot Plastik 20cm',
    plantedAt: '2026-05-02', status: 'sehat', height: 42, waterFrequency: 2,
    lastWatered: '2026-08-09', nextWater: '2026-08-11', photoGradient: 'from-red-500 to-rose-700',
    growthLogs: [
      { date: '2026-07-01', height: 25 }, { date: '2026-07-12', height: 30 },
      { date: '2026-07-24', height: 35 }, { date: '2026-08-03', height: 39 }, { date: '2026-08-10', height: 42 },
    ],
  },
  {
    id: 3, speciesId: 2, nickname: 'Gading', location: 'Dapur', pot: 'Pot Gantung Rotan',
    plantedAt: '2026-02-20', status: 'sehat', height: 35, waterFrequency: 8,
    lastWatered: '2026-08-07', nextWater: '2026-08-15', photoGradient: 'from-lime-300 to-green-600',
    growthLogs: [
      { date: '2026-07-10', height: 28 }, { date: '2026-07-20', height: 30 },
      { date: '2026-07-30', height: 32 }, { date: '2026-08-09', height: 35 },
    ],
  },
  {
    id: 4, speciesId: 8, nickname: 'Alo', location: 'Kamar Tidur', pot: 'Pot Keramik 18cm',
    plantedAt: '2026-01-05', status: 'perhatian', height: 30, waterFrequency: 12,
    lastWatered: '2026-08-02', nextWater: '2026-08-14', photoGradient: 'from-green-400 to-emerald-600',
    growthLogs: [
      { date: '2026-07-05', height: 27 }, { date: '2026-07-18', height: 28 },
      { date: '2026-08-01', height: 29 }, { date: '2026-08-10', height: 30 },
    ],
  },
]

export const reminders = [
  { id: 1, userPlantId: 1, type: 'siram', frequency: 6, nextDue: '2026-08-10', isActive: true },
  { id: 2, userPlantId: 1, type: 'pupuk', frequency: 14, nextDue: '2026-08-16', isActive: true },
  { id: 3, userPlantId: 2, type: 'siram', frequency: 2, nextDue: '2026-08-11', isActive: true },
  { id: 4, userPlantId: 2, type: 'cek-hama', frequency: 7, nextDue: '2026-08-12', isActive: true },
  { id: 5, userPlantId: 3, type: 'siram', frequency: 8, nextDue: '2026-08-15', isActive: true },
  { id: 6, userPlantId: 1, type: 'repot', frequency: 365, nextDue: '2026-11-02', isActive: true },
  { id: 7, userPlantId: 4, type: 'siram', frequency: 12, nextDue: '2026-08-14', isActive: true },
]

export const communityPosts = [
  {
    id: 1, author: 'Rina Kartika', avatar: '🧑‍🌾', time: '2026-08-10T08:30:00',
    content: 'Momo akhirnya tumbuh daun baru! 🌿 Dari 4 daun jadi 7 dalam sebulan. Rahasianya: cahaya terang tidak langsung + rutin membersihkan daun.',
    emoji: '🌿', gradient: 'from-leaf-400 to-emerald-600', likes: 48, liked: true,
    comments: [
      { author: 'Budi Setiawan', avatar: '👨‍🔧', time: '2026-08-10T09:12:00', content: 'Wah, bagus sekali! Daunnya mengkilap. Pakai pupuk apa, Kak?' },
      { author: 'Sari Wulandari', avatar: '👩‍🌾', time: '2026-08-10T09:40:00', content: 'Tips membersihkan daunnya gimana? Pakai apa?' },
    ],
  },
  {
    id: 2, author: 'Budi Setiawan', avatar: '👨‍🔧', time: '2026-08-09T19:45:00',
    content: 'Hasil panen cabai pertama di balkon! 🌶️ 34 buah dari satu tanaman. Beli bibitnya di Tanamanku kemarin, tumbuh cepat banget.',
    emoji: '🌶️', gradient: 'from-red-500 to-rose-700', likes: 63, liked: false,
    comments: [
      { author: 'Rina Kartika', avatar: '🧑‍🌾', time: '2026-08-09T20:05:00', content: 'Hebat! Cabainya montok semua. Di-siram tiap hari?' },
    ],
  },
  {
    id: 3, author: 'Sari Wulandari', avatar: '👩‍🌾', time: '2026-08-09T14:10:00',
    content: 'Tips dari pengalaman: kalau daun aglonema menguning, cek dulu akarnya. Kemungkinan besar overwatering! 🪴 Jangan disiram dulu 1 minggu.',
    emoji: '🪴', gradient: 'from-rose-300 to-red-500', likes: 91, liked: true,
    comments: [
      { author: 'Andi Pratama', avatar: '👨‍💻', time: '2026-08-09T15:22:00', content: 'Setuju! Aku hampir kehilangan aglonemaku karena itu.' },
    ],
  },
  {
    id: 4, author: 'Andi Pratama', avatar: '👨‍💻', time: '2026-08-08T10:00:00',
    content: 'Coba fitur Plant Finder di Tanamanku — direkomendasikan Sirih Gading untuk apartemenku yang minim cahaya. 3 bulan kemudian... lihat hasilnya! 🍃',
    emoji: '🍃', gradient: 'from-lime-300 to-green-600', likes: 127, liked: false,
    comments: [
      { author: 'Rina Kartika', avatar: '🧑‍🌾', time: '2026-08-08T11:30:00', content: 'Rimbun banget! Rekomendasi Tanamanku emang jitu.' },
      { author: 'Dewi Lestari', avatar: '👩‍🎨', time: '2026-08-08T12:00:00', content: 'Wah, langsung jadi. Mau coba juga!' },
    ],
  },
  {
    id: 5, author: 'Dewi Lestari', avatar: '👩‍🎨', time: '2026-08-07T16:20:00',
    content: 'Taman kering (xeriscape) versi mini di teras! 🌵 Dengan lidah mertua, lidah buaya, dan kaktus. Perawatan super ringan, cocok yang sering dinas.',
    emoji: '🌵', gradient: 'from-emerald-400 to-teal-600', likes: 76, liked: false,
    comments: [],
  },
]

export const orders = [
  {
    id: 'ORD-20260810-001', date: '2026-08-10T09:15:00', status: 'shipped',
    payment: { method: 'QRIS', reference: 'QRIS-884211', status: 'paid' },
    shipment: { courier: 'JNE Express', tracking: 'JNE8823114502', eta: '11 Agu' },
    address: { ...demoUser.address },      items: [
        { productId: 1, slug: 'monstera-deliciosa', name: 'Monstera Deliciosa 60–80cm', emoji: '🌿', gradient: 'from-leaf-400 to-emerald-700', qty: 1, price: 145000, variant: 'Polos 60cm' },
        { productId: 10, slug: 'cocopeat-serabut-kelapa', name: 'Cocopeat Serabut Kelapa 3kg', emoji: '🥥', gradient: 'from-amber-200 to-soil-400', qty: 2, price: 18000, variant: '3kg' },
      ],
    subtotal: 181000, shippingCost: 15000, discount: 0, total: 196000,
  },
  {
    id: 'ORD-20260805-002', date: '2026-08-05T13:40:00', status: 'delivered',
    payment: { method: 'E-Wallet (OVO)', reference: 'OVO-551022', status: 'paid' },
    shipment: { courier: 'SiCepat', tracking: 'SPX99018233', eta: 'Selesai' },
    address: { ...demoUser.address },      items: [
        { productId: 5, slug: 'pakcoy-hidroponik', name: 'Pakcoy Hidroponik Siap Panen', emoji: '🥬', gradient: 'from-green-400 to-emerald-600', qty: 1, price: 25000, variant: '6 Lubang' },
        { productId: 12, slug: 'nutrisi-ab-mix-hidroponik', name: 'Nutrisi AB Mix Hidroponik 500ml', emoji: '🧫', gradient: 'from-teal-300 to-cyan-600', qty: 1, price: 60000, variant: '500ml' },
      ],
    subtotal: 85000, shippingCost: 15000, discount: 5000, total: 95000,
  },
  {
    id: 'ORD-20260728-003', date: '2026-07-28T10:05:00', status: 'completed',
    payment: { method: 'Transfer Bank (BCA VA)', reference: 'VA-771220', status: 'paid' },
    shipment: { courier: 'J&T Express', tracking: 'JT88230112', eta: 'Selesai' },
    address: { ...demoUser.address },      items: [
        { productId: 11, slug: 'pupuk-npk-mutiara', name: 'Pupuk NPK Mutiara 16-16-16 1kg', emoji: '🧪', gradient: 'from-sky-300 to-blue-500', qty: 1, price: 30000, variant: '1kg' },
        { productId: 15, slug: 'pot-terakota-20cm', name: 'Pot Terakota 20cm', emoji: '🏺', gradient: 'from-orange-300 to-soil-600', qty: 2, price: 42000, variant: '20cm' },
        { productId: 13, slug: 'sprayer-tanaman-1l', name: 'Sprayer Tanaman 1 Liter', emoji: '🚿', gradient: 'from-emerald-300 to-green-600', qty: 1, price: 45000, variant: '1 Liter' },
      ],
    subtotal: 159000, shippingCost: 15000, discount: 0, total: 174000,
  },
]

export const diagnosisRules = [
  {
    id: 'overwatering', symptoms: ['daun-kuning', 'daun-layu', 'tanah-basah'],
    emoji: '💦', title: 'Kemungkinan Overwatering (Kelebihan Air)', severity: 'sedang',
    description: 'Gejala yang Anda pilih sangat khas untuk kelebihan air: daun menguning, lemas, dan tanah yang selalu basah membuat akar kekurangan oksigen.',
    advice: ['Hentikan penyiraman selama 5–7 hari', 'Periksa lubang drainase pot — pastikan tidak tersumbat', 'Jika akar berbau busuk, segera repotting dengan media tanam baru', 'Pindahkan ke tempat yang lebih terang untuk mempercepat pengeringan'],
  },
  {
    id: 'underwatering', symptoms: ['daun-kering', 'ujung-coklat', 'daun-menggulung'],
    emoji: '🏜️', title: 'Kemungkinan Kekurangan Air / Udara Terlalu Kering', severity: 'sedang',
    description: 'Daun kering dengan ujung coklat dan menggulung menandakan tanaman kesulitan mendapatkan air, atau kelembapan udara terlalu rendah.',
    advice: ['Rendam pot dalam air selama 15–20 menit agar media menyerap optimal', 'Semprot daun (misting) 1–2 kali sehari', 'Kelompokkan dengan tanaman lain untuk menaikkan kelembapan lokal', 'Pangkas daun yang sudah kering parah'],
  },
  {
    id: 'jamur', symptoms: ['bercak-putih', 'serbuk-putih', 'daun-keriting'],
    emoji: '🦠', title: 'Kemungkinan Serangan Jamur (Powdery Mildew)', severity: 'berat',
    description: 'Bercak tepung putih pada permukaan daun menandakan infeksi jamur yang menyebar cepat di udara lembap dan sirkulasi buruk.',
    advice: ['Pisahkan tanaman dari tanaman lain', 'Buang daun yang terinfeksi parah', 'Semprot larutan baking soda (1 sdt per liter air) setiap 3 hari', 'Perbaiki sirkulasi udara di sekitar tanaman'],
  },
  {
    id: 'hama', symptoms: ['lubang-daun', 'kutu-hijau', 'garis-perak'],
    emoji: '🐛', title: 'Kemungkinan Serangan Hama (Ulat / Kutu Daun)', severity: 'berat',
    description: 'Lubang pada daun, kutu di balik daun, dan garis perak keperakan adalah jejak khas hama pengunyah dan pengisap cairan.',
    advice: ['Periksa balik daun & sela batang setiap pagi', 'Semprot air sabun (1 sdt sabun cair per liter) tiap 3 hari', 'Untuk ulat: petik secara manual saat terlihat', 'Ulangi hingga 2 minggu dan pantau daun baru'],
  },
  {
    id: 'nutrisi', symptoms: ['daun-pucat', 'pertumbuhan-lambat', 'daun-kuning-bawah'],
    emoji: '🧪', title: 'Kemungkinan Kekurangan Nutrisi', severity: 'ringan',
    description: 'Daun pucat, pertumbuhan melambat, dan daun bawah menguning menandakan tanaman kekurangan nitrogen atau unsur mikro.',
    advice: ['Berikan pupuk NPK seimbang (contoh: NPK Mutiara 16-16-16)', 'Pupuk 2 minggu sekali dengan dosis sesuai kemasan', 'Pastikan pH media tanam 6–7', 'Jika pot kecil, pertimbangkan repotting'],
  },
]

export const diagnosisSymptoms = [
  { id: 'daun-kuning', label: 'Daun menguning', icon: '🍂' },
  { id: 'daun-layu', label: 'Daun lemas / layu', icon: '🥀' },
  { id: 'tanah-basah', label: 'Tanah selalu basah', icon: '🫧' },
  { id: 'daun-kering', label: 'Daun kering & rapuh', icon: '🍃' },
  { id: 'ujung-coklat', label: 'Ujung daun coklat', icon: '🤎' },
  { id: 'daun-menggulung', label: 'Daun menggulung', icon: '🌀' },
  { id: 'bercak-putih', label: 'Bercak / serbuk putih', icon: '⚪' },
  { id: 'daun-keriting', label: 'Daun keriting', icon: '🥬' },
  { id: 'lubang-daun', label: 'Ada lubang di daun', icon: '🕳️' },
  { id: 'kutu-hijau', label: 'Kutu kecil di daun', icon: '🦗' },
  { id: 'garis-perak', label: 'Garis perak keperakan', icon: '✨' },
  { id: 'daun-pucat', label: 'Daun pucat / pudar', icon: '🎨' },
  { id: 'pertumbuhan-lambat', label: 'Tumbuh lambat', icon: '🐢' },
  { id: 'daun-kuning-bawah', label: 'Daun bawah menguning', icon: '⬇️' },
]

export const finderQuestions = [
  {
    id: 'lokasi', question: 'Di mana tanaman akan diletakkan?', icon: '🏠',
    options: [
      { value: 'indoor-terang', label: 'Dalam ruangan terang', icon: '🪟', desc: 'Dekat jendela, cahaya tidak langsung' },
      { value: 'indoor-redup', label: 'Dalam ruangan redup', icon: '🛋️', desc: 'Ruang yang minim cahaya matahari' },
      { value: 'outdoor', label: 'Balkon / halaman', icon: '🌤️', desc: 'Kena sinar matahari langsung' },
      { value: 'teras', label: 'Teras semi-terbuka', icon: '🏡', desc: 'Cahaya pagi, terlindung siang' },
    ],
  },
  {
    id: 'pengalaman', question: 'Seberapa berpengalaman Anda berkebun?', icon: '🧑‍🌾',
    options: [
      { value: 'pemula', label: 'Pemula', icon: '🌱', desc: 'Baru mulai, butuh tanaman bandel' },
      { value: 'sedang', label: 'Menengah', icon: '🌿', desc: 'Sudah pernah merawat beberapa tanaman' },
      { value: 'mahir', label: 'Mahir', icon: '🪴', desc: 'Siap tantangan tanaman khusus' },
    ],
  },
  {
    id: 'tujuan', question: 'Apa tujuan utama Anda?', icon: '🎯',
    options: [
      { value: 'hias', label: 'Mempercantik ruangan', icon: '🪴', desc: 'Tanaman hias bernilai estetika' },
      { value: 'pangan', label: 'Panen sayur / buah', icon: '🥬', desc: 'Sumber pangan segar harian' },
      { value: 'udara', label: 'Membersihkan udara', icon: '💨', desc: 'Tanaman filter udara terbaik' },
      { value: 'relaksasi', label: 'Hobi & relaksasi', icon: '🧘', desc: 'Merawat tanaman untuk ketenangan' },
    ],
  },
  {
    id: 'waktu', question: 'Berapa banyak waktu untuk merawat tiap minggu?', icon: '⏰',
    options: [
      { value: 'sibuk', label: 'Sangat sibuk (<15 menit)', icon: '⚡', desc: 'Perawatan super minimal' },
      { value: 'normal', label: 'Cukup (15–45 menit)', icon: '☀️', desc: 'Siram + cek rutin seminggu' },
      { value: 'banyak', label: 'Santai (45+ menit)', icon: '🌻', desc: 'Menikmati ritual berkebun' },
    ],
  },
]

// Rule engine sederhana (versi klien untuk demo; versi final di backend PlantFinderService)
export const finderMatches = (answers) => {
  const score = (species) => {
    let s = 0
    const loc = answers.lokasi
    const exp = answers.pengalaman
    const goal = answers.tujuan
    const time = answers.waktu
    const { slug, careLevel } = species

    const hardiness = careLevel === 'mudah' ? 2 : careLevel === 'sedang' ? 1 : 0
    const lowLight = ['sirih-gading', 'lidah-mertua', 'aglonema', 'monstera-deliciosa', 'aloe-vera']
    const fullSun = ['cabai-rawit', 'tomat-cherry', 'kemangi']
    const edible = ['cabai-rawit', 'tomat-cherry', 'kemangi']
    const airPurifier = ['lidah-mertua', 'monstera-deliciosa', 'sirih-gading', 'aglonema']

    if (loc === 'indoor-redup' && lowLight.includes(slug)) s += 3
    if ((loc === 'outdoor' || loc === 'teras') && fullSun.includes(slug)) s += 3
    if (loc === 'indoor-terang') s += 1
    if (exp === 'pemula') s += hardiness * 2
    if (exp === 'mahir' && careLevel === 'sulit') s += 2
    if (goal === 'pangan' && edible.includes(slug)) s += 3
    if (goal === 'udara' && airPurifier.includes(slug)) s += 3
    if (goal === 'hias') s += 1
    if (time === 'sibuk' && hardiness === 2) s += 3
    if (time === 'sibuk' && waterEveryDays(species) > 7) s += 2
    if (time === 'banyak') s += 1
    return s
  }
  return [...plantSpecies].sort((a, b) => score(b) - score(a)).slice(0, 3)
}

const waterEveryDays = (species) => {
  const map = {
    'monstera-deliciosa': 6, 'sirih-gading': 8, 'aglonema': 6, 'lidah-mertua': 17,
    'cabai-rawit': 1.5, 'tomat-cherry': 2, 'kemangi': 1.5, 'aloe-vera': 12,
  }
  return map[species.slug] ?? 5
}

export const waterEveryDaysFor = (slug) => waterEveryDays(plantSpecies.find((p) => p.slug === slug))
