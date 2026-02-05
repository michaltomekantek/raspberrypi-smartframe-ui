import React from 'react';
import { Monitor, Globe } from 'lucide-react';

interface GlobalIpSettingsProps {
  globalIp: string;
  onIpChange: (newIp: string) => void;
}

const GlobalIpSettings = ({ globalIp, onIpChange }: GlobalIpSettingsProps) => {
  return (
    <div className="w-full max-w-xl mb-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-2 text-blue-400">
        <Monitor size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">Adres IP Urządzenia (Globalny)</span>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
          <Globe size={16} />
        </div>
        <input
          type="text"
          value={globalIp}
          onChange={(e) => onIpChange(e.target.value)}
          placeholder="np. 192.168.0.100"
          className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors text-white"
        />
      </div>
      <p className="text-[10px] text-zinc-500 italic">
        Wszystkie wystąpienia "localhost" w zakładkach zostaną zastąpione tym adresem.
      </p>
    </div>
  );
};

export default GlobalIpSettings;