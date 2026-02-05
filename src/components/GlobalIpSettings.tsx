import React, { useState, useEffect } from 'react';
import { Monitor, Globe, Save } from 'lucide-react';

interface GlobalIpSettingsProps {
  globalIp: string;
  onIpChange: (newIp: string) => void;
}

const GlobalIpSettings = ({ globalIp, onIpChange }: GlobalIpSettingsProps) => {
  const [tempIp, setTempIp] = useState(globalIp);

  // Synchronizuj lokalny stan, gdy globalny zmieni się z zewnątrz (np. przy ładowaniu)
  useEffect(() => {
    setTempIp(globalIp);
  }, [globalIp]);

  const handleApply = () => {
    onIpChange(tempIp);
  };

  return (
    <div className="w-full max-w-xl mb-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-2 text-blue-400">
        <Monitor size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">Adres IP Urządzenia (Globalny)</span>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
            <Globe size={16} />
          </div>
          <input
            type="text"
            value={tempIp}
            onChange={(e) => setTempIp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="np. 192.168.0.100"
            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors text-white"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
        >
          <Save size={16} />
          ZASTOSUJ
        </button>
      </div>
      <p className="text-[10px] text-zinc-500 italic">
        Wpisz IP i kliknij ZASTOSUJ, aby podmienić hosta we wszystkich zakładkach.
      </p>
    </div>
  );
};

export default GlobalIpSettings;