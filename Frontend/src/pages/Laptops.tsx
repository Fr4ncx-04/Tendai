const laptops = [
  {
    id: '1',
    name: 'Dell XPS 15',
    price: 1499,
    description: 'High-performance laptop with a stunning 4K display and powerful processing capabilities.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.5,
    specs: {
      processor: 'Intel Core i7-11800H',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      display: '15.6" 4K UHD (3840 x 2160)',
      graphics: 'NVIDIA GeForce RTX 3050 Ti',
      battery: '86Wh',
      weight: '1.8 kg',
      ports: ['2x Thunderbolt 4', '1x USB-C 3.2', 'SD card reader'],
      wifi: 'Wi-Fi 6',
      bluetooth: '5.1',
      os: 'Windows 11 Pro',
      warranty: '1 year',
    }
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2399,
    description: 'Professional-grade laptop with M1 Pro chip and exceptional battery life.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.8,
    specs: {
      processor: 'Apple M1 Pro',
      ram: '16GB Unified Memory',
      storage: '512GB SSD',
      display: '16" Liquid Retina XDR (3456 x 2234)',
      graphics: '16-core GPU',
      battery: '100Wh',
      weight: '2.1 kg',
      ports: ['3x Thunderbolt 4', 'HDMI', 'SD card reader'],
      wifi: 'Wi-Fi 6',
      bluetooth: '5.0',
      os: 'macOS Monterey',
      warranty: '1 year',
    }
  },
  // Add more laptops with detailed specs...
];

export default laptops;