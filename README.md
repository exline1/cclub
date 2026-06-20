# cclub

Kompyuter o'yinlari markazlari uchun bar buyurtma va kompyuter boshqaruv tizimi.

## Loyiha strukturasi

```
cclub/
├── frontend/   # Next.js 14 — Landing Page + Authentication (Faza 1)
└── backend/    # API server (keyingi fazalarda)
```

## Ishga tushirish

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Yoki ildiz papkadan:

```bash
npm run dev:frontend
```

Brauzer: `http://localhost:3000`

### Backend

Hozircha faqat asosiy struktura tayyor. Keyingi fazada API qo'shiladi.

```bash
cd backend
npm install
npm run dev
```

## Fazalar

| Faza | Holat | Tarkib |
|------|-------|--------|
| 1 | ✅ Tayyor | Landing Page, Login, Register |
| 2 | ⏳ Rejalashtirilgan | Backend API, autentifikatsiya |
| 3 | ⏳ Rejalashtirilgan | Admin dashboard, real-time |
