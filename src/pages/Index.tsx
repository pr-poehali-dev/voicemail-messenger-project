import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Section, NAV_ITEMS } from "./messenger/types-data";
import ChatsSection from "./messenger/ChatSection";
import { GroupsSection, NewsSection, VideoSection, MusicSection, CirclesSection, ContactsSection, ProfileSection } from "./messenger/ContentSections";

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
        <div className="flex flex-col items-center mb-4 gap-1">
          <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center glow-purple">
            <Icon name="Zap" size={18} />
          </div>
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">Axel</span>
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