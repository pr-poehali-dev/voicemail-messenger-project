import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Chat, Message, CHATS, INITIAL_MESSAGES, STICKER_PACKS } from "./types-data";

const KB_RU = [
  ["й","ц","у","к","е","н","г","ш","щ","з","х","ъ"],
  ["ф","ы","в","а","п","р","о","л","д","ж","э"],
  ["я","ч","с","м","и","т","ь","б","ю","."],
];
const KB_EN = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m",",","."],
];
const KB_SYM = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["@","#","$","%","&","*","(",")","-","+"],
  ["!","?","/","\\","_","=","'",'"',";",":"],
];

export function AvatarCircle({ text, size = "md", gradient = "primary" }: { text: string; size?: "sm" | "md" | "lg"; gradient?: "primary" | "fire" | "ice" }) {
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

function VirtualKeyboard({ onKey, onBackspace, onSpace, onEnter }: {
  onKey: (k: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
}) {
  const [lang, setLang] = useState<"ru" | "en" | "sym">("ru");
  const [caps, setCaps] = useState(false);

  const layout = lang === "ru" ? KB_RU : lang === "en" ? KB_EN : KB_SYM;

  const handleKey = (k: string) => {
    onKey(caps && lang !== "sym" ? k.toUpperCase() : k);
  };

  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[420px] glass rounded-2xl overflow-hidden shadow-2xl glow-purple animate-fade-slide z-50 p-3 select-none">
      <div className="flex gap-1.5 mb-2.5 justify-center">
        {(["ru","en","sym"] as const).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === l ? "grad-primary" : "glass text-white/50 hover:text-white"}`}
          >
            {l === "ru" ? "РУС" : l === "en" ? "ENG" : "#@!"}
          </button>
        ))}
      </div>

      {layout.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1 mb-1">
          {ri === layout.length - 1 && lang !== "sym" && (
            <button
              onClick={() => setCaps(!caps)}
              className={`px-2 py-2 rounded-lg text-xs font-bold transition-all min-w-[40px] ${caps ? "grad-primary" : "glass text-white/50 hover:text-white"}`}
            >
              <Icon name="ArrowBigUp" size={14} />
            </button>
          )}
          {row.map((k) => (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className="w-9 h-9 glass glass-hover rounded-lg text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              {caps && lang !== "sym" ? k.toUpperCase() : k}
            </button>
          ))}
          {ri === layout.length - 1 && (
            <button
              onClick={onBackspace}
              className="px-2 py-2 glass glass-hover rounded-lg text-white/60 hover:text-white transition-all min-w-[40px] flex items-center justify-center"
            >
              <Icon name="Delete" size={14} />
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-1.5 mt-1 justify-center">
        <button
          onClick={onSpace}
          className="flex-1 max-w-[220px] h-9 glass glass-hover rounded-lg text-xs text-white/50 hover:text-white transition-all"
        >
          Пробел
        </button>
        <button
          onClick={onEnter}
          className="px-4 h-9 grad-primary rounded-lg text-xs font-bold hover:scale-105 transition-all"
        >
          Отправить
        </button>
      </div>
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
  const [showKeyboard, setShowKeyboard] = useState(false);
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
            {showKeyboard && !showStickers && (
              <VirtualKeyboard
                onKey={k => setInput(prev => prev + k)}
                onBackspace={() => setInput(prev => prev.slice(0, -1))}
                onSpace={() => setInput(prev => prev + " ")}
                onEnter={() => send(input)}
              />
            )}
            <div className="flex items-center glass rounded-2xl px-3 gap-2">
              <button
                onClick={() => { setShowStickers(!showStickers); setShowKeyboard(false); }}
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
                onFocus={() => { setShowStickers(false); setShowKeyboard(false); }}
              />
              <button
                onClick={() => { setShowKeyboard(!showKeyboard); setShowStickers(false); }}
                className={`p-2 transition-all hover:scale-110 ${showKeyboard ? "text-purple-400" : "text-white/40 hover:text-white/70"}`}
                title="Экранная клавиатура"
              >
                <Icon name="Keyboard" size={18} />
              </button>
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

export default function ChatsSection() {
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
