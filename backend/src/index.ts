import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/** Health check — backend ishlayotganini tekshirish uchun */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "cclub-backend",
    message: "Backend tayyor — keyingi fazada API qo'shiladi",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server: http://localhost:${PORT}`);
});
