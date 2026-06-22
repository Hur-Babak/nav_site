export type EventType = "kill" | "vehicle" | "trophy" | "enemy" | "loss";

export interface EventTypeMeta {
  label: string;
  color: string;
  icon: string;
}

export const EVENT_TYPES: Record<EventType, EventTypeMeta> = {
  kill: { label: "Ліквідація противника", color: "#e24b4a", icon: "crosshair" },
  vehicle: { label: "Знищено техніку", color: "#ef9f27", icon: "flame" },
  trophy: { label: "Трофей / захоплено", color: "#63a022", icon: "award" },
  enemy: { label: "Активність НАПА «Кедр»", color: "#2f8fd0", icon: "drone" },
  loss: { label: "Наші втрати / полонені", color: "#8b8b85", icon: "shield" },
};

export interface MapEvent {
  id: string;
  type: EventType;
  title: string;
  date: string;
  sector: string;
  /** Координати в пікселях карти (1600x1000), від лівого верхнього кута. */
  x: number;
  y: number;
  description: string;
  units: string[];
  image?: string;
  video?: string;
  source: string;
}

export const EVENTS: MapEvent[] = [
  {
    id: "e1",
    type: "vehicle",
    title: "Знищено колону постачання НАПА",
    date: "28.08.2026",
    sector: "C-3",
    x: 820,
    y: 560,
    description:
      "Перерізано логістичний маршрут противника на трасі вглиб узбережжя. Уражено три одиниці техніки, склад БК ліквідовано без втрат з нашого боку.",
    units: ["TFEW", "CCO P.U.M.A."],
    image: "/media/crops/road.jpg",
    source: "Freelancer Times — A DEADLY CHAIN",
  },
  {
    id: "e2",
    type: "kill",
    title: "Ліквідовано рейдову групу",
    date: "30.08.2026",
    sector: "D-2",
    x: 1000,
    y: 330,
    description:
      "Засідка на околиці Перхаваца. Знищено мобільну групу противника, що готувала провокацію. Двоє взято в полон.",
    units: ["TFEW"],
    image: "/media/crops/forest.jpg",
    source: "Freelancer Times — A DEADLY CHAIN",
  },
  {
    id: "e3",
    type: "trophy",
    title: "Захоплено склад боєприпасів",
    date: "26.08.2026",
    sector: "F-3",
    x: 1240,
    y: 500,
    description:
      "Раптовим штурмом захоплено перевалочний склад НАПА під Дравоградом. Вилучено зброю, БК та документи з маршрутами постачання.",
    units: ["ION"],
    image: "/media/crops/village.jpg",
    source: "Freelancer Times — A DEADLY CHAIN",
  },
  {
    id: "e4",
    type: "enemy",
    title: "FPV-удар по базі Корпусу",
    date: "29.08.2026",
    sector: "E-4",
    x: 1150,
    y: 640,
    description:
      "Серія заходів FPV по нашому тилу, включно з ударом по базі. Точність зростає — противник працює на збільшеній відстані.",
    units: ["НАПА «Кедр»"],
    image: "/media/crops/fpv.jpg",
    video: "/media/1007.mp4",
    source: "Бабак — оперативне зведення",
  },
  {
    id: "e5",
    type: "loss",
    title: "Втрати при штурмі",
    date: "01.09.2026",
    sector: "C-4",
    x: 700,
    y: 720,
    description:
      "Під час нічного зближення група потрапила під вогонь. Двоє поранених, евакуйовані. Позицію утримано.",
    units: ["CCO P.U.M.A."],
    image: "/media/crops/squad.jpg",
    source: "Freelancer Times — A DEADLY CHAIN",
  },
  {
    id: "e6",
    type: "enemy",
    title: "Провокація: прапор НАПА",
    date: "31.08.2026",
    sector: "B-3",
    x: 540,
    y: 540,
    description:
      "Противник підняв прапор на трубі заводу в підконтрольному нам пункті. Психологічний тиск за відсутності реальних успіхів. Прапор знято.",
    units: ["НАПА «Кедр»"],
    image: "/media/crops/flag.jpg",
    source: "Бабак — провокація НАПА",
  },
  {
    id: "e7",
    type: "kill",
    title: "Перерізано прибережну логістику",
    date: "27.08.2026",
    sector: "A-3",
    x: 360,
    y: 520,
    description:
      "Удар по портовому вузлу постачання НАПА. Знищено охорону, рух вантажів зупинено на добу.",
    units: ["TFEW", "ION"],
    image: "/media/crops/clean.jpg",
    source: "Freelancer Times — A DEADLY CHAIN",
  },
  {
    id: "e8",
    type: "trophy",
    title: "Трофейна техніка",
    date: "02.09.2026",
    sector: "C-2",
    x: 900,
    y: 450,
    description:
      "Після зачистки населеного пункту під контроль узято справну техніку противника. Передано на базу Корпусу.",
    units: ["CCO P.U.M.A."],
    image: "/media/crops/clean.jpg",
    source: "Freelancer Times",
  },
];

export interface Unit {
  id: string;
  short: string;
  name: string;
  motto: string;
  members: number;
  accent: string;
  open: boolean;
  description: string;
}

export const UNITS: Unit[] = [
  {
    id: "tfew",
    short: "TFEW",
    name: "Task Force Elite World",
    motto: "Who Dares Wins",
    members: 18,
    accent: "#e24b4a",
    open: true,
    description:
      "Прийнята до складу UKSF у 2023 році — синхронно зі шведською кризою. Вістря Корпусу: прямі бойові виходи, перерізання логістики, штурмові операції. Решта — засекречено до визнання серед своїх.",
  },
  {
    id: "puma",
    short: "CCO P.U.M.A.",
    name: "Predator Unit Military Apex",
    motto: "And the Living Will Envy the Dead",
    members: 13,
    accent: "#9a9a93",
    open: true,
    description:
      "Приватна військова компанія ветеранів з усього світу. Хардкорні PvP і кооперативні сценарії, серйозна координація. Фігурувала у справах ще до офіційного створення Корпусу.",
  },
  {
    id: "ion",
    short: "ION",
    name: "Special Group",
    motto: "Since you do — we do",
    members: 10,
    accent: "#2f8fd0",
    open: true,
    description:
      "Міжнародний підрозділ спеціального призначення: контртерор, розвідка, евакуація заручників, дії в складних умовах. Відкритий напрямок — працюєш поруч із досвідченими бійцями.",
  },
];

export interface OrgNode {
  label: string;
  note?: string;
}

export const STRUCTURE: { tier: string; nodes: OrgNode[] }[] = [
  { tier: "Командування", nodes: [{ label: "Overlord", note: "×2" }] },
  { tier: "Підготовка", nodes: [{ label: "Instructor", note: "×4" }] },
  {
    tier: "Основні підрозділи",
    nodes: [
      { label: "TFEW" },
      { label: "CCO P.U.M.A." },
      { label: "ION" },
    ],
  },
  {
    tier: "Штатні взводи",
    nodes: [
      { label: "Uniform 2-1" },
      { label: "Uniform 2-2" },
      { label: "Uniform 2-3" },
      { label: "Uniform 2-4" },
      { label: "Uniform 2-5" },
      { label: "Uniform 2-6" },
    ],
  },
  {
    tier: "Підтримка",
    nodes: [
      { label: "Super 6" },
      { label: "SNOT" },
      { label: "Outlander" },
    ],
  },
];
