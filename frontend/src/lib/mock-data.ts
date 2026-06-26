export type ComputerStatus = "free" | "occupied" | "ending";

export interface Computer {
  id: string;
  number: number;
  zone: string;
  status: ComputerStatus;
  hourlyRate: number;
  endsIn?: number;
}

export interface Product {
  id: string;
  name: string;
  category: "snack" | "drink" | "fastfood";
  price: number;
  imageUrl: string;
}

export interface Zone {
  id: string;
  name: string;
  computersCount: number;
  price: string;
  image: string;
}

export interface BarMenuItem {
  id: string;
  name: string;
  price: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Club {
  id: string;
  name: string;
  address: string;
  viloyat: string;
  tuman: string;
  distance: string;
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  availableSeats: number;
  freeCount: number;
  occupiedCount: number;
  price: string;
  workingHours: string;
  zones: Zone[];
  computers: Computer[];
  barMenu: BarMenuItem[];
  products: Product[];
  reviews: Review[];
}

export const MOCK_CLUBS: Club[] = [
  {
    id: "1",
    name: "Cyber Arena VIP",
    address: "Yunusobod tumani, 19-kvartal",
    viloyat: "Toshkent shahri",
    tuman: "Yunusobod tumani",
    distance: "1.2 km",
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4080", "24/7", "PS5 xonasi"],
    availableSeats: 12, // this will be calculated in UI or static mock
    freeCount: 12,
    occupiedCount: 16,
    price: "15,000 so'm/soat",
    workingHours: "24/7",
    zones: [
      { id: "z1", name: "Standard", computersCount: 20, price: "15,000 so'm", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" },
      { id: "z2", name: "VIP", computersCount: 5, price: "25,000 so'm", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" },
      { id: "z3", name: "PS5 Xonasi", computersCount: 3, price: "35,000 so'm", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop" },
    ],
    computers: [
      ...Array.from({ length: 10 }).map((_, i) => ({ id: `c1_${i+1}`, number: i+1, zone: "z1", status: "free" as ComputerStatus, hourlyRate: 15000 })),
      ...Array.from({ length: 5 }).map((_, i) => ({ id: `c1_${i+11}`, number: i+11, zone: "z1", status: "occupied" as ComputerStatus, hourlyRate: 15000, endsIn: 0 })),
      ...Array.from({ length: 5 }).map((_, i) => ({ id: `c1_${i+16}`, number: i+16, zone: "z1", status: "ending" as ComputerStatus, hourlyRate: 15000, endsIn: 15 + i*5 })),
      ...Array.from({ length: 2 }).map((_, i) => ({ id: `c1_v${i+1}`, number: 21+i, zone: "z2", status: "free" as ComputerStatus, hourlyRate: 25000 })),
      ...Array.from({ length: 3 }).map((_, i) => ({ id: `c1_v${i+3}`, number: 23+i, zone: "z2", status: "occupied" as ComputerStatus, hourlyRate: 25000, endsIn: 0 })),
      ...Array.from({ length: 3 }).map((_, i) => ({ id: `c1_ps${i+1}`, number: 31+i, zone: "z3", status: i === 0 ? "free" : "occupied" as ComputerStatus, hourlyRate: 35000, endsIn: i === 0 ? undefined : 45 })),
    ],
    barMenu: [
      { id: "b1", name: "Red Bull", price: "25,000 so'm" },
      { id: "b2", name: "Lays", price: "18,000 so'm" },
      { id: "b3", name: "Kofe", price: "15,000 so'm" },
      { id: "b4", name: "Sendvich", price: "22,000 so'm" },
    ],
    products: [
      { id: "p1", name: "Red Bull", category: "drink" as const, price: 25000, imageUrl: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=500&auto=format&fit=crop" },
      { id: "p2", name: "Lays Chips", category: "snack" as const, price: 18000, imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=500&auto=format&fit=crop" },
      { id: "p3", name: "Kofe", category: "drink" as const, price: 15000, imageUrl: "https://images.unsplash.com/photo-1550928431-ee0ecb00c656?q=80&w=500&auto=format&fit=crop" },
      { id: "p4", name: "Sendvich", category: "fastfood" as const, price: 22000, imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=500&auto=format&fit=crop" },
      { id: "p5", name: "Snickers", category: "snack" as const, price: 12000, imageUrl: "https://images.unsplash.com/photo-1620023447781-a6c8b0931ce4?q=80&w=500&auto=format&fit=crop" },
      { id: "p6", name: "Coca-Cola", category: "drink" as const, price: 12000, imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop" },
      { id: "p7", name: "Burger", category: "fastfood" as const, price: 35000, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" },
      { id: "p8", name: "Hot-dog", category: "fastfood" as const, price: 20000, imageUrl: "https://images.unsplash.com/photo-1615719417329-87a32d18eb8a?q=80&w=500&auto=format&fit=crop" },
    ],
    reviews: [
      { id: "r1", author: "Azizbek", rating: 5, text: "Eng zo'r kompyuter klub, kompyuterlari juda tez ishlaydi.", avatar: "" },
      { id: "r2", author: "Murod", rating: 4, text: "Klub yaxshi, lekin joy topish ba'zan qiyin bo'ladi. Oldindan band qilish kerak.", avatar: "" },
    ],
  },
  {
    id: "2",
    name: "Nexus Gaming Lounge",
    address: "Chilonzor tumani, Muqimiy ko'chasi",
    viloyat: "Toshkent shahri",
    tuman: "Chilonzor tumani",
    distance: "3.5 km",
    rating: 4.5,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    tags: ["RTX 3060", "Bar menyu", "VIP zonalar"],
    availableSeats: 0,
    freeCount: 0,
    occupiedCount: 40,
    price: "10,000 so'm/soat",
    workingHours: "09:00 - 03:00",
    zones: [
      { id: "z1", name: "Umumiy Zal", computersCount: 30, price: "10,000 so'm", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" },
      { id: "z2", name: "VIP", computersCount: 10, price: "20,000 so'm", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop" },
    ],
    computers: [
      ...Array.from({ length: 30 }).map((_, i) => ({ id: `c2_${i+1}`, number: i+1, zone: "z1", status: (i % 3 === 0 ? "ending" : "occupied") as ComputerStatus, hourlyRate: 10000, endsIn: i % 3 === 0 ? 25 : 0 })),
      ...Array.from({ length: 10 }).map((_, i) => ({ id: `c2_v${i+1}`, number: 31+i, zone: "z2", status: "occupied" as ComputerStatus, hourlyRate: 20000, endsIn: 0 })),
    ],
    barMenu: [
      { id: "b1", name: "Kola", price: "10,000 so'm" },
      { id: "b2", name: "Burger", price: "30,000 so'm" },
    ],
    products: [
      { id: "p1", name: "Coca-Cola", category: "drink" as const, price: 10000, imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop" },
      { id: "p2", name: "Burger", category: "fastfood" as const, price: 30000, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" },
    ],
    reviews: [
      { id: "r1", author: "Sardor", rating: 5, text: "Atmosfera daxshat! Bar zo'r.", avatar: "" },
    ],
  },
  {
    id: "3",
    name: "Matrix eSports Center",
    address: "Mirzo Ulug'bek tumani, TTZ",
    viloyat: "Toshkent shahri",
    tuman: "Mirzo Ulug'bek tumani",
    distance: "5.1 km",
    rating: 4.9,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4090", "Streamer xonasi", "Oziq-ovqat"],
    availableSeats: 4,
    freeCount: 4,
    occupiedCount: 37,
    price: "20,000 so'm/soat",
    workingHours: "24/7",
    zones: [
      { id: "z1", name: "Pro Gaming", computersCount: 40, price: "20,000 so'm", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop" },
      { id: "z2", name: "Streamer xonasi", computersCount: 1, price: "50,000 so'm", image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=2070&auto=format&fit=crop" },
    ],
    computers: [
      ...Array.from({ length: 4 }).map((_, i) => ({ id: `c3_${i+1}`, number: i+1, zone: "z1", status: "free" as ComputerStatus, hourlyRate: 20000 })),
      ...Array.from({ length: 36 }).map((_, i) => ({ id: `c3_${i+5}`, number: i+5, zone: "z1", status: "occupied" as ComputerStatus, hourlyRate: 20000, endsIn: 0 })),
      { id: "c3_s1", number: 41, zone: "z2", status: "occupied", hourlyRate: 50000, endsIn: 120 },
    ],
    barMenu: [
      { id: "b1", name: "Osh", price: "35,000 so'm" },
      { id: "b2", name: "Choy", price: "5,000 so'm" },
    ],
    products: [
      { id: "p1", name: "Osh", category: "fastfood" as const, price: 35000, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" }, // mock image
      { id: "p2", name: "Ko'k choy", category: "drink" as const, price: 5000, imageUrl: "https://images.unsplash.com/photo-1550928431-ee0ecb00c656?q=80&w=500&auto=format&fit=crop" },
    ],
    reviews: [
      { id: "r1", author: "Jasur", rating: 5, text: "O'zbekistondagi eng zo'r klub", avatar: "" },
      { id: "r2", author: "Anvar", rating: 4, text: "Biroz uzoqroqda joylashgan", avatar: "" },
    ],
  },
  {
    id: "4",
    name: "GameHub Tashkent",
    address: "Shayxontohur tumani, Navoiy ko'chasi",
    viloyat: "Toshkent shahri",
    tuman: "Shayxontohur tumani",
    distance: "2.8 km",
    rating: 4.2,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    tags: ["GTX 1660", "Arzon", "24/7 emas"],
    availableSeats: 25,
    freeCount: 25,
    occupiedCount: 25,
    price: "8,000 so'm/soat",
    workingHours: "08:00 - 22:00",
    zones: [
      { id: "z1", name: "Standard", computersCount: 50, price: "8,000 so'm", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop" },
    ],
    computers: [
      ...Array.from({ length: 25 }).map((_, i) => ({ id: `c4_${i+1}`, number: i+1, zone: "z1", status: "free" as ComputerStatus, hourlyRate: 8000 })),
      ...Array.from({ length: 25 }).map((_, i) => ({ id: `c4_${i+26}`, number: i+26, zone: "z1", status: "occupied" as ComputerStatus, hourlyRate: 8000, endsIn: 0 })),
    ],
    barMenu: [
      { id: "b1", name: "Snickers", price: "12,000 so'm" },
    ],
    products: [
      { id: "p1", name: "Snickers", category: "snack" as const, price: 12000, imageUrl: "https://images.unsplash.com/photo-1620023447781-a6c8b0931ce4?q=80&w=500&auto=format&fit=crop" },
    ],
    reviews: [
      { id: "r1", author: "Dilshod", rating: 4, text: "Narxi arzon, talabalar uchun zo'r.", avatar: "" },
    ],
  },
  {
    id: "5",
    name: "LevelUp Cyberclub",
    address: "Yakkasaroy tumani, Shota Rustaveli",
    viloyat: "Toshkent shahri",
    tuman: "Yakkasaroy tumani",
    distance: "4.0 km",
    rating: 4.6,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    tags: ["RTX 4070", "Lounge", "Kalyan"],
    availableSeats: 8,
    freeCount: 8,
    occupiedCount: 11,
    price: "18,000 so'm/soat",
    workingHours: "24/7",
    zones: [
      { id: "z1", name: "Lounge Area", computersCount: 15, price: "18,000 so'm", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" },
      { id: "z2", name: "Premium VIP", computersCount: 4, price: "30,000 so'm", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop" },
    ],
    computers: [
      ...Array.from({ length: 8 }).map((_, i) => ({ id: `c5_${i+1}`, number: i+1, zone: "z1", status: "free" as ComputerStatus, hourlyRate: 18000 })),
      ...Array.from({ length: 7 }).map((_, i) => ({ id: `c5_${i+9}`, number: i+9, zone: "z1", status: "occupied" as ComputerStatus, hourlyRate: 18000, endsIn: 0 })),
      ...Array.from({ length: 4 }).map((_, i) => ({ id: `c5_v${i+1}`, number: 16+i, zone: "z2", status: "occupied" as ComputerStatus, hourlyRate: 30000, endsIn: 0 })),
    ],
    barMenu: [
      { id: "b1", name: "Kalyan", price: "150,000 so'm" },
      { id: "b2", name: "Limonad", price: "30,000 so'm" },
    ],
    products: [
      { id: "p1", name: "Limonad", category: "drink" as const, price: 30000, imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&auto=format&fit=crop" },
      { id: "p2", name: "Lays", category: "snack" as const, price: 20000, imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=500&auto=format&fit=crop" },
    ],
    reviews: [
      { id: "r1", author: "Umid", rating: 5, text: "Lounge hududi juda qulay, dam olish uchun zo'r.", avatar: "" },
    ],
  },
];

export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand viloyati",
  "Farg'ona viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Buxoro viloyati",
  "Xorazm viloyati",
  "Qashqadaryo viloyati",
  "Surxondaryo viloyati",
  "Sirdaryo viloyati",
  "Jizzax viloyati",
  "Navoiy viloyati",
  "Qoraqalpog'iston Respublikasi"
];

export const DISTRICTS: Record<string, string[]> = {
  "Toshkent shahri": ["Yunusobod tumani", "Chilonzor tumani", "Mirzo Ulug'bek tumani", "Shayxontohur tumani", "Yakkasaroy tumani", "Yashnobod tumani", "Olmazor tumani", "Uchtepa tumani", "Sirg'ali tumani", "Mirobod tumani", "Bektemir tumani"],
  // Other districts can be mock data
};

export interface UserBooking {
  id: string;
  clubId: string;
  clubName: string;
  computerNumber: number;
  zone: string;
  startedAt: string;
  endsAt: string;
  status: "active" | "completed";
  totalAmount: number;
}

export interface UserOrder {
  id: string;
  clubName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "delivered" | "cancelled";
  createdAt: string;
}

export const mockUserBookings: UserBooking[] = [
  {
    id: "ub1",
    clubId: "1",
    clubName: "Cyber Arena VIP",
    computerNumber: 12,
    zone: "Standard",
    startedAt: "26-iyun, 10:00",
    endsAt: "26-iyun, 13:00",
    status: "active",
    totalAmount: 45000,
  },
  {
    id: "ub2",
    clubId: "2",
    clubName: "Nexus Gaming Lounge",
    computerNumber: 5,
    zone: "Umumiy Zal",
    startedAt: "25-iyun, 18:00",
    endsAt: "25-iyun, 20:00",
    status: "completed",
    totalAmount: 20000,
  },
];

export const mockUserOrders: UserOrder[] = [
  {
    id: "uo1",
    clubName: "Cyber Arena VIP",
    items: [
      { name: "Red Bull", qty: 1, price: 25000 },
      { name: "Lays Chips", qty: 2, price: 18000 },
    ],
    total: 61000,
    status: "pending",
    createdAt: "26-iyun, 11:15",
  },
  {
    id: "uo2",
    clubName: "Nexus Gaming Lounge",
    items: [
      { name: "Burger", qty: 1, price: 30000 },
      { name: "Coca-Cola", qty: 1, price: 10000 },
    ],
    total: 40000,
    status: "delivered",
    createdAt: "25-iyun, 18:30",
  },
];

