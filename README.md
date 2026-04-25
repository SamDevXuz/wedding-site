# Firebase o'rnatish bo'yicha qo'llanma

## 1-qadam: Firebase loyiha yaratish

1. Brauzerda **https://console.firebase.google.com** saytiga kiring
2. Google akkauntingiz bilan tizimga kiring
3. **"Add project"** (Loyiha qo'shish) tugmasini bosing
4. Loyihaga nom bering, masalan: `wedding-app`
5. Google Analytics — bu ixtiyoriy, o'chirib qo'yishingiz mumkin
6. **"Create project"** tugmasini bosing
7. Loyiha yaratilguncha kuting (30 soniya atrofida)

---

## 2-qadam: Web ilovani ro'yxatdan o'tkazish

1. Loyiha ochilgandan keyin bosh sahifada **"Web"** tugmasini bosing (</> belgisi)
2. Ilovaga nom bering, masalan: `wedding-web`
3. **"Firebase Hosting"** ni belgilash shart emas
4. **"Register app"** tugmasini bosing
5. Ekranda `firebaseConfig` ko'rinadi — **bu ma'lumotlarni nusxalang:**

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "wedding-app-xxxxx.firebaseapp.com",
  databaseURL: "https://wedding-app-xxxxx-default-rtdb.firebaseio.com",
  projectId: "wedding-app-xxxxx",
  storageBucket: "wedding-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

6. Endi loyihangizdagi `src/lib/firebase.ts` faylini oching
7. Undagi placeholder qiymatlarni o'z config qiymatlaringiz bilan almashtiring:

```ts
const firebaseConfig = {
  apiKey: "O'ZINGIZNING_API_KEY",
  authDomain: "O'ZINGIZNING_PROJECT.firebaseapp.com",
  databaseURL: "https://O'ZINGIZNING_PROJECT-default-rtdb.firebaseio.com",
  projectId: "O'ZINGIZNING_PROJECT",
  storageBucket: "O'ZINGIZNING_PROJECT.appspot.com",
  messagingSenderId: "O'ZINGIZNING_SENDER_ID",
  appId: "O'ZINGIZNING_APP_ID",
};
```

**Muhim:** `databaseURL` bo'lishi shart! Agar ko'rinmasa, 3-qadamda Realtime Database yaratganingizdan keyin qaytib ko'ring.

---

## 3-qadam: Realtime Database yaratish

1. Firebase Console da chap menyudan **"Build"** → **"Realtime Database"** ni bosing
2. **"Create Database"** tugmasini bosing
3. Joylashuvni tanlang (masalan: `United States (us-central1)`)
4. **"Start in test mode"** ni tanlang (keyinroq xavfsizlik qoidalarini sozlaymiz)
5. **"Enable"** tugmasini bosing

Tayyor! Database yaratildi. URL ni `firebase.ts` dagi `databaseURL` ga qo'ying.

---

## 4-qadam: Authentication (admin login) sozlash

1. Firebase Console da chap menyudan **"Build"** → **"Authentication"** ni bosing
2. **"Get started"** tugmasini bosing
3. **"Sign-in method"** tabini oching
4. **"Email/Password"** ni bosing va **"Enable"** qiling, keyin **"Save"**
5. **"Users"** tabini oching
6. **"Add user"** tugmasini bosing
7. Admin uchun email va parol kiriting:
   - Email: `admin@wedding.com` (yoki o'zingizning emailingiz)
   - Password: `o'zingiz_xohlagan_parol`
8. **"Add user"** tugmasini bosing

Endi shu email va parol bilan `/admin` sahifasiga kirishingiz mumkin.

---

## 5-qadam: Database xavfsizlik qoidalari

Firebase Console da **Realtime Database** → **"Rules"** tabini oching va quyidagini yozing:

```json
{
  "rules": {
    "wedding": {
      "config": {
        ".read": true,
        ".write": "auth != null"
      },
      "wishes": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

**"Publish"** tugmasini bosing.

Bu qoidalar nimani anglatadi:
- `config` — hamma o'qiy oladi, faqat admin yoza oladi
- `wishes` — hamma o'qiy va yoza oladi (tilak qoldirish uchun)

---

## 6-qadam: Tekshirish

1. Terminalda `bun run dev` buyrug'ini ishga tushiring
2. Brauzerda bosh sahifani oching — to'y sahifasi ko'rinishi kerak
3. `/admin` sahifasiga o'ting
4. 4-qadamda yaratgan email va parol bilan kiring
5. Kuyov/kelin ismlarini o'zgartiring va **"Saqlash"** ni bosing
6. Bosh sahifaga qayting — o'zgarishlar darhol ko'rinishi kerak

---

## Muammolar va yechimlari

### "Yuklanmoqda..." deb turib qolsa
- `firebase.ts` dagi `databaseURL` to'g'ri ekanligini tekshiring
- Firebase Console da Realtime Database yaratilganligini tekshiring

### Admin sahifada "Email yoki parol xato" desa
- Firebase Console → Authentication → Users da foydalanuvchi borligini tekshiring
- Email va parolni to'g'ri yozganingizni tekshiring

### Ma'lumotlar saqlanmasa
- Firebase Console → Realtime Database → Rules da qoidalar to'g'ri ekanligini tekshiring
- Brauzer konsolida (F12) xato xabarlarni ko'ring

---

## Tayyor!

Endi sizda to'liq ishlaydigan to'y taklifnoma sayti bor:
- **Bosh sahifa** (`/`) — to'y taklifnomasi, countdown, tilaklar, manzil
- **Admin panel** (`/admin`) — barcha ma'lumotlarni boshqarish
- Barcha o'zgarishlar **real-time** ko'rinadi
