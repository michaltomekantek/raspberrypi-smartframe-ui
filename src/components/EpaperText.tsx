import React, { useState } from 'react';
import { Type, Send, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Heading } from 'lucide-react';
import toast from 'react-hot-toast';

interface EpaperTextProps {
  apiUrl: string;
}

const EpaperText = ({ apiUrl }: EpaperTextProps) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [debugData, setDebugData] = useState<{
    status: string | number;
    rawResponse: string;
    isError: boolean;
  } | null>(null);

  const handleSendText = async () => {
    if (!text.trim()) {
      toast.error("Wpisz tekst przed wysłaniem");
      return;
    }

    setLoading(true);
    setDebugData(null);
    
    try {
      const url = new URL(apiUrl);
      url.searchParams.append('text', text);
      if (title.trim()) {
        url.searchParams.append('title', title);
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 
          'accept': 'application/json'
        },
        body: ''
      });

      const responseText = await response.text();
      const isOk = response.ok;
      
      setDebugData({
        status: response.status,
        rawResponse: responseText,
        isError: !isOk
      });

      if (isOk) {
        toast.success("Tekst wysłany na E-Papier!");
        setText('');
        setTitle('');
      } else if (response.status === 429) {
        toast.error("Ramka musi się przeładować. Spróbuj ponownie za chwilę.");
        setShowLogs(true);
      } else {
        toast.error(`Błąd: ${response.status}`);
        setShowLogs(true);
      }
    } catch (error: any) {
      setDebugData({
        status: 'BŁĄD',
        rawResponse: error.message || "Błąd połączenia.",
        isError: true
      });
      setShowLogs(true);
      toast.error('Błąd połączenia z API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-zinc-400">
            <Type size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Wyślij Tekst na Ekran</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Heading size={10} /> Tytuł (Opcjonalnie)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nagłówek wiadomości..."
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Type size={10} /> Treść Wiadomości
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Wpisz treść..."
                className="w-full h-32 bg-black/40 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSendText}
            disabled={loading || !text.trim()}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${loading || !text.trim() ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-black hover:bg-white shadow-lg shadow-white/5'}`}
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
            WYŚLIJ NA E-PAPIER
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">UWAGA</p>
            <p className="text-blue-400 font-medium">Odświeżam ekran ramki...</p>
          </div>
        </div>
      )}

      {debugData && (
        <div className={`rounded-xl border overflow-hidden transition-all ${debugData.isError ? 'border-red-900/50 bg-red-950/10' : 'border-emerald-900/50 bg-emerald-950/10'}`}>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              {debugData.isError ? <AlertCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
              <span className={debugData.isError ? 'text-red-400' : 'text-emerald-400'}>
                Status: {debugData.status} {debugData.status === 429 && "(RAMKA ZAJĘTA)"}
              </span>
            </div>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLogs && (
            <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all">
                  {debugData.status === 429 ? "Serwer zwrócił błąd 429: Ramka jest obecnie w trakcie odświeżania ekranu. Poczekaj około 30-60 sekund przed kolejną próbą." : (debugData.rawResponse || "(Brak treści)")}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpaperText;