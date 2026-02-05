import React, { useState } from 'react';
import { Play, Square, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SlideshowControlsProps {
  startUrl: string;
  stopUrl: string;
}

const SlideshowControls = ({ startUrl, stopUrl }: SlideshowControlsProps) => {
  const [loading, setLoading] = useState<'start' | 'stop' | null>(null);

  const handleAction = async (type: 'start' | 'stop') => {
    setLoading(type);
    const url = type === 'start' ? startUrl : stopUrl;
    const method = type === 'stop' ? 'GET' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'accept': 'application/json' },
        ...(method === 'POST' ? { body: '' } : {})
      });

      if (response.ok) {
        toast.success(type === 'start' ? "Pokaz slajdów uruchomiony" : "Pokaz slajdów zatrzymany");
      } else {
        toast.error(`Błąd: ${response.status}`);
      }
    } catch (error) {
      toast.error("Błąd połączenia z ramką");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-xl grid grid-cols-2 gap-3 mb-6">
      <button
        onClick={() => handleAction('start')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20"
      >
        {loading === 'start' ? <RefreshCw size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
        START
      </button>
      
      <button
        onClick={() => handleAction('stop')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20"
      >
        {loading === 'stop' ? <RefreshCw size={20} className="animate-spin" /> : <Square size={20} fill="currentColor" />}
        STOP
      </button>
    </div>
  );
};

export default SlideshowControls;