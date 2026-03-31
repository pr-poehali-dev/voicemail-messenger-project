export type Section = "chats" | "groups" | "news" | "video" | "music" | "circles" | "contacts" | "profile";

export interface Message {
  id: number;
  text?: string;
  sticker?: string;
  voice?: boolean;
  circle?: boolean;
  time: string;
  out: boolean;
  encrypted?: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  encrypted?: boolean;
}

export const CHATS: Chat[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", lastMsg: "Завтра встреча в 10:00 🔥", time: "14:32", unread: 3, online: true, encrypted: true },
  { id: 2, name: "Команда дизайна", avatar: "КД", lastMsg: "Макеты готовы!", time: "13:11", unread: 1, encrypted: true },
  { id: 3, name: "Марина Светлова", avatar: "МС", lastMsg: "Отправила файлы", time: "12:45", online: true, encrypted: true },
  { id: 4, name: "Product team", avatar: "PT", lastMsg: "Новый спринт стартует", time: "11:00", encrypted: true },
  { id: 5, name: "Дмитрий Козлов", avatar: "ДК", lastMsg: "👍", time: "10:22", online: true, encrypted: true },
  { id: 6, name: "Анна Белова", avatar: "АБ", lastMsg: "Жду твой ответ", time: "09:15", unread: 5, encrypted: true },
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела?", time: "13:00", out: false, encrypted: true },
  { id: 2, text: "Всё отлично! Работаем над новым проектом 🚀", time: "13:01", out: true, encrypted: true },
  { id: 3, voice: true, time: "13:05", out: false, encrypted: true },
  { id: 4, text: "Круто! Когда презентация?", time: "13:06", out: true, encrypted: true },
  { id: 5, sticker: "🎉", time: "13:10", out: false, encrypted: true },
  { id: 6, text: "Завтра в 10:00! Жди ссылку", time: "13:11", out: false, encrypted: true },
];

export const STICKER_PACKS = [
  {
    name: "Эмоции",
    icon: "😊",
    stickers: ["😀","😂","🥹","😍","🥰","😎","🤩","😏","😌","🤗","😤","😭","😱","🤔","🫡","😴","🤪","🥳","😇","🫶"],
  },
  {
    name: "Жесты",
    icon: "👋",
    stickers: ["👋","🤝","👍","👎","❤️","🔥","💯","✅","🎉","🎊","🏆","💪","🙏","👀","💀","🫂","🤌","👌","🫰","✌️"],
  },
  {
    name: "Животные",
    icon: "🐶",
    stickers: ["🐶","🐱","🦊","🐻","🐼","🐨","🦁","🐯","🦋","🐸","🦄","🐙","🦈","🦖","🐬","🦜","🐺","🦝","🦦","🐾"],
  },
  {
    name: "Еда",
    icon: "🍕",
    stickers: ["🍕","🍔","🌮","🍜","🍣","🍰","🎂","🍩","🧁","☕","🧃","🍷","🥂","🍿","🍭","🍫","🥐","🍓","🥑","🌯"],
  },
];

export const GROUPS = [
  { id: 1, name: "Разработчики РФ", members: "12.4K", avatar: "🛠", desc: "Технологии, код, будущее" },
  { id: 2, name: "Дизайн-движение", members: "8.1K", avatar: "🎨", desc: "UI/UX тренды 2025" },
  { id: 3, name: "Стартап-хаб", members: "5.7K", avatar: "🚀", desc: "Инвестиции, нетворкинг" },
  { id: 4, name: "AI Революция", members: "24K", avatar: "🤖", desc: "Искусственный интеллект" },
];

export const NEWS = [
  { id: 1, author: "TechFlash", time: "5 мин назад", avatar: "⚡", text: "Apple анонсировала новый чип M4 Ultra с 32-ядерным GPU — производительность выросла на 40% по сравнению с предыдущим поколением.", likes: 1240, views: "48K" },
  { id: 2, author: "Космос Live", time: "23 мин назад", avatar: "🛸", text: "SpaceX успешно запустила очередную партию спутников Starlink. Интернет в отдалённых районах становится доступнее.", likes: 876, views: "22K" },
  { id: 3, author: "Финансы PRO", time: "1 час назад", avatar: "📈", text: "Биткоин обновил исторический максимум, превысив отметку в $120,000. Эксперты прогнозируют дальнейший рост.", likes: 3201, views: "95K" },
  { id: 4, author: "GameWorld", time: "2 часа назад", avatar: "🎮", text: "GTA VI — дата релиза официально подтверждена. Rockstar показала финальный трейлер с открытым миром.", likes: 5640, views: "210K" },
];

export const VIDEOS = [
  { id: 1, title: "Будущее AI: что нас ждёт", channel: "TechVision", duration: "12:34", views: "1.2M", thumb: "🤖" },
  { id: 2, title: "Дизайн интерфейсов 2025", channel: "UIcraft", duration: "08:21", views: "450K", thumb: "🎨" },
  { id: 3, title: "Запуск ракеты — прямой эфир", channel: "SpaceLive", duration: "34:00", views: "3.4M", thumb: "🚀" },
  { id: 4, title: "10 трендов веб-разработки", channel: "DevPulse", duration: "15:07", views: "890K", thumb: "💻" },
];

export const MUSIC = [
  { id: 1, title: "Neon Pulse", artist: "SYNTH//WAVE", duration: "3:42", cover: "🌊" },
  { id: 2, title: "Digital Dreams", artist: "CyberSoul", duration: "4:11", cover: "💿" },
  { id: 3, title: "Void Walker", artist: "DARKSYNTH", duration: "5:03", cover: "🌑" },
  { id: 4, title: "Aurora Rising", artist: "AmbientX", duration: "6:28", cover: "🌌" },
  { id: 5, title: "Electric Rain", artist: "RetroFuture", duration: "3:55", cover: "⚡" },
  { id: 6, title: "Nova Signal", artist: "SpaceBeats", duration: "4:44", cover: "🛸" },
];

export const CIRCLES = [
  { id: 1, author: "Алексей Г.", avatar: "АГ", thumb: "🎤", seen: false },
  { id: 2, author: "Команда", avatar: "КД", thumb: "📊", seen: false },
  { id: 3, author: "Марина С.", avatar: "МС", thumb: "🌅", seen: true },
  { id: 4, author: "Product", avatar: "PT", thumb: "🏃", seen: true },
  { id: 5, author: "Дмитрий К.", avatar: "ДК", thumb: "🎸", seen: false },
];

export const CONTACTS = [
  { id: 1, name: "Алексей Громов", status: "В сети", avatar: "АГ", online: true },
  { id: 2, name: "Марина Светлова", status: "В сети", avatar: "МС", online: true },
  { id: 3, name: "Дмитрий Козлов", status: "Был час назад", avatar: "ДК", online: false },
  { id: 4, name: "Анна Белова", status: "Была 3 часа назад", avatar: "АБ", online: false },
  { id: 5, name: "Сергей Попов", status: "В сети", avatar: "СП", online: true },
  { id: 6, name: "Ольга Мартынова", status: "Была вчера", avatar: "ОМ", online: false },
];

export const NAV_ITEMS: { key: Section; icon: string; label: string }[] = [
  { key: "chats", icon: "MessageCircle", label: "Чаты" },
  { key: "groups", icon: "Users", label: "Группы" },
  { key: "news", icon: "Newspaper", label: "Новости" },
  { key: "video", icon: "Play", label: "Видео" },
  { key: "music", icon: "Music", label: "Музыка" },
  { key: "circles", icon: "Circle", label: "Кружки" },
  { key: "contacts", icon: "BookUser", label: "Контакты" },
  { key: "profile", icon: "UserCircle", label: "Профиль" },
];
