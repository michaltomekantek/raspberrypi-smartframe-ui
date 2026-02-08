import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Image as ImageIcon, Info, BarChart3, Library, Monitor, Tablet, Settings as SettingsIcon, Globe } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';
import DeviceInfo from './components/DeviceInfo';
import ShowStats from './components/ShowStats';
import GlobalIpSettings from './components/GlobalIpSettings';
import ImageList from './components/ImageList';
import SlideshowControls from './components/SlideshowControls';

function App() {
  const [activeDevice, setActiveDevice] = useState<'ips' | 'epaper' | 'settings'>('ips');
  const [activeTab, setActiveTab] = useState<'upload' | 'info' | 'stats' | 'images'>('upload');
  const [epaperTab, setEpaperTab] = useState<'upload' | 'images'>('upload');
  const [settingsTab, setSettingsTab] = useState<'ips' | 'epaper'>('ips');
  
  const [globalIp, setGlobalIp] = useState(() => {
    return localStorage.getItem('smartframe_global_ip') || 'localhost';
  });

  const [uploadUrl, setUploadUrl] = useState(() => {
    return localStorage.getItem('smartframe_upload_url') || 'http://localhost:8000/upload';
  });
  
  const [infoUrl, setInfoUrl] = useState(() => {
    return localStorage.getItem('smartframe_info_url') || 'http://localhost:8000/system-info';
  });

  const [statsUrl, setStatsUrl] = useState(() => {
    return localStorage.getItem('smartframe_stats_url') || 'http://localhost:8000/show-stats';
  });

  const [imagesUrl, setImagesUrl] = useState(() => {
    return localStorage.getItem('smartframe_images_url') || 'http://localhost:8000/images';
  });

  const [intervalUrl, setIntervalUrl] = useState(() => {
    return localStorage.getItem('smartframe_interval_url') || 'http://localhost:8000/settings/interval';
  });

  const [startUrl, setStartUrl] = useState(() => {
    return localStorage.getItem('smartframe_start_url') || 'http://localhost:8000/start-slideshow';
  });

  const [stopUrl, setStopUrl] = useState(() => {
    return localStorage.getItem('smartframe_stop_url') || 'http://localhost:8000/stop-all';
  });

  const replaceHost = (url: string, newHost: string) => {
    try {
      const urlObj = new URL(url);
      urlObj.hostname = newHost;
      return urlObj.toString();
    } catch (e) {
      return url.replace(/(https?:\/\/)[^/:]+/, `$1${newHost}`);
    }
  };

  const handleGlobalIpApply = (newIp: string) => {
    setGlobalIp(newIp);
    setUploadUrl(prev => replaceHost(prev, newIp));
    setInfoUrl(prev => replaceHost(prev, newIp));
    setStatsUrl(prev => replaceHost(prev, newIp));
    setImagesUrl(prev => replaceHost(prev, newIp));
    setIntervalUrl(prev => replaceHost(prev, newIp));
    setStartUrl(prev => replaceHost(prev, newIp));
    setStopUrl(prev => replaceHost(prev, newIp));
    
    toast.success(`Zaktualizowano wszystkie adresy na: ${newIp}`);
  };

  useEffect(() => {
    localStorage.setItem('smartframe_global_ip', globalIp);
  }, [globalIp]);

  useEffect(() => {
    localStorage.setItem('smartframe_upload_url', uploadUrl);
    localStorage.setItem('smartframe_info_url', infoUrl);
    localStorage.setItem('smartframe_stats_url', statsUrl);
    localStorage.setItem('smartframe_images_url', imagesUrl);
    localStorage.setItem('smartframe_interval_url', intervalUrl);
    localStorage.setItem('smartframe_start_url', startUrl);
    localStorage.setItem('smartframe_stop_url', stopUrl);
  }, [uploadUrl, infoUrl, statsUrl, imagesUrl, intervalUrl, startUrl, stopUrl]);

  const getBaseUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      return 'http://localhost:8000';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 pt-8">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Smart Frame Hub</h1>
        <p className="text-zinc-500 text-sm">Centrum zarządzania Twoimi ramkami</p>
      </div>

      {/* Main Device Switcher */}
      <div className="w-full max-w-xl flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveDevice('ips')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap
            ${activeDevice === 'ips' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Monitor size={16} />
          RAMKA IPS
        </button>
        <button
          onClick={() => setActiveDevice('epaper')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap
            ${activeDevice === 'epaper' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Tablet size={16} />
          RAMKA E-PAPIER
        </button>
        <button
          onClick={() => setActiveDevice('settings')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap
            ${activeDevice === 'settings' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <SettingsIcon size={16} />
          USTAWIENIA
        </button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        {activeDevice === 'ips' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SlideshowControls startUrl={startUrl} stopUrl={stopUrl} />

            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-full mb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ImageIcon size={16} />
                Wgraj
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === 'images' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Library size={16} />
                Zdjęcia
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === 'info' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Info size={16} />
                Info
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === 'stats' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <BarChart3 size={16} />
                Stats
              </button>
            </div>

            {activeTab === 'upload' && <ImageUpload apiUrl={uploadUrl} />}
            {activeTab === 'images' && <ImageList apiUrl={imagesUrl} baseUrl={getBaseUrl(imagesUrl)} />}
            {activeTab === 'info' && <DeviceInfo apiUrl={infoUrl} />}
            {activeTab === 'stats' && <ShowStats apiUrl={statsUrl} />}
          </div>
        )}

        {activeDevice === 'epaper' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-full mb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setEpaperTab('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${epaperTab === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ImageIcon size={16} />
                Wgraj
              </button>
              <button
                onClick={() => setEpaperTab('images')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${epaperTab === 'images' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Library size={16} />
                Zdjęcia
              </button>
            </div>

            <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-600">
              <Tablet size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-zinc-400">
                {epaperTab === 'upload' ? 'Wgrywanie na E-Papier' : 'Biblioteka E-Papier'}
              </h2>
              <p className="text-sm mt-2">Funkcjonalność w przygotowaniu...</p>
            </div>
          </div>
        )}

        {activeDevice === 'settings' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-full mb-8">
              <div className="flex items-center gap-2 px-2 mb-4 text-zinc-400">
                <Globe size={16} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Konfiguracja Globalna</h2>
              </div>
              <GlobalIpSettings globalIp={globalIp} onIpChange={handleGlobalIpApply} />
            </div>

            <div className="w-full">
              <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 mb-6">
                <button
                  onClick={() => setSettingsTab('ips')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all
                    ${settingsTab === 'ips' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  RAMKA IPS
                </button>
                <button
                  onClick={() => setSettingsTab('epaper')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all
                    ${settingsTab === 'epaper' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  RAMKA E-PAPIER
                </button>
              </div>

              {settingsTab === 'ips' ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <EndpointSettings label="Upload (POST)" apiUrl={uploadUrl} onUrlChange={setUploadUrl} />
                  <EndpointSettings label="Lista Zdjęć (GET/PATCH/DELETE)" apiUrl={imagesUrl} onUrlChange={setImagesUrl} />
                  <EndpointSettings label="System Info (GET)" apiUrl={infoUrl} onUrlChange={setInfoUrl} />
                  <EndpointSettings label="Statystyki (GET)" apiUrl={statsUrl} onUrlChange={setStatsUrl} />
                  <EndpointSettings label="Start Pokazu (GET)" apiUrl={startUrl} onUrlChange={setStartUrl} />
                  <EndpointSettings label="Stop Pokazu (GET)" apiUrl={stopUrl} onUrlChange={setStopUrl} />
                </div>
              ) : (
                <div className="p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3 animate-in fade-in duration-200">
                  <Tablet size={32} className="opacity-20" />
                  <p className="text-xs uppercase tracking-widest">Brak endpointów dla E-Papieru</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto py-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        Raspberry Pi Smart Frame Hub
      </div>
    </div>
  );
}

export default App;