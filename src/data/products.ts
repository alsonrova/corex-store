// ── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | 'cpu' | 'gpu' | 'ram' | 'nvme' | 'ssd' | 'motherboard'
  | 'psu' | 'case' | 'cooling' | 'fans' | 'monitor'
  | 'keyboard' | 'mouse' | 'headset' | 'webcam' | 'mousepad' | 'microphone';

export const CATEGORY_LABELS: Record<Category, string> = {
  cpu: 'CPU',
  gpu: 'GPU',
  ram: 'RAM',
  nvme: 'NVMe SSD',
  ssd: 'SATA SSD',
  motherboard: 'Motherboard',
  psu: 'PSU',
  case: 'Case',
  cooling: 'CPU Cooling',
  fans: 'Case Fans',
  monitor: 'Monitor',
  keyboard: 'Keyboard',
  mouse: 'Mouse',
  headset: 'Headset',
  webcam: 'Webcam',
  mousepad: 'Mousepad',
  microphone: 'Microphone',
};

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  image: string;
  description: string;
  specs: Record<string, string>;
}

export interface CartItem {
  product: Product;
  qty: number;
}

// ── Image helpers ─────────────────────────────────────────────────────────────

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=300&q=80`;

const IMG = {
  cpu:        ['/cpu_2.png', '/cpu_3.png', '/cpu_4.png'],
  gpu:        ['/GPU_1.png', '/GPU_2.png', '/GPU_3.png'],
  ram:        ['/ram.png', '/ram_2.png', '/ram_3.png'],
  // [0]=samsung [1]=generic [2]=crucial [3]=kingston
  storage:    ['/ssd_samsung.png', '/ssd.png', '/ssd_crucial.png', '/ssd_kingston.png'],
  mb:         ['/motherboard.png', '/motherboard_2.png'],
  psu:        ['/power.png', '/power_2.png'],
  case:       ['/vecteezy_modern-gaming-pc-isolated-on-transparent_48412735.png', '/vecteezy_modern-gaming-pc-isolated-on-transparent_48412770.png', '/vecteezy_modern-gaming-pc-isolated-on-transparent_48412788.png'],
  cooling:    ['/cooling.png', '/cooling_2.png', '/cooling_3.png'],
  monitor:    ['/screen.png', '/screen.png'],
  keyboard:   ['/keyboard.png', '/keyboard.png'],
  mouse:      ['/mouse.png', '/mouse.png'],
  headset:    ['/headset.png', '/headset.png'],
  mic:        ['/microphone.png', '/microphone.png'],
  webcam:     ['/webcam.png'],
  misc:       [u('1518770660439-4636190af475')],
};

// ── Product catalogue (~60 products) ─────────────────────────────────────────

export const PRODUCTS: Product[] = [

  // ── CPU ────────────────────────────────────────────────────────────────────
  {
    id: 'cpu-001', name: 'Intel Core i9-13900K', brand: 'Intel', category: 'cpu',
    price: 549, originalPrice: 649, rating: 4.9, reviews: 2847, inStock: true, isNew: false,
    image: IMG.cpu[0],
    description: 'Flagship 24-core processor for extreme computing and gaming workloads.',
    specs: { Cores: '24 (8P+16E)', 'Base Clock': '3.0 GHz', 'Boost Clock': '5.8 GHz', TDP: '125W', Socket: 'LGA1700' },
  },
  {
    id: 'cpu-002', name: 'Intel Core i7-13700K', brand: 'Intel', category: 'cpu',
    price: 389, rating: 4.8, reviews: 1923, inStock: true, isNew: false,
    image: IMG.cpu[1],
    description: 'Best-in-class hybrid architecture performance for gaming and productivity.',
    specs: { Cores: '16 (8P+8E)', 'Base Clock': '3.4 GHz', 'Boost Clock': '5.4 GHz', TDP: '125W', Socket: 'LGA1700' },
  },
  {
    id: 'cpu-003', name: 'Intel Core i5-13600K', brand: 'Intel', category: 'cpu',
    price: 279, rating: 4.8, reviews: 3102, inStock: true, isNew: true,
    image: IMG.cpu[2],
    description: 'Top gaming CPU under $300 with exceptional IPC and efficiency.',
    specs: { Cores: '14 (6P+8E)', 'Base Clock': '3.5 GHz', 'Boost Clock': '5.1 GHz', TDP: '125W', Socket: 'LGA1700' },
  },
  {
    id: 'cpu-004', name: 'AMD Ryzen 9 7950X', brand: 'AMD', category: 'cpu',
    price: 699, rating: 4.9, reviews: 1456, inStock: true, isNew: false,
    image: IMG.cpu[0],
    description: '16-core Zen 4 workstation powerhouse with PCIe 5.0 and DDR5.',
    specs: { Cores: '16', 'Base Clock': '4.5 GHz', 'Boost Clock': '5.7 GHz', TDP: '170W', Socket: 'AM5' },
  },
  {
    id: 'cpu-005', name: 'AMD Ryzen 7 7700X', brand: 'AMD', category: 'cpu',
    price: 319, originalPrice: 399, rating: 4.7, reviews: 2211, inStock: true, isNew: false,
    image: IMG.cpu[1],
    description: 'Excellent 8-core gaming CPU with PCIe 5.0 and DDR5 support.',
    specs: { Cores: '8', 'Base Clock': '4.5 GHz', 'Boost Clock': '5.4 GHz', TDP: '105W', Socket: 'AM5' },
  },
  {
    id: 'cpu-006', name: 'AMD Ryzen 5 7600X', brand: 'AMD', category: 'cpu',
    price: 229, rating: 4.7, reviews: 1789, inStock: true, isNew: false,
    image: IMG.cpu[2],
    description: 'Fastest 6-core gaming CPU with AM5 platform and PCIe 5.0.',
    specs: { Cores: '6', 'Base Clock': '4.7 GHz', 'Boost Clock': '5.3 GHz', TDP: '105W', Socket: 'AM5' },
  },

  // ── GPU ────────────────────────────────────────────────────────────────────
  {
    id: 'gpu-001', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', category: 'gpu',
    price: 1599, rating: 5.0, reviews: 983, inStock: true, isNew: true,
    image: IMG.gpu[0],
    description: 'The ultimate 4K gaming GPU with 16,384 CUDA cores and DLSS 3.',
    specs: { VRAM: '24GB GDDR6X', 'Boost Clock': '2.52 GHz', TDP: '450W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-002', name: 'NVIDIA GeForce RTX 4080', brand: 'NVIDIA', category: 'gpu',
    price: 1099, originalPrice: 1299, rating: 4.9, reviews: 1204, inStock: true, isNew: false,
    image: IMG.gpu[1],
    description: 'Ada Lovelace GPU for elite 4K/144Hz gaming with DLSS 3 Frame Generation.',
    specs: { VRAM: '16GB GDDR6X', 'Boost Clock': '2.51 GHz', TDP: '320W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-003', name: 'NVIDIA GeForce RTX 4070 Ti', brand: 'NVIDIA', category: 'gpu',
    price: 799, rating: 4.8, reviews: 1567, inStock: true, isNew: false,
    image: IMG.gpu[2],
    description: 'High-end 1440p GPU with DLSS 3 Frame Generation and AV1 encoding.',
    specs: { VRAM: '12GB GDDR6X', 'Boost Clock': '2.61 GHz', TDP: '285W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-004', name: 'NVIDIA GeForce RTX 4070', brand: 'NVIDIA', category: 'gpu',
    price: 599, rating: 4.8, reviews: 2034, inStock: true, isNew: true,
    image: IMG.gpu[0],
    description: 'The sweet spot for 1440p gaming with excellent power efficiency.',
    specs: { VRAM: '12GB GDDR6X', 'Boost Clock': '2.48 GHz', TDP: '200W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-005', name: 'NVIDIA GeForce RTX 3080', brand: 'NVIDIA', category: 'gpu',
    price: 649, originalPrice: 799, rating: 4.7, reviews: 3421, inStock: false, isNew: false,
    image: IMG.gpu[1],
    description: 'Proven Ampere architecture for exceptional 4K performance.',
    specs: { VRAM: '10GB GDDR6X', 'Boost Clock': '1.71 GHz', TDP: '320W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-006', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', category: 'gpu',
    price: 949, rating: 4.8, reviews: 876, inStock: true, isNew: true,
    image: IMG.gpu[2],
    description: 'RDNA 3 flagship with massive 24GB GDDR6 framebuffer and 96 CUs.',
    specs: { VRAM: '24GB GDDR6', 'Boost Clock': '2.50 GHz', TDP: '355W', Interface: 'PCIe 4.0 x16' },
  },
  {
    id: 'gpu-007', name: 'AMD Radeon RX 6800 XT', brand: 'AMD', category: 'gpu',
    price: 479, originalPrice: 649, rating: 4.6, reviews: 2198, inStock: true, isNew: false,
    image: IMG.gpu[0],
    description: 'RDNA 2 powerhouse with 16GB for high-resolution gaming on a budget.',
    specs: { VRAM: '16GB GDDR6', 'Boost Clock': '2.25 GHz', TDP: '300W', Interface: 'PCIe 4.0 x16' },
  },

  // ── RAM ────────────────────────────────────────────────────────────────────
  {
    id: 'ram-001', name: 'Corsair Dominator Platinum RGB 32GB DDR5-5600', brand: 'Corsair', category: 'ram',
    price: 169, originalPrice: 219, rating: 4.8, reviews: 1102, inStock: true, isNew: false,
    image: IMG.ram[0],
    description: 'Premium DDR5 with CAPELLIX RGB lighting and optimized XMP 3.0 profiles.',
    specs: { Capacity: '2×16GB', Speed: 'DDR5-5600', Latency: 'CL36', Voltage: '1.25V' },
  },
  {
    id: 'ram-002', name: 'G.Skill Trident Z5 RGB 64GB DDR5-6000', brand: 'G.Skill', category: 'ram',
    price: 289, rating: 4.9, reviews: 654, inStock: true, isNew: true,
    image: IMG.ram[1],
    description: 'Extreme 64GB DDR5 kit for content creation and overclocking.',
    specs: { Capacity: '2×32GB', Speed: 'DDR5-6000', Latency: 'CL30', Voltage: '1.35V' },
  },
  {
    id: 'ram-003', name: 'Kingston Fury Beast 16GB DDR4-3200', brand: 'Kingston', category: 'ram',
    price: 49, rating: 4.6, reviews: 6234, inStock: true, isNew: false,
    image: IMG.ram[0],
    description: 'Budget-friendly DDR4 with aggressive heatspreader for everyday builds.',
    specs: { Capacity: '2×8GB', Speed: 'DDR4-3200', Latency: 'CL16', Voltage: '1.35V' },
  },
  {
    id: 'ram-004', name: 'Crucial Pro 32GB DDR5-5200', brand: 'Crucial', category: 'ram',
    price: 129, originalPrice: 159, rating: 4.7, reviews: 897, inStock: true, isNew: false,
    image: IMG.ram[1],
    description: 'Reliable DDR5 with Intel XMP 3.0 and AMD EXPO dual-platform support.',
    specs: { Capacity: '2×16GB', Speed: 'DDR5-5200', Latency: 'CL42', Voltage: '1.1V' },
  },

  // ── NVMe SSD ───────────────────────────────────────────────────────────────
  {
    id: 'nvme-001', name: 'Samsung 990 Pro 2TB PCIe 4.0', brand: 'Samsung', category: 'nvme',
    price: 179, rating: 4.9, reviews: 2341, inStock: true, isNew: true,
    image: IMG.storage[0],
    description: 'Flagship PCIe 4.0 NVMe SSD with up to 7,450 MB/s read speeds.',
    specs: { Capacity: '2TB', Interface: 'PCIe 4.0 NVMe M.2', 'Read Speed': '7,450 MB/s', 'Write Speed': '6,900 MB/s' },
  },
  {
    id: 'nvme-002', name: 'WD Black SN850X 1TB PCIe 4.0', brand: 'WD', category: 'nvme',
    price: 109, originalPrice: 149, rating: 4.8, reviews: 1876, inStock: true, isNew: false,
    image: IMG.storage[1],
    description: 'PS5-compatible game storage with adaptive thermal management.',
    specs: { Capacity: '1TB', Interface: 'PCIe 4.0 NVMe M.2', 'Read Speed': '7,300 MB/s', 'Write Speed': '6,600 MB/s' },
  },
  {
    id: 'nvme-003', name: 'Crucial T700 1TB PCIe 5.0', brand: 'Crucial', category: 'nvme',
    price: 159, rating: 4.8, reviews: 432, inStock: true, isNew: true,
    image: IMG.storage[2],
    description: 'Next-gen PCIe 5.0 with blazing 12,400 MB/s read speeds and heatsink.',
    specs: { Capacity: '1TB', Interface: 'PCIe 5.0 NVMe M.2', 'Read Speed': '12,400 MB/s', 'Write Speed': '11,800 MB/s' },
  },
  {
    id: 'nvme-004', name: 'SK Hynix Platinum P41 1TB PCIe 4.0', brand: 'SK Hynix', category: 'nvme',
    price: 89, originalPrice: 119, rating: 4.9, reviews: 1234, inStock: true, isNew: false,
    image: IMG.storage[1],
    description: 'Best-in-class efficiency with 128-layer NAND for ultra-fast storage.',
    specs: { Capacity: '1TB', Interface: 'PCIe 4.0 NVMe M.2', 'Read Speed': '7,000 MB/s', 'Write Speed': '6,500 MB/s' },
  },

  // ── SATA SSD ───────────────────────────────────────────────────────────────
  {
    id: 'ssd-001', name: 'Samsung 870 EVO 1TB SATA', brand: 'Samsung', category: 'ssd',
    price: 89, rating: 4.9, reviews: 8921, inStock: true, isNew: false,
    image: IMG.storage[0],
    description: 'The gold-standard SATA SSD with exceptional endurance and reliability.',
    specs: { Capacity: '1TB', Interface: 'SATA III 6Gb/s', 'Read Speed': '560 MB/s', 'Write Speed': '530 MB/s' },
  },
  {
    id: 'ssd-002', name: 'Crucial MX500 2TB SATA', brand: 'Crucial', category: 'ssd',
    price: 99, originalPrice: 119, rating: 4.8, reviews: 5432, inStock: true, isNew: false,
    image: IMG.storage[2],
    description: '2TB SATA SSD with AES 256-bit hardware encryption included.',
    specs: { Capacity: '2TB', Interface: 'SATA III 6Gb/s', 'Read Speed': '560 MB/s', 'Write Speed': '510 MB/s' },
  },
  {
    id: 'ssd-003', name: 'Kingston A400 480GB SATA', brand: 'Kingston', category: 'ssd',
    price: 39, rating: 4.5, reviews: 12043, inStock: true, isNew: false,
    image: IMG.storage[3],
    description: 'Entry-level SATA SSD for OS drives and everyday computing.',
    specs: { Capacity: '480GB', Interface: 'SATA III 6Gb/s', 'Read Speed': '500 MB/s', 'Write Speed': '450 MB/s' },
  },

  // ── Motherboard ────────────────────────────────────────────────────────────
  {
    id: 'mb-001', name: 'ASUS ROG Maximus Z790 Hero', brand: 'ASUS', category: 'motherboard',
    price: 599, rating: 4.9, reviews: 342, inStock: true, isNew: false,
    image: IMG.mb[0],
    description: 'Ultimate Z790 flagship for Core i9 overclocking enthusiasts.',
    specs: { Socket: 'LGA1700', Chipset: 'Z790', Memory: '4×DDR5 (up to 192GB)', 'M.2 Slots': '5', WiFi: 'Wi-Fi 6E' },
  },
  {
    id: 'mb-002', name: 'MSI MAG Z790 Tomahawk WiFi', brand: 'MSI', category: 'motherboard',
    price: 249, rating: 4.8, reviews: 1123, inStock: true, isNew: true,
    image: IMG.mb[1],
    description: 'Value-packed Z790 with robust 16+1+1 VRM for 13th-gen Intel.',
    specs: { Socket: 'LGA1700', Chipset: 'Z790', Memory: '4×DDR5 (up to 192GB)', 'M.2 Slots': '4', WiFi: 'Wi-Fi 6E' },
  },
  {
    id: 'mb-003', name: 'Gigabyte AORUS B650 Elite AX', brand: 'Gigabyte', category: 'motherboard',
    price: 199, originalPrice: 249, rating: 4.7, reviews: 876, inStock: true, isNew: false,
    image: IMG.mb[0],
    description: 'Feature-rich AM5 board with PCIe 5.0 M.2 and DDR5 support.',
    specs: { Socket: 'AM5', Chipset: 'B650', Memory: '4×DDR5 (up to 128GB)', 'M.2 Slots': '4', WiFi: 'Wi-Fi 6E' },
  },
  {
    id: 'mb-004', name: 'NZXT N7 B650E', brand: 'NZXT', category: 'motherboard',
    price: 299, rating: 4.7, reviews: 432, inStock: true, isNew: true,
    image: IMG.mb[1],
    description: 'Minimalist B650E with full PCIe 5.0 and clean stealth design.',
    specs: { Socket: 'AM5', Chipset: 'B650E', Memory: '4×DDR5 (up to 128GB)', 'M.2 Slots': '4', WiFi: 'Wi-Fi 6E' },
  },

  // ── PSU ────────────────────────────────────────────────────────────────────
  {
    id: 'psu-001', name: 'Corsair RM1000x 1000W 80+ Gold', brand: 'Corsair', category: 'psu',
    price: 189, rating: 4.9, reviews: 2341, inStock: true, isNew: false,
    image: IMG.psu[0],
    description: 'Fully modular 1000W ATX 3.0 with zero-RPM mode and 10-year warranty.',
    specs: { Wattage: '1000W', Efficiency: '80+ Gold', Modular: 'Fully', Standard: 'ATX 3.0', Warranty: '10 years' },
  },
  {
    id: 'psu-002', name: 'Seasonic Focus GX-850 850W', brand: 'Seasonic', category: 'psu',
    price: 139, rating: 4.9, reviews: 3201, inStock: true, isNew: false,
    image: IMG.psu[1],
    description: 'Ultra-reliable 850W 80+ Gold with 10-year warranty and hybrid fan.',
    specs: { Wattage: '850W', Efficiency: '80+ Gold', Modular: 'Fully', Standard: 'ATX 3.0', Warranty: '10 years' },
  },
  {
    id: 'psu-003', name: 'be quiet! Dark Power 13 1000W', brand: 'be quiet!', category: 'psu',
    price: 249, rating: 4.9, reviews: 543, inStock: true, isNew: true,
    image: IMG.psu[0],
    description: '80+ Titanium certified near-silent 1000W for extreme builds.',
    specs: { Wattage: '1000W', Efficiency: '80+ Titanium', Modular: 'Fully', Standard: 'ATX 3.0', Warranty: '10 years' },
  },

  // ── Case ───────────────────────────────────────────────────────────────────
  {
    id: 'case-001', name: 'Lian Li PC-O11 Dynamic EVO', brand: 'Lian Li', category: 'case',
    price: 159, rating: 4.9, reviews: 4312, inStock: true, isNew: true,
    image: IMG.case[0],
    description: 'Legendary dual-chamber case with outstanding airflow and cable management.',
    specs: { Form: 'ATX Mid-Tower', 'Max GPU Length': '410mm', 'Radiator': 'Up to 360mm', 'USB-C': '3.2 Gen2' },
  },
  {
    id: 'case-002', name: 'NZXT H7 Flow ATX Mid Tower', brand: 'NZXT', category: 'case',
    price: 139, rating: 4.8, reviews: 1923, inStock: true, isNew: false,
    image: IMG.case[1],
    description: 'High-airflow tempered glass panel with perforated front mesh.',
    specs: { Form: 'ATX Mid-Tower', 'Max GPU Length': '400mm', 'Radiator': 'Up to 360mm', 'USB-C': '3.2 Gen2' },
  },
  {
    id: 'case-003', name: 'Corsair iCUE 5000X RGB', brand: 'Corsair', category: 'case',
    price: 169, originalPrice: 219, rating: 4.7, reviews: 2341, inStock: true, isNew: false,
    image: IMG.case[0],
    description: 'Triple-panel tempered glass with iCUE smart RGB lighting ecosystem.',
    specs: { Form: 'ATX Mid-Tower', 'Max GPU Length': '420mm', 'Radiator': 'Up to 360mm', 'USB-C': '3.1 Gen2' },
  },
  {
    id: 'case-004', name: 'Fractal Design Torrent Compact', brand: 'Fractal Design', category: 'case',
    price: 159, rating: 4.8, reviews: 987, inStock: true, isNew: false,
    image: IMG.case[1],
    description: 'Dense mesh front panel + integrated high-CFM fans for max airflow.',
    specs: { Form: 'ATX Mid-Tower', 'Max GPU Length': '331mm', 'Radiator': 'Up to 280mm', 'USB-C': '3.2 Gen2' },
  },

  // ── CPU Cooling ────────────────────────────────────────────────────────────
  {
    id: 'cool-001', name: 'Noctua NH-D15 chromax.black', brand: 'Noctua', category: 'cooling',
    price: 109, rating: 5.0, reviews: 6741, inStock: true, isNew: false,
    image: IMG.cooling[0],
    description: 'World-leading dual-tower air cooler with two NF-A15 140mm fans.',
    specs: { Type: 'Air Cooler', TDP: '250W+', Fans: '2×NF-A15 140mm', Height: '165mm', Socket: 'Intel + AMD' },
  },
  {
    id: 'cool-002', name: 'NZXT Kraken X73 RGB 360mm AIO', brand: 'NZXT', category: 'cooling',
    price: 169, originalPrice: 219, rating: 4.8, reviews: 2341, inStock: true, isNew: false,
    image: IMG.cooling[1],
    description: 'Premium 360mm AIO with infinity mirror pump head and RGB rings.',
    specs: { Type: 'AIO Liquid', Radiator: '360mm', Fans: '3×120mm F120', Socket: 'Intel + AMD' },
  },
  {
    id: 'cool-003', name: 'Corsair H150i Elite Capellix XT', brand: 'Corsair', category: 'cooling',
    price: 179, rating: 4.7, reviews: 1234, inStock: true, isNew: true,
    image: IMG.cooling[2],
    description: '360mm AIO with 48-LED pump head and iCUE RGB fan control.',
    specs: { Type: 'AIO Liquid', Radiator: '360mm', Fans: '3×120mm AF120', Socket: 'Intel + AMD' },
  },
  {
    id: 'cool-004', name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', category: 'cooling',
    price: 89, originalPrice: 109, rating: 4.9, reviews: 3421, inStock: true, isNew: false,
    image: IMG.cooling[1],
    description: 'Whisper-quiet 250W dual-tower air cooler with two Silent Wings fans.',
    specs: { Type: 'Air Cooler', TDP: '250W', Fans: '2×Silent Wings (120/135mm)', Height: '163mm' },
  },

  // ── Case Fans ──────────────────────────────────────────────────────────────
  {
    id: 'fans-001', name: 'Noctua NF-A12x25 PWM 3-Pack', brand: 'Noctua', category: 'fans',
    price: 99, rating: 5.0, reviews: 4321, inStock: true, isNew: false,
    image: IMG.misc[0],
    description: 'Award-winning 120mm fans with exceptional airflow-to-noise ratio.',
    specs: { Size: '120mm', 'Max RPM': '2000', Airflow: '60.1 CFM', 'Noise Level': '22.6 dBa' },
  },
  {
    id: 'fans-002', name: 'be quiet! Silent Wings 4 120mm 3-Pack', brand: 'be quiet!', category: 'fans',
    price: 59, rating: 4.9, reviews: 1234, inStock: true, isNew: true,
    image: IMG.misc[0],
    description: 'Near-silent 120mm fans with fluid-dynamic bearings.',
    specs: { Size: '120mm', 'Max RPM': '1600', Airflow: '50.5 CFM', 'Noise Level': '12.8 dBa' },
  },
  {
    id: 'fans-003', name: 'Corsair LL120 RGB 3-Pack', brand: 'Corsair', category: 'fans',
    price: 69, originalPrice: 99, rating: 4.7, reviews: 5432, inStock: true, isNew: false,
    image: IMG.misc[0],
    description: '16 RGB LEDs per fan with stunning dual-ring lighting effects.',
    specs: { Size: '120mm', 'Max RPM': '1500', Airflow: '43.3 CFM', 'Noise Level': '24.8 dBa' },
  },

  // ── Monitor ────────────────────────────────────────────────────────────────
  {
    id: 'mon-001', name: 'LG 27GP850-B 27" QHD 165Hz', brand: 'LG', category: 'monitor',
    price: 329, originalPrice: 399, rating: 4.8, reviews: 4312, inStock: true, isNew: false,
    image: IMG.monitor[0],
    description: 'Nano IPS 1440p gaming monitor with 1ms GtG and anti-glare coating.',
    specs: { Size: '27"', Resolution: '2560×1440 QHD', Panel: 'Nano IPS', 'Refresh Rate': '165Hz', Response: '1ms GtG' },
  },
  {
    id: 'mon-002', name: 'Samsung Odyssey G7 27" QHD 240Hz', brand: 'Samsung', category: 'monitor',
    price: 499, rating: 4.7, reviews: 2341, inStock: true, isNew: true,
    image: IMG.monitor[1],
    description: 'VA panel with exceptional contrast ratio and 240Hz for competitive gaming.',
    specs: { Size: '27"', Resolution: '2560×1440 QHD', Panel: 'VA', 'Refresh Rate': '240Hz', Response: '1ms MPRT' },
  },
  {
    id: 'mon-003', name: 'ASUS ProArt PA279CRV 27" 4K', brand: 'ASUS', category: 'monitor',
    price: 699, rating: 4.9, reviews: 876, inStock: true, isNew: false,
    image: IMG.monitor[0],
    description: '4K IPS for professional color-accurate content creation with USB-C 96W.',
    specs: { Size: '27"', Resolution: '3840×2160 4K UHD', Panel: 'IPS', 'Color Coverage': '99% DCI-P3', 'USB-C': '96W' },
  },
  {
    id: 'mon-004', name: 'Dell UltraSharp U2723QE 27" 4K', brand: 'Dell', category: 'monitor',
    price: 589, rating: 4.9, reviews: 1234, inStock: true, isNew: false,
    image: IMG.monitor[1],
    description: 'IPS Black panel with 2× contrast ratio for stunning office visuals.',
    specs: { Size: '27"', Resolution: '3840×2160 4K UHD', Panel: 'IPS Black', 'Color Coverage': '100% sRGB', 'USB-C': '90W' },
  },

  // ── Keyboard ───────────────────────────────────────────────────────────────
  {
    id: 'kb-001', name: 'Keychron K2 Pro Wireless Mechanical', brand: 'Keychron', category: 'keyboard',
    price: 99, rating: 4.8, reviews: 3421, inStock: true, isNew: true,
    image: IMG.keyboard[0],
    description: 'Compact 75% wireless mechanical keyboard with QMK/VIA support.',
    specs: { Layout: '75% (84 keys)', Switch: 'Hot-swap (Gateron)', Connection: 'Bluetooth 5.1 / USB-C', RGB: 'Per-key' },
  },
  {
    id: 'kb-002', name: 'ASUS ROG Strix Scope RX RGB', brand: 'ASUS', category: 'keyboard',
    price: 129, originalPrice: 169, rating: 4.7, reviews: 1876, inStock: true, isNew: false,
    image: IMG.keyboard[1],
    description: 'Optical-mechanical switches with 1ms response and Aura Sync RGB.',
    specs: { Layout: 'Full (104 keys)', Switch: 'ROG RX Red Optical', Connection: 'USB-A', RGB: 'Per-key Aura' },
  },
  {
    id: 'kb-003', name: 'Corsair K70 RGB MK.2', brand: 'Corsair', category: 'keyboard',
    price: 139, rating: 4.7, reviews: 5432, inStock: true, isNew: false,
    image: IMG.keyboard[0],
    description: 'Premium aircraft-grade aluminum frame with Cherry MX switches.',
    specs: { Layout: 'Full (104 keys)', Switch: 'Cherry MX Red', Connection: 'USB-A braided', RGB: 'Per-key RGB' },
  },
  {
    id: 'kb-004', name: 'Logitech G915 Lightspeed TKL', brand: 'Logitech', category: 'keyboard',
    price: 199, rating: 4.8, reviews: 3201, inStock: true, isNew: false,
    image: IMG.keyboard[1],
    description: 'Ultra-slim wireless TKL with LIGHTSPEED 1ms and Bluetooth 5.1.',
    specs: { Layout: 'TKL (87 keys)', Switch: 'GL Tactile Low-Profile', Connection: 'LIGHTSPEED / BT 5.1', RGB: 'LIGHTSYNC RGB' },
  },

  // ── Mouse ──────────────────────────────────────────────────────────────────
  {
    id: 'mouse-001', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', category: 'mouse',
    price: 159, rating: 4.9, reviews: 2341, inStock: true, isNew: true,
    image: IMG.mouse[0],
    description: 'Ultra-lightweight 60g gaming mouse with HERO 2 25K optical sensor.',
    specs: { Weight: '60g', Sensor: 'HERO 2 25K', DPI: '100–25,600', Connection: 'LIGHTSPEED Wireless', Buttons: '5' },
  },
  {
    id: 'mouse-002', name: 'Razer DeathAdder V3 Pro', brand: 'Razer', category: 'mouse',
    price: 129, originalPrice: 159, rating: 4.8, reviews: 1987, inStock: true, isNew: false,
    image: IMG.mouse[1],
    description: 'Ergonomic wireless gaming mouse with Focus Pro 30K optical sensor.',
    specs: { Weight: '64g', Sensor: 'Focus Pro 30K', DPI: '100–30,000', Connection: 'HyperSpeed 4kHz', Buttons: '5' },
  },
  {
    id: 'mouse-003', name: 'SteelSeries Rival 600', brand: 'SteelSeries', category: 'mouse',
    price: 79, rating: 4.6, reviews: 3421, inStock: true, isNew: false,
    image: IMG.mouse[0],
    description: 'Dual-sensor wired mouse with adjustable weight and CPI.',
    specs: { Weight: '96–128g (adjustable)', Sensor: 'TrueMove3+', DPI: '100–12,000', Connection: 'USB', Buttons: '7' },
  },
  {
    id: 'mouse-004', name: 'Corsair M65 RGB Ultra Wireless', brand: 'Corsair', category: 'mouse',
    price: 99, rating: 4.7, reviews: 1234, inStock: true, isNew: false,
    image: IMG.mouse[1],
    description: 'FPS-focused wireless mouse with Marksman 26K sensor.',
    specs: { Weight: '97–115g', Sensor: 'Marksman 26K', DPI: '100–26,000', Connection: 'Slipstream Wireless', Buttons: '8' },
  },

  // ── Headset ────────────────────────────────────────────────────────────────
  {
    id: 'hs-001', name: 'HyperX Cloud Alpha Wireless', brand: 'HyperX', category: 'headset',
    price: 199, rating: 4.8, reviews: 3421, inStock: true, isNew: false,
    image: IMG.headset[0],
    description: '300-hour battery wireless headset with dual-chamber drivers.',
    specs: { Drivers: '50mm Dual Chamber', Connection: '2.4GHz Wireless', Battery: '300h', 'Freq. Response': '15Hz–21kHz' },
  },
  {
    id: 'hs-002', name: 'Corsair HS80 RGB Wireless', brand: 'Corsair', category: 'headset',
    price: 149, originalPrice: 179, rating: 4.7, reviews: 1876, inStock: true, isNew: false,
    image: IMG.headset[1],
    description: 'Dolby Atmos wireless headset with broadcast-grade microphone.',
    specs: { Drivers: '50mm Neodymium', Connection: 'Slipstream 2.4GHz', Battery: '20h', Surround: 'Dolby Atmos' },
  },
  {
    id: 'hs-003', name: 'SteelSeries Arctis Nova Pro Wireless', brand: 'SteelSeries', category: 'headset',
    price: 299, rating: 4.9, reviews: 987, inStock: true, isNew: true,
    image: IMG.headset[0],
    description: 'Dual-wireless with hot-swappable battery and active noise cancellation.',
    specs: { Drivers: '40mm Neodymium', Connection: '2.4GHz + Bluetooth', Battery: '22h + hot-swap', ANC: 'Yes' },
  },
  {
    id: 'hs-004', name: 'Razer BlackShark V2 Pro', brand: 'Razer', category: 'headset',
    price: 169, rating: 4.7, reviews: 2341, inStock: true, isNew: false,
    image: IMG.headset[1],
    description: 'eSports-grade wireless headset with THX Spatial Audio certification.',
    specs: { Drivers: '50mm TriForce Titanium', Connection: 'HyperSpeed Wireless', Battery: '70h', Surround: 'THX Spatial' },
  },

  // ── Webcam ─────────────────────────────────────────────────────────────────
  {
    id: 'cam-001', name: 'Logitech C920x HD Pro Webcam', brand: 'Logitech', category: 'webcam',
    price: 79, rating: 4.7, reviews: 15432, inStock: true, isNew: false,
    image: IMG.webcam[0],
    description: 'Full HD 1080p/30fps webcam with dual stereo autofocus microphone.',
    specs: { Resolution: '1080p 30fps / 720p 60fps', FOV: '78°', Autofocus: 'Yes', Microphone: 'Dual stereo' },
  },
  {
    id: 'cam-002', name: 'Razer Kiyo Pro Ultra', brand: 'Razer', category: 'webcam',
    price: 199, rating: 4.7, reviews: 543, inStock: true, isNew: true,
    image: IMG.webcam[0],
    description: '4K webcam with Sony STARVIS 2 sensor for exceptional low-light performance.',
    specs: { Resolution: '4K 30fps / 1080p 60fps', FOV: '82° (adjustable)', Autofocus: 'AI-enhanced', HDR: 'Yes' },
  },

  // ── Mousepad ───────────────────────────────────────────────────────────────
  {
    id: 'pad-001', name: 'SteelSeries QcK Heavy XXL', brand: 'SteelSeries', category: 'mousepad',
    price: 49, rating: 4.8, reviews: 8765, inStock: true, isNew: false,
    image: IMG.mouse[0],
    description: 'Extra-thick 6mm micro-woven cloth surface for precision tracking.',
    specs: { Size: '900×400mm', Thickness: '6mm', Surface: 'Micro-woven cloth', Base: 'Non-slip rubber' },
  },
  {
    id: 'pad-002', name: 'Logitech G840 XL Gaming Mousepad', brand: 'Logitech', category: 'mousepad',
    price: 39, rating: 4.7, reviews: 5432, inStock: true, isNew: false,
    image: IMG.mouse[1],
    description: 'Full-desk XL coverage with consistent sensor performance across the surface.',
    specs: { Size: '900×400mm', Thickness: '3mm', Surface: 'Moderate texture', Base: 'Rubber base' },
  },

  // ── Microphone ─────────────────────────────────────────────────────────────
  {
    id: 'mic-001', name: 'HyperX QuadCast S RGB USB Microphone', brand: 'HyperX', category: 'microphone',
    price: 149, rating: 4.8, reviews: 4321, inStock: true, isNew: false,
    image: IMG.mic[0],
    description: 'Plug-and-play condenser mic with RGB and four selectable polar patterns.',
    specs: { 'Polar Patterns': 'Cardioid / Bidirectional / Stereo / Omni', 'Sample Rate': '48kHz/16-bit', Connection: 'USB-C' },
  },
  {
    id: 'mic-002', name: 'Elgato Wave:3 Plus', brand: 'Elgato', category: 'microphone',
    price: 179, originalPrice: 199, rating: 4.8, reviews: 2341, inStock: true, isNew: true,
    image: IMG.mic[1],
    description: 'Studio-quality cardioid condenser with built-in mixing and Clipguard DSP.',
    specs: { 'Polar Pattern': 'Cardioid', 'Sample Rate': '96kHz/24-bit', Connection: 'USB-C', Clipguard: 'Dual capsule' },
  },
];

// ── Derived helpers ───────────────────────────────────────────────────────────

export const ALL_BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();

export const PRICE_RANGE = {
  min: Math.min(...PRODUCTS.map(p => p.price)),
  max: Math.max(...PRODUCTS.map(p => p.price)),
};
