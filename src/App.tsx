import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Image as ImageIcon, Info, BarChart3 } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';
import DeviceInfo from './components/DeviceInfo';
import ShowStats from './components/ShowStats';
import GlobalIpSettings from './components/GlobalIpSettings';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'info' | 'stats'>('upload');
  
  // Globalne IP
  const [globalIp, setGlobalIp] = useState(() => {
    return localStorage.getItem('smartframe_global_ip') || 'localhost';
  });

  // Niezależne stany dla wszystkich adresów (przechowują surowe stringi, np. z localhost)
  const [uploadUrl, setUploadUrl] = useState(() => {
    return localStorage.getItem('smartframe_upload_url') || 'http://localhost:8000/upload';
  });
  
  const [infoUrl, setInfoUrl] = useState(() => {
    return localStorage.getItem('smartframe_info_url') || 'http://localhost:8000/system-info';
  });

  const [statsUrl, setStatsUrl] = useState(() => {
    return localStorage.getItem('smartframe_stats_url') || 'http://localhost:8000/show-stats';
  });

  // Funkcja pomocnicza do podmieniania localhost na globalne IP
  const resolveUrl = (url: string) => {
    if (!globalIp) return url;
    return url.replace(/localhost|127\.0\.0\.1/g, globalIp);
  };

  // Zapisywanie zmian w localStorage
  useEffect(() => {
    localStorage.setItem('smartframe_global_ip', globalIp);
  }, [globalIp]);

  useEffect(() => {
    localStorage.setItem('smartframe_upload_url', uploadUrl);
  }, [uploadUrl]);

  useEffect(() => {
    localStorage.setItem('smartframe_info_url', infoUrl);
  }, [infoUrl]);

  useEffect(() => {
    localStorage.setItem('smartframe_stats_url', statsUrl);
  }, [statsUrl]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 pt-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Zarządzaj swoją ramką Raspberry Pi</p>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-2">
        {/* Globalne ustawienie IP */}
        <GlobalIpSettings globalIp={globalIp} onIpChange={setGlobalIp} />

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-full mb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <ImageIcon size={16} />
            Wgraj zdjęcie
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'info' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Info size={16} />
            Device Info
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'stats' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <BarChart3 size={16} />
            Show Stats
          </button>
        </div>

        {/* Treść zakładki - przekazujemy rozwiązany URL do komponentów wykonawczych */}
        {activeTab === 'upload' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings apiUrl={uploadUrl} onUrlChange={setUploadUrl} />
            <div className="text-[10px] font-mono text-zinc-600 px-4 -mt-2">
              Aktywny endpoint: {resolveUrl(uploadUrl)}
            </div>
            <ImageUpload apiUrl={resolveUrl(uploadUrl)} />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings apiUrl={infoUrl} onUrlChange={setInfoUrl} />
            <div className="text-[10px] font-mono text-zinc-600 px-4 -mt-2">
              Aktywny endpoint: {resolveUrl(infoUrl)}
            </div>
            <DeviceInfo apiUrl={resolveUrl(infoUrl)} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings apiUrl={statsUrl} onUrlChange={setStatsUrl} />
            <div className="text-[10px] font-mono text-zinc-600 px-4 -mt-2">
              Aktywny endpoint: {resolveUrl(statsUrl)}
            </div>
            <ShowStats apiUrl={resolveUrl(statsUrl)} />
          </div>
        )}
      </div>
      
      <div className="mt-auto py-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        Raspberry Pi Smart Frame UI
      </div>
    </div>
  );
}

export default App;