import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Image as ImageIcon, Info, BarChart3, Library } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';
import DeviceInfo from './components/DeviceInfo';
import ShowStats from './components/ShowStats';
import GlobalIpSettings from './components/GlobalIpSettings';
import ImageList from './components/ImageList';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'info' | 'stats' | 'images'>('upload');
  
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

  // Funkcja podmieniająca hosta w dowolnym URL
  const replaceHost = (url: string, newHost: string) => {
    try {
      const urlObj = new URL(url);
      urlObj.hostname = newHost;
      return urlObj.toString();
    } catch (e) {
      return url.replace(/(https?:\/\/)[^/:]+/, `$1${newHost}`);
    }
  };

  // Funkcja wywoływana po kliknięciu ZASTOSUJ w GlobalIpSettings
  const handleGlobalIpApply = (newIp: string) => {
    setGlobalIp(newIp);
    
    setUploadUrl(prev => replaceHost(prev, newIp));
    setInfoUrl(prev => replaceHost(prev, newIp));
    setStatsUrl(prev => replaceHost(prev, newIp));
    setImagesUrl(prev => replaceHost(prev, newIp));
    setIntervalUrl(prev => replaceHost(prev, newIp));
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
  }, [uploadUrl, infoUrl, statsUrl, imagesUrl, intervalUrl]);

  // Wyciągnięcie bazowego adresu URL (np. http://localhost:8000)
  const getBaseUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      return 'http://localhost:8000';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 pt-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Zarządzaj swoją ramką Raspberry Pi</p>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-2">
        <GlobalIpSettings globalIp={globalIp} onIpChange={handleGlobalIpApply} />

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
            Images
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

        {activeTab === 'upload' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings label="Upload Endpoint" apiUrl={uploadUrl} onUrlChange={setUploadUrl} />
            <ImageUpload apiUrl={uploadUrl} />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="w-full flex flex-col gap-2 animate-in fade-in duration-300">
            <EndpointSettings label="List Images" apiUrl={imagesUrl} onUrlChange={setImagesUrl} />
            <EndpointSettings label="Set Interval" apiUrl={intervalUrl} onUrlChange={setIntervalUrl} />
            <EndpointSettings label="Patch Status (Base)" apiUrl={`${getBaseUrl(imagesUrl)}/images`} onUrlChange={() => {}} />
            <div className="mt-4">
              <ImageList apiUrl={imagesUrl} baseUrl={getBaseUrl(imagesUrl)} />
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings label="System Info Endpoint" apiUrl={infoUrl} onUrlChange={setInfoUrl} />
            <DeviceInfo apiUrl={infoUrl} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <EndpointSettings label="Show Stats Endpoint" apiUrl={statsUrl} onUrlChange={setStatsUrl} />
            <ShowStats apiUrl={statsUrl} />
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