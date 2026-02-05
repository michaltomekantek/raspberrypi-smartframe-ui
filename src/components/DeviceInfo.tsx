import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Network, Activity, Clock, Thermometer, RefreshCw, AlertCircle } from 'lucide-react';

interface SystemInfo {
  timestamp: string;
  device_time: string;
  device_date: string;
  uptime_hours: number;
  network: { ip_address: string; hostname: string };
  cpu: { usage_percent: number; temperature_c: number | null; cores: number };
  memory: { total_gb: number; used_gb: number; free_gb: number; percent_used: number };
  storage: { total_gb: number; free_gb: number; percent_used: number };
  platform: { system: string; mode: string };
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
      // Obsługa różnych formatów URL (z /upload lub bez)
      const baseUrl = apiUrl.endsWith('/upload') ? apiUrl.replace('/upload', '') : apiUrl;
      const infoUrl = `${baseUrl.replace(/\/$/, '')}/system-info`;
      
      const response = await fetch(infoUrl);
      if (!response.ok) throw new Error(`Błąd: ${response.status}`);
      const data = await response.json();
      setInfo(data);
    } catch (err: any) {
      setError(err.message || 'Błąd połączenia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [apiUrl]);

  return (
    <div className="w-full flex flex-col gap-4">
      <button
        onClick={fetchInfo}
        disabled={loading}
        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Pobieranie...' : 'Odśwież dane'}
      </button>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPU */}
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Cpu size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Procesor</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.cpu.usage_percent}%</div>
              <div className="text-xs text-zinc-500 flex items-center gap-1">
                <Thermometer size={12} /> {info.cpu.temperature_c ? `${info.cpu.temperature_c}°C` : 'N/A'}
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${info.cpu.usage_percent}%` }} />
            </div>
          </div>

          {/* RAM */}
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Pamięć RAM</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.memory.percent_used}%</div>
              <div className="text-xs text-zinc-500">{info.memory.used_gb} / {info.memory.total_gb} GB</div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${info.memory.percent_used}%` }} />
            </div>
          </div>

          {/* Storage */}
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <HardDrive size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Dysk</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">{info.storage.percent_used}%</div>
              <div className="text-xs text-zinc-500">{info.storage.free_gb} GB wolne</div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${info.storage.percent_used}%` }} />
            </div>
          </div>

          {/* Network */}
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 mb-3">
              <Network size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Sieć</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-mono text-zinc-300">{info.network.ip_address}</div>
              <div className="text-[10px] text-zinc-500 truncate">{info.network.hostname}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="md:col-span-2 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Clock size={12} />
              UPTIME: {info.uptime_hours.toFixed(1)}h
            </div>
            <div>
              {info.device_date} {info.device_time}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceInfo;