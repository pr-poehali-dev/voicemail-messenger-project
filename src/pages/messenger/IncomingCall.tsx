import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import { playNokiaTune, stopNokiaTune } from "./useNokiaSound";
import { playMissedCallSound } from "./useIcqSound";

interface Props {
  name: string;
  avatar: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCall({ name, avatar, onAccept, onDecline }: Props) {
  useEffect(() => {
    playNokiaTune();
    return () => stopNokiaTune();
  }, []);

  const accept = () => { stopNokiaTune(); onAccept(); };
  const decline = () => { stopNokiaTune(); playMissedCallSound(); onDecline(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={decline} />

      <div className="relative flex flex-col items-center gap-6 p-10 rounded-3xl glass border border-white/10 animate-fade-slide w-80">
        {/* Pulse rings */}
        <div className="relative flex items-center justify-center">
          <span className="absolute w-32 h-32 rounded-full border-2 border-purple-400/30 animate-ping" />
          <span className="absolute w-24 h-24 rounded-full border-2 border-purple-400/20 animate-ping" style={{ animationDelay: "0.3s" }} />
          <div className="w-20 h-20 rounded-full grad-primary flex items-center justify-center text-3xl font-bold glow-purple z-10">
            {avatar}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Входящий звонок</p>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
        </div>

        <div className="flex items-center gap-8 mt-2">
          {/* Decline */}
          <button
            onClick={decline}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30"
          >
            <Icon name="PhoneOff" size={26} />
          </button>

          {/* Accept */}
          <button
            onClick={accept}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-emerald-500/30"
          >
            <Icon name="Phone" size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}