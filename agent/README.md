# CClub PC Agent (Electron.js Lock Screen)

This subproject contains the native Windows Kiosk Agent for the CClub Gaming Cybercafe Management System. It runs on client machines, communicates with the CClub backend via Socket.io, and locks the Windows desktop when there is no active paid session.

---

## 🚀 O'rnatish va Ishga Tushirish (Development)

1. **Zaruriy dasturlar**:
   - [Node.js](https://nodejs.org/) (v18 yoki undan yuqori)

2. **Kutubxonalarni o'rnatish**:
   Agent papkasiga o'tib, unga kerakli kutubxonalarni o'rnating:
   ```bash
   cd agent
   npm install
   ```

3. **Sozlamalarni kiritish (`config.json`)**:
   `agent/config.json` faylini ochib, undagi qiymatlarni o'zgartiring:
   ```json
   {
     "serverUrl": "http://192.168.1.100:5000",
     "computerId": "kompyuter-uuid-id-bu-yerda",
     "deviceToken": "xavfsiz-token-bu-yerda"
   }
   ```
   *Eslatma: `computerId` va `deviceToken` backend'da ro'yxatdan o'tgan kompyuter ma'lumotlariga mos kelishi shart.*

4. **Dasturni ishga tushirish**:
   ```bash
   npm start
   ```

---

## 📦 Production uchun Build qilish (.exe)

Windows uchun o'rnatuvchi `.exe` installer yaratish uchun:
```bash
npm run dist
```
Bu buyruq `dist-build/` papkasi ichida `CClub Kiosk Agent Setup 1.0.0.exe` nomli installerni yaratadi.

---

## 🛡️ Kiosk Xavfsizligi va Watchdog Sozlamasi

Kiosk dasturi xavfsizligini maksimal darajada ta'minlash uchun uni tizimda uzluksiz ishlashini (watchdog) va foydalanuvchilar uni yopib yubora olmasligini ta'minlash lozim.

### 1. Windows Task Scheduler orqali Watchdog (Avto-Qayta Ishga Tushirish)
Agar foydalanuvchi qandaydir yo'l bilan dasturni yopsa yoki dastur o'z-o'zidan yopilib qolsa, Windows uni avtomatik ravishda qayta ishga tushirishi kerak. Buni Windows Task Scheduler orqali sozlash eng ishonchli usuldir.

**Sozlash bo'yicha yo'riqnoma**:
1. `Task Scheduler` (Планировщик задач) dasturini oching.
2. O'ng tarafdagi menyudan **Create Task...** (Создать задачу) tugmasini bosing.
3. **General** (Общие) bo'limida:
   - Nomini yozing: `CClub Agent Watchdog`
   - **Run with highest privileges** (Выполнять mit наивысшими правами) katakchasini belgilang.
4. **Triggers** (Триггеры) bo'limida yangi trigger qo'shing:
   - **Begin the task**: `At log on` (При входе в систему) yoki `At startup`.
5. **Actions** (Действия) bo'limida yangi action qo'shing:
   - **Action**: `Start a program` (Запуск программы)
   - **Program/script**: O'rnatilgan CClub agenti `.exe` faylining to'liq yo'lini ko'rsating.
6. **Settings** (Параметры) bo'limida:
   - **If the task fails, restart every**: `1 minute` (yoki dastur to'xtab qolsa, har 1 daqiqada qayta tekshirib ishga tushirish).
   - **If the running task does not end when requested, force it to stop** katakchasini yoqing.
   - **If the task is already running, then the following rule applies**: `Do not start a new instance` (Agarda ishlayotgan bo'lsa, ikkinchi marta ochilmaydi).

### 2. Tizimli Klaviatura Kombinatsiyalari
Electron dasturi ishga tushganda `Alt+Tab`, `Alt+F4`, `Ctrl+Esc` kabi oynani almashtiruvchi va yopuvchi tugmalarni to'liq bloklaydi.
`Ctrl+Alt+Del` tugmasi Windows xavfsizlik arxitekturasi tufayli to'g'ridan-to'g'ri bloklanmaydi, lekin dastur o'zidan blur (fokus yo'qolishi) hodisasini sezishi bilan millisekundlar ichida fokusni o'ziga qaytaradi va kiosk rejimini saqlab qoladi.
