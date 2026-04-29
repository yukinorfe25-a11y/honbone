export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  edition_total: number;
  image_url: string;
  image_alt_url: string;
  badge: string;
};

export const PRODUCTS: Product[] = [
  { id: '1', sku: 'BREE-ERT-001', name: 'BONE KEYRING',     price: 18400, stock: 240, edition_total: 240, image_url: '/assets/02.png', image_alt_url: '/assets/01.png', badge: 'DROP 001' },
  { id: '2', sku: 'BREE-ERT-002', name: 'RIB PENDANT',      price: 14200, stock: 180, edition_total: 180, image_url: '/assets/04.png', image_alt_url: '/assets/05.png', badge: 'NEW' },
  { id: '3', sku: 'BREE-ERT-003', name: 'SPINE STRAP',      price: 22800, stock: 120, edition_total: 120, image_url: '/assets/05.png', image_alt_url: '/assets/02.png', badge: 'NEW' },
  { id: '4', sku: 'BREE-ERT-004', name: 'CARPAL RING / S',  price: 9600,  stock: 320, edition_total: 320, image_url: '/assets/01.png', image_alt_url: '/assets/06.png', badge: '' },
  { id: '5', sku: 'BREE-ARC-005', name: 'PELVIS OBJECT',    price: 34000, stock: 80,  edition_total: 80,  image_url: '/assets/06.png', image_alt_url: '/assets/02.png', badge: 'EDITION' },
  { id: '6', sku: 'BREE-ERT-006', name: 'KNUCKLE FOB',      price: 11800, stock: 240, edition_total: 240, image_url: '/assets/03.png', image_alt_url: '/assets/04.png', badge: '' },
  { id: '7', sku: 'BREE-ERT-007', name: 'JAW CLIP',         price: 8400,  stock: 400, edition_total: 400, image_url: '/assets/01.png', image_alt_url: '/assets/02.png', badge: '' },
  { id: '8', sku: 'BREE-ARC-008', name: 'CRANIUM SHELF',    price: 48000, stock: 1,   edition_total: 1,   image_url: '/assets/02.png', image_alt_url: '/assets/06.png', badge: '1 OF 1' },
];

export const HOT_SKUS = ['BREE-ERT-002', 'BREE-ARC-005', 'BREE-ARC-008'];

export const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');
