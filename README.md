# Сайт Корпусу НАВ (Vite + React)

Сайт спільноти «Корпус НАВ»: підрозділи, інтерактивна карта конфлікту з мітками подій, набір до лав.

Стек: **Vite + React + TypeScript** · Tailwind v4 (`@tailwindcss/vite`) · react-leaflet (Leaflet) · framer-motion.

## Запуск (VS Code)

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # збірка в dist/ (перевірка типів + білд)
npm run preview   # локальний перегляд зібраного dist/
```

## Деплой на Vercel (безкоштовно)

1. Запуш проєкт на GitHub.
2. vercel.com → **Add New… → Project** → імпортуй репозиторій.
3. Vercel сам визначить **Vite**: Build = `npm run build`, Output = `dist`. Нічого міняти не треба.
4. **Deploy**.

(Або з терміналу: `npm i -g vercel` → `vercel`.)

## Структура

```
index.html              # точка входу, мета + підключення Google Fonts
src/
  main.tsx              # рендер <App/>
  App.tsx              # композиція секцій сторінки
  index.css            # тема (кольори, шрифти), Tailwind, стилі Leaflet
  lib/data.ts          # ← УВЕСЬ КОНТЕНТ: події карти, підрозділи, структура
  components/
    SiteNav, Hero, Units, Structure, Recruitment, Emblems
    map/ConflictMap.tsx   # сама Leaflet-карта
    map/MapSection.tsx    # фільтр-легенда + модалка події
public/
  map/region.svg       # підкладка карти (стилізована, не реальна гра)
  media/               # оригінали (скріни, газети, відео)
  media/crops/         # обрізані фото для карток подій
```

## Як редагувати контент

Майже все — у **`src/lib/data.ts`**.

### Додати подію на карту

Допиши об'єкт у масив `EVENTS`:

```ts
{
  id: "e9",
  type: "kill",            // kill | vehicle | trophy | enemy | loss
  title: "Назва події",
  date: "03.09.2026",
  sector: "D-3",
  x: 900, y: 420,          // пікселі на карті (полотно 1600 x 1000)
  description: "Опис...",
  units: ["TFEW"],
  image: "/media/crops/squad.jpg",  // опційно
  video: "/media/1007.mp4",         // опційно
  source: "Freelancer Times",
}
```

`x`/`y` — від лівого верхнього кута карти (ширина 1600, висота 1000). Підбирай на око.

### Типи міток / кольори — `EVENT_TYPES`. Підрозділи / структура — `UNITS`, `STRUCTURE` (там же).

## Карта

Підкладка — `public/map/region.svg`. Щоб поставити справжню ігрову карту: поклади зображення
в `public/map/` і зміни `url` в `ImageOverlay` (`src/components/map/ConflictMap.tsx`). Якщо
змінюєш розмір полотна — онови там же `W`/`H` і перерахуй `x`/`y` подій.

## Шрифти

Підключені через Google Fonts у `index.html`: Oswald (заголовки), Inter (текст),
JetBrains Mono (мітки/дати). Імена шрифтів — у CSS-змінних `--font-*` у `src/index.css`.
