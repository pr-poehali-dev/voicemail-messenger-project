import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AvatarCircle } from "./ChatSection";
import { GROUPS, NEWS, VIDEOS, MUSIC, CIRCLES, CONTACTS } from "./types-data";

function WaveAnimation() {
  return (
    <span className="flex items-end gap-[2px] h-4">
      {[1,2,3,4,5].map(i => <span key={i} className="wave-bar h-3 bg-white/80" style={{ animationDelay: `${(i-1)*0.15}s` }} />)}
    </span>
  );
}

export function GroupsSection() {
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

export function NewsSection() {
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

export function VideoSection() {
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

export function MusicSection() {
  const [playing, setPlaying] = useState<number | null>(1);
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold grad-text mb-6">Музыка</h2>

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

export function CirclesSection() {
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

export function ContactsSection() {
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

export function ProfileSection() {
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
