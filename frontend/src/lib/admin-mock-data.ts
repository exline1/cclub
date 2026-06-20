export interface Computer {
  id: string;
  number: number;
  zone: "Standard" | "VIP" | "PS5";
  status: "free" | "occupied" | "ending_soon";
  remainingSeconds: number;
  customerName?: string;
}

export interface Order {
  id: string;
  computerNumber: number;
  items: { name: string; qty: number }[];
  status: "pending" | "preparing" | "delivered" | "cancelled";
  createdAt: string;
  total?: number;
}

export const MOCK_COMPUTERS: Computer[] = [
  { id: "1", number: 1, zone: "Standard", status: "occupied", remainingSeconds: 3600, customerName: "Ali" },
  { id: "2", number: 2, zone: "Standard", status: "ending_soon", remainingSeconds: 420, customerName: "Vali" },
  { id: "3", number: 3, zone: "Standard", status: "free", remainingSeconds: 0 },
  { id: "4", number: 4, zone: "Standard", status: "occupied", remainingSeconds: 7200, customerName: "Sardor" },
  { id: "5", number: 5, zone: "Standard", status: "free", remainingSeconds: 0 },
  { id: "6", number: 6, zone: "Standard", status: "occupied", remainingSeconds: 1800, customerName: "Jasur" },
  { id: "7", number: 7, zone: "Standard", status: "free", remainingSeconds: 0 },
  { id: "8", number: 8, zone: "Standard", status: "ending_soon", remainingSeconds: 150, customerName: "Bekzod" },
  { id: "9", number: 9, zone: "Standard", status: "free", remainingSeconds: 0 },
  { id: "10", number: 10, zone: "Standard", status: "occupied", remainingSeconds: 5400, customerName: "Diyor" },
  { id: "11", number: 11, zone: "Standard", status: "free", remainingSeconds: 0 },
  { id: "12", number: 12, zone: "Standard", status: "free", remainingSeconds: 0 },
  
  { id: "31", number: 31, zone: "VIP", status: "occupied", remainingSeconds: 10800, customerName: "Bobur" },
  { id: "32", number: 32, zone: "VIP", status: "free", remainingSeconds: 0 },
  { id: "33", number: 33, zone: "VIP", status: "ending_soon", remainingSeconds: 580, customerName: "Muzaffar" },
  { id: "34", number: 34, zone: "VIP", status: "occupied", remainingSeconds: 9000, customerName: "Javohir" },
  { id: "35", number: 35, zone: "VIP", status: "free", remainingSeconds: 0 },
  
  { id: "41", number: 41, zone: "PS5", status: "occupied", remainingSeconds: 14400, customerName: "Kamron" },
  { id: "42", number: 42, zone: "PS5", status: "free", remainingSeconds: 0 },
  { id: "43", number: 43, zone: "PS5", status: "free", remainingSeconds: 0 },
  { id: "44", number: 44, zone: "PS5", status: "occupied", remainingSeconds: 3600, customerName: "Farrux" },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "1024",
    computerNumber: 4,
    items: [
      { name: "Coca-Cola 0.5L", qty: 2 },
      { name: "Lays Chips 90g", qty: 1 }
    ],
    status: "pending",
    createdAt: "12:45",
    total: 28000,
  },
  {
    id: "1025",
    computerNumber: 31,
    items: [
      { name: "Double Cheese Burger", qty: 1 },
      { name: "French Fries", qty: 1 },
      { name: "RedBull Energy Drink", qty: 1 }
    ],
    status: "preparing",
    createdAt: "12:48",
    total: 62000,
  },
  {
    id: "1026",
    computerNumber: 1,
    items: [
      { name: "Classic Hot Dog", qty: 2 },
      { name: "Mineral Water Nestlé", qty: 1 }
    ],
    status: "pending",
    createdAt: "12:50",
    total: 35000,
  },
  {
    id: "1027",
    computerNumber: 6,
    items: [
      { name: "Kurortniye Kirieshki", qty: 3 }
    ],
    status: "delivered",
    createdAt: "12:20",
    total: 18000,
  },
  {
    id: "1028",
    computerNumber: 44,
    items: [
      { name: "Double Cheese Burger", qty: 2 },
      { name: "Coca-Cola 0.5L", qty: 2 }
    ],
    status: "pending",
    createdAt: "12:52",
    total: 72000,
  }
];

export interface Product {
  id: string;
  name: string;
  category: "snack" | "drink" | "fastfood";
  price: number;
  stock: number;
  imageUrl: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Coca-Cola 0.5L",
    category: "drink",
    price: 12000,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p2",
    name: "Fanta 0.5L",
    category: "drink",
    price: 12000,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p3",
    name: "Lays Chips 90g",
    category: "snack",
    price: 16000,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p4",
    name: "Snickers Bar",
    category: "snack",
    price: 8000,
    stock: 3,
    imageUrl: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p5",
    name: "Double Cheese Burger",
    category: "fastfood",
    price: 28000,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p6",
    name: "Classic Hot Dog",
    category: "fastfood",
    price: 18000,
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p7",
    name: "French Fries",
    category: "fastfood",
    price: 14000,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p8",
    name: "RedBull Energy Drink",
    category: "drink",
    price: 22000,
    stock: 2,
    imageUrl: "https://images.unsplash.com/photo-1622543953490-0b70039a4ac5?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p9",
    name: "Mineral Water Nestlé",
    category: "drink",
    price: 6000,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p10",
    name: "Kurortniye Kirieshki",
    category: "snack",
    price: 6000,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=150&auto=format&fit=crop&q=60"
  }
];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
  totalSpent: number;
  lastVisit: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string; // ISO string
  type: "pc" | "order" | "system" | "product";
}

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Aziz Rahimov", phone: "+998 90 123 45 67", joinedAt: "2026-01-15", totalSpent: 450000, lastVisit: "2026-06-20 14:30" },
  { id: "c2", name: "Bobur Karimov", phone: "+998 93 321 65 47", joinedAt: "2026-02-10", totalSpent: 780000, lastVisit: "2026-06-20 15:10" },
  { id: "c3", name: "Diyor Umarov", phone: "+998 94 987 65 43", joinedAt: "2026-03-01", totalSpent: 230000, lastVisit: "2026-06-20 12:15" },
  { id: "c4", name: "Farrux Olimov", phone: "+998 97 111 22 33", joinedAt: "2026-01-20", totalSpent: 1200000, lastVisit: "2026-06-20 15:45" },
  { id: "c5", name: "Jasur Hamrayev", phone: "+998 99 888 77 66", joinedAt: "2026-04-12", totalSpent: 350000, lastVisit: "2026-06-20 11:30" },
  { id: "c6", name: "Kamron Toshmatov", phone: "+998 90 999 88 77", joinedAt: "2026-05-02", totalSpent: 620000, lastVisit: "2026-06-20 13:00" },
  { id: "c7", name: "Muzaffar Hoshimov", phone: "+998 93 555 44 33", joinedAt: "2026-02-28", totalSpent: 890000, lastVisit: "2026-06-20 14:15" },
  { id: "c8", name: "Sardor Aliyev", phone: "+998 95 222 33 44", joinedAt: "2026-03-15", totalSpent: 1500000, lastVisit: "2026-06-20 15:00" },
  { id: "c9", name: "Vali Ergashev", phone: "+998 90 777 66 55", joinedAt: "2026-01-05", totalSpent: 310000, lastVisit: "2026-06-20 10:45" },
  { id: "c10", name: "Ali Qodirov", phone: "+998 99 333 22 11", joinedAt: "2026-05-20", totalSpent: 180000, lastVisit: "2026-06-20 09:30" },
  { id: "c11", name: "Javohir Meliyev", phone: "+998 94 444 55 66", joinedAt: "2026-04-01", totalSpent: 920000, lastVisit: "2026-06-20 14:45" },
  { id: "c12", name: "Bekzod Shukurov", phone: "+998 97 777 88 99", joinedAt: "2026-03-20", totalSpent: 540000, lastVisit: "2026-06-20 13:45" }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: "a1", action: "PC 4 ishga tushirildi", details: "Foydalanuvchi: Sardor. Davomiyligi: 2 soat.", timestamp: new Date(Date.now() - 60000 * 15).toISOString(), type: "pc" },
  { id: "a2", action: "Yangi buyurtma keldi", details: "PC 31 dan Double Cheese Burger (x1) va RedBull (x1) buyurtma qilindi.", timestamp: new Date(Date.now() - 60000 * 20).toISOString(), type: "order" },
  { id: "a3", action: "PC 33 seansi uzaytirildi", details: "Qo'shimcha vaqt: +30 daqiqa.", timestamp: new Date(Date.now() - 60000 * 45).toISOString(), type: "pc" },
  { id: "a4", action: "Buyurtma yetkazildi", details: "PC 1 ga Classic Hot Dog (x2) yetkazib berildi.", timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), type: "order" },
  { id: "a5", action: "PC 12 to'xtatildi", details: "Seans qo'lda yakunlandi.", timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), type: "pc" },
  { id: "a6", action: "PC almashtirildi", details: "PC 2 dagi seans PC 5 ga ko'chirildi.", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), type: "pc" },
  { id: "a7", action: "Yangi mahsulot qo'shildi", details: "Mahsulot: RedBull Energy Drink. Narxi: 22,000 so'm.", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), type: "product" },
  { id: "a8", action: "Buyurtma qabul qilindi", details: "PC 31 buyurtmasi oshxonada tayyorlanmoqda.", timestamp: new Date(Date.now() - 3600000 * 4.2).toISOString(), type: "order" },
  { id: "a9", action: "Smena boshlandi", details: "Administrator: Admin. Tizim ishga tushdi.", timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), type: "system" },
  { id: "a10", action: "PC 6 ishga tushirildi", details: "Foydalanuvchi: Jasur. Davomiyligi: 30 daqiqa.", timestamp: new Date(Date.now() - 3600000 * 6.5).toISOString(), type: "pc" },
  { id: "a11", action: "Mahsulot tahrirlandi", details: "Coca-Cola 0.5L qoldiq soni o'zgartirildi: 15 ta.", timestamp: new Date(Date.now() - 3600000 * 7).toISOString(), type: "product" },
  { id: "a12", action: "Tizim sozlamalari yangilandi", details: "Klub tariflari o'zgartirildi.", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), type: "system" }
];


