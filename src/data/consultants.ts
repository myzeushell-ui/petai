export interface Consultant {
  id: string;
  name: string;
  specialty: ConsultantSpecialty;
  title: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  duration: string;
  availability: "online" | "offline" | "both";
  location?: string;
  languages: string[];
  bio: string;
  emoji: string;
  nextAvailable: string;
  tags: string[];
}

export type ConsultantSpecialty =
  | "veterinarian"
  | "cardiologist"
  | "dermatologist"
  | "surgeon"
  | "nutritionist"
  | "behaviorist"
  | "trainer"
  | "groomer"
  | "breeder_consultant";

export const specialtyLabels: Record<ConsultantSpecialty, string> = {
  veterinarian: "Ветеринар",
  cardiologist: "Кардиолог",
  dermatologist: "Дерматолог",
  surgeon: "Хирург",
  nutritionist: "Диетолог",
  behaviorist: "Зоопсихолог",
  trainer: "Кинолог",
  groomer: "Грумер",
  breeder_consultant: "Консультант по разведению",
};

export const specialtyEmoji: Record<ConsultantSpecialty, string> = {
  veterinarian: "🩺",
  cardiologist: "❤️",
  dermatologist: "🔬",
  surgeon: "🏥",
  nutritionist: "🥗",
  behaviorist: "🧠",
  trainer: "🎓",
  groomer: "✂️",
  breeder_consultant: "🐾",
};

export const consultants: Consultant[] = [
  {
    id: "cons-001", name: "Др. Анна Иванова", specialty: "veterinarian",
    title: "Ветеринар общей практики", experience: 12, rating: 4.9, reviewCount: 247,
    price: 2500, currency: "₽", duration: "45 мин", availability: "both",
    location: "Москва", languages: ["Русский", "English"],
    bio: "Специализируюсь на мелких домашних животных. Комплексный подход к диагностике.",
    emoji: "🩺", nextAvailable: "2026-05-18T10:00:00Z",
    tags: ["общая практика", "диагностика", "анализы"],
  },
  {
    id: "cons-002", name: "Др. Сергей Козлов", specialty: "cardiologist",
    title: "Ветеринар-кардиолог, к.в.н.", experience: 18, rating: 4.9, reviewCount: 189,
    price: 4000, currency: "₽", duration: "60 мин", availability: "both",
    location: "Москва", languages: ["Русский"],
    bio: "Кардиология мелких животных. ЭКГ, ЭхоКГ, холтер. Кандидат ветеринарных наук.",
    emoji: "❤️", nextAvailable: "2026-05-20T14:00:00Z",
    tags: ["сердце", "ЭКГ", "ЭхоКГ", "к.в.н."],
  },
  {
    id: "cons-003", name: "Мария Лебедева", specialty: "behaviorist",
    title: "Зоопсихолог, специалист по поведению", experience: 8, rating: 4.8, reviewCount: 156,
    price: 3000, currency: "₽", duration: "60 мин", availability: "online",
    languages: ["Русский", "English"],
    bio: "Коррекция агрессии, страхов, разрушительного поведения. Гуманные методы R+.",
    emoji: "🧠", nextAvailable: "2026-05-18T16:00:00Z",
    tags: ["агрессия", "страхи", "R+", "онлайн"],
  },
  {
    id: "cons-004", name: "Дмитрий Петров", specialty: "trainer",
    title: "Кинолог, инструктор РКФ", experience: 15, rating: 4.8, reviewCount: 312,
    price: 5000, currency: "₽", duration: "90 мин", availability: "offline",
    location: "Москва", languages: ["Русский"],
    bio: "Базовое и спортивное послушание. Подготовка к выставкам. Проблемное поведение.",
    emoji: "🎓", nextAvailable: "2026-05-19T09:00:00Z",
    tags: ["послушание", "выставки", "выезд"],
  },
  {
    id: "cons-005", name: "Др. Елена Смирнова", specialty: "dermatologist",
    title: "Ветеринар-дерматолог", experience: 10, rating: 4.7, reviewCount: 134,
    price: 3500, currency: "₽", duration: "45 мин", availability: "both",
    location: "Санкт-Петербург", languages: ["Русский"],
    bio: "Аллергии, дерматиты, отодектоз, проблемы с шерстью. Аллерготестирование.",
    emoji: "🔬", nextAvailable: "2026-05-19T11:00:00Z",
    tags: ["аллергия", "кожа", "шерсть", "тесты"],
  },
  {
    id: "cons-006", name: "Ольга Никитина", specialty: "nutritionist",
    title: "Ветеринар-диетолог", experience: 7, rating: 4.8, reviewCount: 98,
    price: 2000, currency: "₽", duration: "30 мин", availability: "online",
    languages: ["Русский", "English"],
    bio: "Подбор рациона, коррекция веса, лечебные диеты. BARF, промышленные корма.",
    emoji: "🥗", nextAvailable: "2026-05-18T12:00:00Z",
    tags: ["диета", "BARF", "вес", "рацион"],
  },
  {
    id: "cons-007", name: "Др. Алексей Морозов", specialty: "surgeon",
    title: "Ветеринар-хирург, ортопед", experience: 20, rating: 4.9, reviewCount: 278,
    price: 5000, currency: "₽", duration: "60 мин", availability: "offline",
    location: "Москва", languages: ["Русский", "Deutsch"],
    bio: "Ортопедия, нейрохирургия, малоинвазивные операции. Стажировка в Германии.",
    emoji: "🏥", nextAvailable: "2026-05-21T10:00:00Z",
    tags: ["ортопедия", "операции", "дисплазия"],
  },
  {
    id: "cons-008", name: "Наталья Волкова", specialty: "breeder_consultant",
    title: "Консультант-заводчик, эксперт РКФ", experience: 25, rating: 4.9, reviewCount: 167,
    price: 4500, currency: "₽", duration: "60 мин", availability: "online",
    languages: ["Русский"],
    bio: "Подбор пар, анализ COI, подготовка к вязке, родовспоможение. 25 лет опыта в породе.",
    emoji: "🐾", nextAvailable: "2026-05-18T18:00:00Z",
    tags: ["разведение", "COI", "вязка", "РКФ"],
  },
  {
    id: "cons-009", name: "Виктория Кузнецова", specialty: "groomer",
    title: "Грумер, мастер международного класса", experience: 11, rating: 4.7, reviewCount: 203,
    price: 3500, currency: "₽", duration: "120 мин", availability: "offline",
    location: "Москва", languages: ["Русский"],
    bio: "Породные и креативные стрижки, hand-stripping, подготовка к выставкам.",
    emoji: "✂️", nextAvailable: "2026-05-18T10:00:00Z",
    tags: ["стрижка", "выставки", "hand-stripping"],
  },
  {
    id: "cons-010", name: "Др. Игорь Белов", specialty: "veterinarian",
    title: "Ветеринар, специалист по экзотам", experience: 9, rating: 4.6, reviewCount: 87,
    price: 3000, currency: "₽", duration: "45 мин", availability: "online",
    languages: ["Русский", "English"],
    bio: "Кролики, птицы, рептилии, хорьки. Онлайн-консультации по всей России.",
    emoji: "🦜", nextAvailable: "2026-05-19T15:00:00Z",
    tags: ["экзоты", "кролики", "птицы", "онлайн"],
  },
];

export function getConsultantsBySpecialty(specialty: ConsultantSpecialty): Consultant[] {
  return consultants.filter((c) => c.specialty === specialty);
}

export function getTopConsultants(limit = 5): Consultant[] {
  return [...consultants].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, limit);
}
