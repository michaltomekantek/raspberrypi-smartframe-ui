import React, { useState } from 'react';
import { Cpu, HardDrive, Network, Activity, Clock, Thermometer, RefreshCw, AlertCircle, Database } from 'lucide-react';

interface SystemInfo {
  time: string;
  date: string;
  cpu: number;
  temp: string | number;
  ram: number;
  storage: number;
  ip: string;
}

interface DeviceInfoProps {
  apiUrl: string;
}

const DeviceInfo = ({ apiUrl }: DeviceInfoProps) => {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Błąd serwera: ${response.status}`);
      
      const data = await response.json();
      setInfo(data);
    } catch (err: any) {
      setError(err.message || 'Błąd połączenia z API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <button
        onClick={fetchInfo}
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/20 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
      >
        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        {loading ? 'POBIERANIE...' : 'POBIERZ DANE SYSTEMOWE'}
      </button>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          <div className="flex flex-col">
            <span className="font-bold">Błąd pobierania</span>
            <span className="text-xs opacity-80">{error}</span>
          </div>
        </div>
      )}

      {!info && !loading && !error && (
        <div className="p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3">
          <Database size={32} className="opacity-20" />
          <p className="text-xs uppercase tracking-widest">Kliknij przycisk powyżej</p>
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Cpu size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Procesor</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.cpu}%</div>
              <div className="text-xs text-zinc-500 flex items-center gap-1">
                <Thermometer size={12} /> {info.temp}{typeof info.temp === 'number' ? '°C' : ''}
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${info.cpu}%` }} />
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Pamięć RAM</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.ram}%</div>
              <div className="text-xs text-zinc-500">Użycie systemowe</div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${info.ram}%` }} />
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <HardDrive size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Dysk</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.storage}%</div>
              <div className="text-xs text-zinc-500">Zajęte miejsce</div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${info.storage}%` }} />
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Network size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Sieć</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-mono text-zinc-300">{info.ip}</div>
              <div className="text-[10px] text-zinc-500 truncate">Adres urządzenia</div>
            </div>
          </div>

          <div className="md:col-span-2 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              CZAS SYSTEMOWY
            </div>
            <div>
              {info.date} {info.time}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceInfo;