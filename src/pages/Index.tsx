import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "chats" | "groups" | "news" | "video" | "music" | "circles" | "contacts" | "profile";

interface Message {
  id: number;
  text?: string;
  sticker?: string;
  voice?: boolean;
  circle?: boolean;
  time: string;
  out: boolean;
  encrypted?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  encrypted?: boolean;
}

const CHATS: Chat[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", lastMsg: "Завтра встреча в 10:00 🔥", time: "14:32", unread: 3, online: true, encrypted: true },
  { id: 2, name: "Команда дизайна", avatar: "КД", lastMsg: "Макеты готовы!", time: "13:11", unread: 1, encrypted: true },
  { id: 3, name: "Марина Светлова", avatar: "МС", lastMsg: "Отправила файлы", time: "12:45", online: true, encrypted: true },
  { id: 4, name: "Product team", avatar: "PT", lastMsg: "Новый спринт стартует", time: "11:00", encrypted: true },
  { id: 5, name: "Дмитрий Козлов", avatar: "ДК", lastMsg: "👍", time: "10:22", online: true, encrypted: true },
  { id: 6, name: "Анна Белова", avatar: "АБ", lastMsg: "Жду твой ответ", time: "09:15", unread: 5, encrypted: true },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела?", time: "13:00", out: false, encrypted: true },
  { id: 2, text: "Всё отлично! Работаем над новым проектом 🚀", time: "13:01", out: true, encrypted: true },
  { id: 3, voice: true, time: "13:05", out: false, encrypted: true },
  { id: 4, text: "Круто! Когда презентация?", time: "13:06", out: true, encrypted: true },
  { id: 5, sticker: "🎉", time: "13:10", out: false, encrypted: true },
  { id: 6, text: "Завтра в 10:00! Жди ссылку", time: "13:11", out: false, encrypted: true },
];

const STICKER_PACKS = [
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

const GROUPS = [
  { id: 1, name: "Разработчики РФ", members: "12.4K", avatar: "🛠", desc: "Технологии, код, будущее" },
  { id: 2, name: "Дизайн-движение", members: "8.1K", avatar: "🎨", desc: "UI/UX тренды 2025" },
  { id: 3, name: "Стартап-хаб", members: "5.7K", avatar: "🚀", desc: "Инвестиции, нетворкинг" },
  { id: 4, name: "AI Революция", members: "24K", avatar: "🤖", desc: "Искусственный интеллект" },
];

const NEWS = [
  { id: 1, author: "TechFlash", time: "5 мин назад", avatar: "⚡", text: "Apple анонсировала новый чип M4 Ultra с 32-ядерным GPU — производительность выросла на 40% по сравнению с предыдущим поколением.", likes: 1240, views: "48K" },
  { id: 2, author: "Космос Live", time: "23 мин назад", avatar: "🛸", text: "SpaceX успешно запустила очередную партию спутников Starlink. Интернет в отдалённых районах становится доступнее.", likes: 876, views: "22K" },
  { id: 3, author: "Финансы PRO", time: "1 час назад", avatar: "📈", text: "Биткоин обновил исторический максимум, превысив отметку в $120,000. Эксперты прогнозируют дальнейший рост.", likes: 3201, views: "95K" },
  { id: 4, author: "GameWorld", time: "2 часа назад", avatar: "🎮", text: "GTA VI — дата релиза официально подтверждена. Rockstar показала финальный трейлер с открытым миром.", likes: 5640, views: "210K" },
];

const VIDEOS = [
  { id: 1, title: "Будущее AI: что нас ждёт", channel: "TechVision", duration: "12:34", views: "1.2M", thumb: "🤖" },
  { id: 2, title: "Дизайн интерфейсов 2025", channel: "UIcraft", duration: "08:21", views: "450K", thumb: "🎨" },
  { id: 3, title: "Запуск ракеты — прямой эфир", channel: "SpaceLive", duration: "34:00", views: "3.4M", thumb: "🚀" },
  { id: 4, title: "10 трендов веб-разработки", channel: "DevPulse", duration: "15:07", views: "890K", thumb: "💻" },
];

const MUSIC = [
  { id: 1, title: "Neon Pulse", artist: "SYNTH//WAVE", duration: "3:42", cover: "🌊" },
  { id: 2, title: "Digital Dreams", artist: "CyberSoul", duration: "4:11", cover: "💿" },
  { id: 3, title: "Void Walker", artist: "DARKSYNTH", duration: "5:03", cover: "🌑" },
  { id: 4, title: "Aurora Rising", artist: "AmbientX", duration: "6:28", cover: "🌌" },
  { id: 5, title: "Electric Rain", artist: "RetroFuture", duration: "3:55", cover: "⚡" },
  { id: 6, title: "Nova Signal", artist: "SpaceBeats", duration: "4:44", cover: "🛸" },
];

const CIRCLES = [
  { id: 1, author: "Алексей Г.", avatar: "АГ", thumb: "🎤", seen: false },
  { id: 2, author: "Команда", avatar: "КД", thumb: "📊", seen: false },
  { id: 3, author: "Марина С.", avatar: "МС", thumb: "🌅", seen: true },
  { id: 4, author: "Product", avatar: "PT", thumb: "🏃", seen: true },
  { id: 5, author: "Дмитрий К.", avatar: "ДК", thumb: "🎸", seen: false },
];

const CONTACTS = [
  { id: 1, name: "Алексей Громов", status: "В сети", avatar: "АГ", online: true },
  { id: 2, name: "Марина Светлова", status: "В сети", avatar: "МС", online: true },
  { id: 3, name: "Дмитрий Козлов", status: "Был час назад", avatar: "ДК", online: false },
  { id: 4, name: "Анна Белова", status: "Была 3 часа назад", avatar: "АБ", online: false },
  { id: 5, name: "Сергей Попов", status: "В сети", avatar: "СП", online: true },
  { id: 6, name: "Ольга Мартынова", status: "Была вчера", avatar: "ОМ", online: false },
];

const NAV_ITEMS: { key: Section; icon: string; label: string }[] = [
  { key: "chats", icon: "MessageCircle", label: "Чаты" },
  { key: "groups", icon: "Users", label: "Группы" },
  { key: "news", icon: "Newspaper", label: "Новости" },
  { key: "video", icon: "Play", label: "Видео" },
  { key: "music", icon: "Music", label: "Музыка" },
  { key: "circles", icon: "Circle", label: "Кружки" },
  { key: "contacts", icon: "BookUser", label: "Контакты" },
  { key: "profile", icon: "UserCircle", label: "Профиль" },
];

function AvatarCircle({ text, size = "md", gradient = "primary" }: { text: string; size?: "sm" | "md" | "lg"; gradient?: "primary" | "fire" | "ice" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const grads = { primary: "from-purple-500 to-cyan-400", fire: "from-pink-500 to-purple-500", ice: "from-cyan-400 to-blue-500" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${grads[gradient]} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {text}
    </div>
  );
}

function WaveAnimation() {
  return (
    <span className="flex items-end gap-[2px] h-4">
      {[1,2,3,4,5].map(i => <span key={i} className="wave-bar h-3 bg-white/80" style={{ animationDelay: `${(i-1)*0.15}s` }} />)}
    </span>
  );
}

function VoiceMessage({ out }: { out: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl max-w-[200px] ${out ? "msg-bubble-out" : "msg-bubble-in"}`}>
      <button onClick={() => setPlaying(!playing)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/30 transition-all">
        <Icon name={playing ? "Pause" : "Play"} size={14} />
      </button>
      {playing ? <WaveAnimation /> : (
        <div className="flex items-end gap-[2px] h-4">
          {[3,5,4,6,3,5,4,3,5,4].map((h, i) => (
            <span key={i} className="inline-block w-[3px] rounded-full bg-white/50" style={{ height: `${h * 2}px` }} />
          ))}
        </div>
      )}
      <span className="text-xs opacity-60 ml-1">0:12</span>
    </div>
  );
}

function StickerPanel({ onSelect }: { onSelect: (s: string) => void }) {
  const [activePack, setActivePack] = useState(0);
  return (
    <div className="absolute bottom-full mb-2 left-0 w-80 glass rounded-2xl overflow-hidden shadow-2xl glow-purple animate-fade-slide z-50">
      <div className="flex border-b border-white/10">
        {STICKER_PACKS.map((pack, i) => (
          <button
            key={i}
            onClick={() => setActivePack(i)}
            className={`flex-1 py-2 text-lg transition-all ${activePack === i ? "bg-purple-500/20 border-b-2 border-purple-400" : "hover:bg-white/5"}`}
          >
            {pack.icon}
          </button>
        ))}
      </div>
      <div className="p-3 grid grid-cols-5 gap-2 max-h-52 overflow-y-auto">
        {STICKER_PACKS[activePack].stickers.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="text-3xl hover:scale-125 transition-transform duration-150 hover:bg-white/10 rounded-xl p-1"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ chat }: { chat: Chat }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text?: string, sticker?: string) => {
    if (!text && !sticker) return;
    const msg: Message = {
      id: Date.now(),
      text,
      sticker,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      out: true,
      encrypted: true,
    };
    setMessages(prev => [...prev, msg]);
    setInput("");
    setShowStickers(false);
  };

  const sendVoice = () => {
    setIsRecording(false);
    const msg: Message = {
      id: Date.now(),
      voice: true,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      out: true,
      encrypted: true,
    };
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 glass border-b border-white/8 flex-shrink-0">
        <div className="relative">
          <AvatarCircle text={chat.avatar} />
          {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{chat.name}</span>
            {chat.encrypted && <span title="E2E шифрование" className="text-emerald-400"><Icon name="Lock" size={12} /></span>}
          </div>
          <span className="text-xs text-white/40">{chat.online ? "в сети" : "не в сети"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"><Icon name="Phone" size={16} /></button>
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"><Icon name="Video" size={16} /></button>
          <button className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"><Icon name="MoreVertical" size={16} /></button>
        </div>
      </div>

      {/* E2E notice */}
      <div className="mx-auto mt-3 px-3 py-1 rounded-full glass text-xs text-emerald-400 flex items-center gap-1">
        <Icon name="Lock" size={11} />
        <span>Переписка защищена E2E шифрованием</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-fade-slide`}
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            {msg.sticker ? (
              <div className="text-5xl select-none hover:scale-110 transition-transform cursor-default" title={msg.time}>
                {msg.sticker}
              </div>
            ) : msg.voice ? (
              <VoiceMessage out={msg.out} />
            ) : (
              <div className={`max-w-[70%] px-4 py-2 ${msg.out ? "msg-bubble-out" : "msg-bubble-in"}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] opacity-40">{msg.time}</span>
                  {msg.encrypted && <Icon name="Lock" size={9} className="opacity-30" />}
                  {msg.out && <Icon name="CheckCheck" size={11} className="opacity-50" />}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0 glass border-t border-white/8">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            {showStickers && (
              <StickerPanel onSelect={(s) => send(undefined, s)} />
            )}
            <div className="flex items-center glass rounded-2xl px-3 gap-2">
              <button
                onClick={() => setShowStickers(!showStickers)}
                className={`p-2 transition-all hover:scale-110 ${showStickers ? "text-purple-400" : "text-white/40 hover:text-white/70"}`}
              >
                <span className="text-lg">😊</span>
              </button>
              <input
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/30"
                placeholder="Написать сообщение..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
                onFocus={() => setShowStickers(false)}
              />
              <button className="p-2 text-white/40 hover:text-white/70 transition-all hover:scale-110">
                <Icon name="Paperclip" size={18} />
              </button>
            </div>
          </div>
          {input.trim() ? (
            <button
              onClick={() => send(input)}
              className="w-12 h-12 grad-primary rounded-2xl flex items-center justify-center glow-purple hover:scale-105 transition-all flex-shrink-0"
            >
              <Icon name="Send" size={18} />
            </button>
          ) : (
            <button
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={sendVoice}
              onMouseLeave={() => isRecording && setIsRecording(false)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${isRecording ? "bg-pink-500 animate-record scale-110" : "grad-primary glow-purple hover:scale-105"}`}
            >
              <Icon name="Mic" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatsSection() {
  const [activeChat, setActiveChat] = useState<Chat>(CHATS[0]);
  const [search, setSearch] = useState("");
  const filtered = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-white/8 h-full">
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center glass rounded-xl px-3 gap-2">
            <Icon name="Search" size={14} className="text-white/30" />
            <input
              className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-white/30"
              placeholder="Поиск..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
          {filtered.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left glass-hover ${activeChat.id === chat.id ? "bg-purple-500/15 border border-purple-500/25" : ""}`}
            >
              <div className="relative">
                <AvatarCircle text={chat.avatar} size="md" />
                {chat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-white truncate">{chat.name}</span>
                    {chat.encrypted && <Icon name="Lock" size={10} className="text-emerald-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {chat.unread && (
                      <span className="w-5 h-5 grad-primary rounded-full flex items-center justify-center text-[10px] font-bold">{chat.unread}</span>
                    )}
                    <span className="text-[10px] text-white/30">{chat.time}</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 truncate mt-0.5">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 h-full overflow-hidden">
        <ChatWindow chat={activeChat} />
      </div>
    </div>
  );
}

function GroupsSection() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Группы</h2>
      <div className="grid grid-cols-2 gap-4">
        {GROUPS.map(g => (
          <div key={g.id} className="glass glass-hover rounded-2xl p-5 cursor-pointer animate-fade-slide">
            <div className="text-4xl mb-3">{g.avatar}</div>
            <h3 className="font-bold text-white mb-1">{g.name}</h3>
            <p className="text-xs text-white/40 mb-3">{g.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">{g.members} участников</span>
              <button className="px-3 py-1.5 grad-primary rounded-lg text-xs font-medium hover:scale-105 transition-all">Вступить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSection() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Новости</h2>
      <div className="flex flex-col gap-4 max-w-2xl">
        {NEWS.map((n, i) => (
          <div key={n.id} className="glass glass-hover rounded-2xl p-5 animate-fade-slide cursor-pointer" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 grad-fire rounded-full flex items-center justify-center text-xl">{n.avatar}</div>
              <div>
                <p className="font-semibold text-sm">{n.author}</p>
                <p className="text-xs text-white/30">{n.time}</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-4">{n.text}</p>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                <Icon name="Heart" size={13} /> {n.likes.toLocaleString()}
              </button>
              <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <Icon name="MessageCircle" size={13} /> Комментарии
              </button>
              <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                <Icon name="Share2" size={13} /> Поделиться
              </button>
              <span className="ml-auto flex items-center gap-1"><Icon name="Eye" size={13} /> {n.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoSection() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Видео</h2>
      <div className="grid grid-cols-2 gap-4">
        {VIDEOS.map((v, i) => (
          <div key={v.id} className="glass glass-hover rounded-2xl overflow-hidden cursor-pointer animate-fade-slide" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="h-36 grad-primary flex items-center justify-center text-6xl relative">
              {v.thumb}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-all">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Icon name="Play" size={24} />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-xs">{v.duration}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{v.title}</h3>
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{v.channel}</span>
                <span>{v.views} просмотров</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MusicSection() {
  const [playing, setPlaying] = useState<number | null>(1);
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Музыка</h2>

      {/* Now playing */}
      {playing !== null && (() => {
        const track = MUSIC.find(m => m.id === playing)!;
        return (
          <div className="glass rounded-2xl p-6 mb-6 glow-purple animate-fade-slide">
            <p className="text-xs text-white/40 mb-3 uppercase tracking-widest">Сейчас играет</p>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 grad-primary rounded-2xl flex items-center justify-center text-3xl animate-float">{track.cover}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">{track.title}</h3>
                <p className="text-white/50 text-sm">{track.artist}</p>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 grad-primary rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-white/40 hover:text-white transition-colors"><Icon name="SkipBack" size={20} /></button>
                <button onClick={() => setPlaying(null)} className="w-12 h-12 grad-primary rounded-full flex items-center justify-center hover:scale-105 transition-all">
                  <Icon name="Pause" size={20} />
                </button>
                <button className="text-white/40 hover:text-white transition-colors"><Icon name="SkipForward" size={20} /></button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col gap-2">
        {MUSIC.map((track, i) => (
          <button
            key={track.id}
            onClick={() => setPlaying(track.id)}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all text-left glass-hover animate-fade-slide ${playing === track.id ? "bg-purple-500/15 border border-purple-500/25" : ""}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${playing === track.id ? "grad-primary" : "glass"}`}>{track.cover}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{track.title}</p>
              <p className="text-xs text-white/40">{track.artist}</p>
            </div>
            {playing === track.id && <WaveAnimation />}
            <span className="text-xs text-white/30">{track.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CirclesSection() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Кружки</h2>

      {selected !== null && (() => {
        const c = CIRCLES.find(x => x.id === selected)!;
        return (
          <div className="mb-6 animate-fade-slide">
            <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="w-40 h-40 grad-primary rounded-full flex items-center justify-center text-6xl glow-purple animate-float">
                {c.thumb}
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{c.author}</p>
                <p className="text-white/40 text-sm">Видеосообщение</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 transition-all">Закрыть</button>
                <button className="px-4 py-2 grad-primary rounded-xl text-sm font-medium hover:scale-105 transition-all">Ответить</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex gap-4 flex-wrap">
        {CIRCLES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className="flex flex-col items-center gap-2 animate-fade-slide"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all hover:scale-105 ${c.seen ? "glass border-2 border-white/10" : "p-0.5 grad-primary glow-purple"}`}>
              {!c.seen ? (
                <div className="w-full h-full rounded-full glass flex items-center justify-center text-3xl">{c.thumb}</div>
              ) : c.thumb}
            </div>
            <span className="text-xs text-white/50">{c.author}</span>
            {!c.seen && <span className="w-2 h-2 rounded-full bg-purple-400 -mt-1" />}
          </button>
        ))}

        <button className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full glass border-2 border-dashed border-white/20 flex items-center justify-center text-2xl hover:border-purple-400 hover:text-purple-400 transition-all hover:scale-105">
            <Icon name="Plus" size={28} />
          </div>
          <span className="text-xs text-white/30">Записать</span>
        </button>
      </div>
    </div>
  );
}

function ContactsSection() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Контакты</h2>
      <div className="flex flex-col gap-2 max-w-md">
        {CONTACTS.map((c, i) => (
          <div key={c.id} className="flex items-center gap-4 p-3 glass glass-hover rounded-xl cursor-pointer animate-fade-slide" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="relative">
              <AvatarCircle text={c.avatar} />
              {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{c.name}</p>
              <p className={`text-xs ${c.online ? "text-emerald-400" : "text-white/30"}`}>{c.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white">
                <Icon name="MessageCircle" size={14} />
              </button>
              <button className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white">
                <Icon name="Phone" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Профиль</h2>
      <div className="max-w-sm">
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4 mb-4 animate-fade-slide">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 flex items-center justify-center text-3xl font-black text-white glow-purple animate-float">
            ВЫ
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">Ваш Профиль</h3>
            <p className="text-white/40 text-sm mt-1">@username</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs">
            <Icon name="Lock" size={11} /> E2E шифрование включено
          </div>
        </div>

        {[
          { icon: "Bell", label: "Уведомления" },
          { icon: "Lock", label: "Конфиденциальность" },
          { icon: "Shield", label: "Безопасность" },
          { icon: "Palette", label: "Оформление" },
          { icon: "HelpCircle", label: "Помощь" },
          { icon: "LogOut", label: "Выйти" },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-4 p-4 glass glass-hover rounded-xl mb-2 animate-fade-slide" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="w-9 h-9 grad-primary rounded-xl flex items-center justify-center">
              <Icon name={item.icon} size={16} />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
            <Icon name="ChevronRight" size={16} className="ml-auto text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [section, setSection] = useState<Section>("chats");

  const renderSection = () => {
    switch (section) {
      case "chats": return <ChatsSection />;
      case "groups": return <GroupsSection />;
      case "news": return <NewsSection />;
      case "video": return <VideoSection />;
      case "music": return <MusicSection />;
      case "circles": return <CirclesSection />;
      case "contacts": return <ContactsSection />;
      case "profile": return <ProfileSection />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08080f] relative">
      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #9b5de5, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00b4d8, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[30%] w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f72585, transparent 70%)" }} />
      </div>

      {/* Sidebar nav */}
      <nav className="w-16 flex-shrink-0 flex flex-col items-center py-4 gap-1 glass border-r border-white/8 relative z-10">
        <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center mb-4 glow-purple">
          <Icon name="Zap" size={18} />
        </div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            title={item.label}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative group ${
              section === item.key
                ? "grad-primary glow-purple scale-105"
                : "text-white/35 hover:text-white hover:bg-white/8"
            }`}
          >
            <Icon name={item.icon} size={19} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a2e] border border-white/10 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-hidden relative z-10" key={section}>
        {renderSection()}
      </main>
    </div>
  );
}
