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
  status: "pending" | "preparing" | "delivered";
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
