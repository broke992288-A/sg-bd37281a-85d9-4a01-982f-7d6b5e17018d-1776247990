<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Capacitor-Mobile-119EFF?logo=capacitor&logoColor=white" alt="Capacitor" />
</p>

# 🏥 TransplantCare

**Трансплантация беморларини кузатиш учун клиник даражадаги веб-платформа**

TransplantCare — буйрак ва жигар трансплантацияси ўтказилган беморларнинг клиник ҳолатини реал вақтда кузатиш, хавфни баҳолаш ва таҳлил натижаларини бошқариш учун мўлжалланган тизим.

---

## ✨ Асосий имкониятлар

- 🔬 **29 та клиник кўрсаткич** — лаборатория натижаларини тўлиқ бошқариш
- 📊 **Автоматик риск баҳолаш** — KDIGO 2024 / AASLD 2023 клиник қўлланмаларга асосланган 0–100 балли алгоритм
- 🤖 **AI-башорат** — режекция эҳтимолини сунъий интеллект ёрдамида аниқлаш
- 📸 **OCR таҳлил** — лаборатория ҳисоботларини расмдан автоматик ўқиш
- 💊 **Дори бошқаруви** — дорилар, дозалар, навбатлар ва мос келиш мониторинги
- ⚠️ **Огоҳлантиришлар** — критик кўрсаткичлар учун реал вақтда alert тизими
- 📈 **Тренд таҳлил** — сўнгги 5 та таҳлил бўйича ўзгариш тезлигини визуализация қилиш
- 🌐 **Кўп тилли** — Ўзбек, Рус, Инглиз тилларини қўллаб-қувватлаш
- 📱 **PWA + Мобил** — офлайн режим, Capacitor орқали Android/iOS
- 🔐 **RBAC хавфсизлик** — admin, doctor, patient, support роллари + 48 та RLS қоидаси

---

## 🛠 Технологиялар

| Қатлам | Технология |
|--------|-----------|
| **Frontend** | React 18 + TypeScript 5 + Vite 5 |
| **UI** | Tailwind CSS 3 + shadcn/ui + Radix UI |
| **State** | TanStack React Query v5 |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **Edge Functions** | Deno — OCR, риск ҳисоблаш, башорат, таржима, мониторинг |
| **Charts** | Recharts |
| **PWA** | vite-plugin-pwa + Workbox |
| **Mobile** | Capacitor 8 (Android / iOS) |
| **AI** | OpenAI GPT-5-mini (OCR), Lovable AI (башорат) |
| **Testing** | Vitest + Playwright E2E |

---

## 📂 Лойиҳа структураси

```
src/
├── components/
│   ├── features/    # Бизнес-логика компонентлари (28+)
│   ├── layout/      # DashboardLayout, Sidebar, TopHeader
│   └── ui/          # shadcn/ui компонентлари (50+)
├── hooks/           # React хуклар (16+)
├── services/        # API сервислари (15+)
├── utils/           # Утилитлар (8 та)
├── pages/           # Саҳифалар (18+)
├── types/           # TypeScript типлар
├── data/            # Статик маълумотлар
└── test/            # Vitest тестлар
supabase/
├── functions/       # Edge Functions (5 та)
└── migrations/      # SQL миграциялар
e2e/                 # Playwright E2E тестлар
```

---

## 🗄 Маълумотлар базаси (13 жадвал)

| Жадвал | Тавсиф |
|--------|--------|
| `patients` | Беморлар рўйхати ва асосий маълумотлар |
| `lab_results` | 29 та клиник кўрсаткич (Cr, eGFR, ALT, AST...) |
| `risk_snapshots` | Хавф баҳолаш тарихи |
| `patient_alerts` | Огоҳлантиришлар |
| `medications` | Дорилар рўйхати |
| `medication_adherence` | Дори қабул қилиш мониторинги |
| `medication_changes` | Доза ўзгаришлари тарихи |
| `clinical_thresholds` | Клиник меъёрлар (KDIGO / AASLD) |
| `lab_schedules` | Таҳлил жадвали |
| `transplant_episodes` | Трансплантация эпизодлари |
| `patient_events` | Воқеалар тарихи |
| `audit_logs` | Аудит логлари |
| `user_roles` | Фойдаланувчи роллари (RBAC) |

---

## 🚀 Ўрнатиш

### Талаблар

- **Node.js** 18+ ([nvm](https://github.com/nvm-sh/nvm) орқали ўрнатиш тавсия этилади)
- **npm** ёки **bun**

### Лойиҳани ишга тушириш

```bash
# 1. Репозиторияни клонлаш
git clone https://github.com/broke992288-A/TransplantCare.git

# 2. Лойиҳа папкасига ўтиш
cd TransplantCare

# 3. Боғлиқликларни ўрнатиш
npm install

# 4. Дастурни ишга тушириш
npm run dev
```

Дастур `http://localhost:5173` манзилида очилади.

### Тестлар

```bash
# Unit тестлар
npm run test

# E2E тестлар (Playwright)
npx playwright test
```

---

## 🔐 Хавфсизлик

- **RBAC** — 4 та рол: `admin`, `doctor`, `patient`, `support`
- **RLS** — 48 та Row-Level Security қоидаси
- **JWT** — автоматик янгиланувчи сессиялар
- **Сессия таймаут** — 30 дақиқа ҳаракатсизликдан кейин автоматик чиқиш
- **Аудит** — барча ўзгаришлар `audit_logs` жадвалида сақланади

---

## 📊 Риск алгоритми

| Орган | Қўлланма | Асосий кўрсаткичлар |
|-------|----------|-------------------|
| **Буйрак** | KDIGO 2024 | Креатинин, eGFR, протеинурия, калий, такролимус |
| **Жигар** | AASLD 2023 | ALT, AST, билирубин, GGT, ALP, такролимус |

**Балл шкаласи**: 0–100 → `low` (<30) · `medium` (30–59) · `high` (≥60)

---

## 🤝 Ҳисса қўшиш

1. Репозиторияни fork қилинг
2. Янги branch яратинг (`git checkout -b feature/yangi-imkoniyat`)
3. Ўзгаришларни commit қилинг (`git commit -m 'feat: yangi imkoniyat'`)
4. Branch ни push қилинг (`git push origin feature/yangi-imkoniyat`)
5. Pull Request очинг

---

## 📄 Лицензия

Ушбу лойиҳа [MIT лицензияси](LICENSE) остида тарқатилади.

---

<p align="center">
  <b>TransplantCare</b> — Lovable ёрдамида яратилган 💚
</p>
