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
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Background image */}
      <div className="fixed inset-0 pointer-events-none">
        <img src="https://cdn.poehali.dev/projects/9f15938f-537d-478d-9e92-06c9df5002ea/bucket/cf68fe8d-e785-4310-b9ce-e2896d12409a.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Sidebar nav */}
      <nav className="w-16 flex-shrink-0 flex flex-col items-center py-4 gap-1 glass border-r border-white/8 relative z-10">
        <div className="flex flex-col items-center mb-4 gap-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden glow-purple">
            <img src="https://cdn.poehali.dev/projects/9f15938f-537d-478d-9e92-06c9df5002ea/bucket/9811258a-d1ad-4cc9-bb44-6a60ac11d7d5.jpg" alt="Axel" className="w-full h-full object-cover" />
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