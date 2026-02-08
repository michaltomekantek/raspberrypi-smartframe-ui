import React, { useState } from 'react';
import { Power, RotateCw, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SystemControlsProps {
  shutdownUrl: string;
  rebootUrl: string;
}

const SystemControls = ({ shutdownUrl, rebootUrl }: SystemControlsProps) => {
  const [loading, setLoading] = useState<'shutdown' | 'reboot' | null>(null);

  const handleAction = async (type: 'shutdown' | 'reboot') => {
    const confirmMsg = type === 'shutdown' 
      ? "Czy na pewno chcesz WYŁĄCZYĆ urządzenie? Będziesz musiał je uruchomić ręcznie." 
      : "Czy na pewno chcesz ZRESTARTOWAĆ urządzenie?";
    
    if (!confirm(confirmMsg)) return;

    setLoading(type);
    const url = type === 'shutdown' ? shutdownUrl : rebootUrl;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'accept': 'application/json' },
        body: ''
      });

      if (response.ok) {
        toast.success(type === 'shutdown' ? "Zlecono wyłączenie systemu..." : "Zlecono restart systemu...");
      } else {
        toast.error(`Błąd: ${response.status}`);
      }
    } catch (error) {
      toast.error("Błąd połączenia z API systemu");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-2xl flex flex-col gap-6">
        <div className="flex items-center gap-3 text-red-500">
          <AlertTriangle size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Strefa Niebezpieczna</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleAction('reboot')}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700 disabled:opacity-50"
          >
            {loading === 'reboot' ? <RefreshCw size={20} className="animate-spin" /> : <RotateCw size={20} />}
            RESTART SYSTEMU
          </button>

          <button
            onClick={() => handleAction('shutdown')}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            {loading === 'shutdown' ? <RefreshCw size={20} className="animate-spin" /> : <Power size={20} />}
            WYŁĄCZ URZĄDZENIE
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 text-center italic">
          Uwaga: Wyłączenie urządzenia spowoduje utratę połączenia z tym panelem.
        </p>
      </div>
    </div>
  );
};

export default SystemControls;