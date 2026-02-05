import React, { useState } from 'react';
import { BarChart3, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShowStatsProps {
  apiUrl: string;
}

const ShowStats = ({ apiUrl }: ShowStatsProps) => {
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [debugData, setDebugData] = useState<{
    status: string | number;
    rawResponse: string;
    isError: boolean;
  } | null>(null);

  const handleFetchStats = async () => {
    setLoading(true);
    setDebugData(null);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
      const text = await response.text();
      const isOk = response.ok;
      
      setDebugData({
        status: response.status,
        rawResponse: text,
        isError: !isOk
      });

      if (isOk) {
        toast.success("Statystyki pobrane pomyślnie!");
      } else {
        toast.error(`Błąd: ${response.status}`);
        setShowLogs(true);
      }
    } catch (error: any) {
      setDebugData({
        status: 'BŁĄD',
        rawResponse: error.message || "Błąd połączenia z API.",
        isError: true
      });
      setShowLogs(true);
      toast.error('Błąd połączenia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500">
            <BarChart3 size={32} />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-bold">Statystyki Wyświetlania</h3>
            <p className="text-sm text-zinc-500 mt-1">Pobierz aktualne statystyki z ramki</p>
          </div>

          <button
            onClick={handleFetchStats}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : "POBIERZ STATYSTYKI"}
          </button>
        </div>
      </div>

      {debugData && (
        <div className={`rounded-xl border overflow-hidden transition-all ${debugData.isError ? 'border-red-900/50 bg-red-950/10' : 'border-emerald-900/50 bg-emerald-950/10'}`}>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              {debugData.isError ? <AlertCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
              <span className={debugData.isError ? 'text-red-400' : 'text-emerald-400'}>
                Status: {debugData.status}
              </span>
            </div>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLogs && (
            <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                <p className="mb-2 text-zinc-500">// Odpowiedź serwera:</p>
                <pre className="whitespace-pre-wrap break-all">
                  {debugData.rawResponse || "(Brak treści)"}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowStats;