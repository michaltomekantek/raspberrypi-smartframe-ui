import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Image as ImageIcon, Info } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';
import DeviceInfo from './components/DeviceInfo';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'info'>('upload');
  
  // Niezależne stany dla obu adresów
  const [uploadUrl, setUploadUrl] = useState(() => {
    return localStorage.getItem('smartframe_upload_url') || 'http://192.168.0.194:8000/upload';
  });
  
  const [infoUrl, setInfoUrl] = useState(() => {
    return localStorage.getItem('smartframe_info_url') || 'http://192.168.0.194:8000/system-info';
  });

  // Zapisywanie zmian w localStorage
  useEffect(() => {
    localStorage.setItem('smartframe_upload_url', uploadUrl);
  }, [uploadUrl]);

  useEffect(() => {
    localStorage.setItem('smartframe_info_url', infoUrl);
  }, [infoUrl]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 pt-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Zarządzaj swoją ramką Raspberry Pi</p>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-6">
        {/* Ustawienia adresu zmieniają się w zależności od aktywnej zakładki */}
        <EndpointSettings 
          apiUrl={activeTab === 'upload' ? uploadUrl : infoUrl} 
          onUrlChange={activeTab === 'upload' ? setUploadUrl : setInfoUrl} 
        />

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-full">
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
        </div>

        {activeTab === 'upload' ? (
          <ImageUpload apiUrl={uploadUrl} />
        ) : (
          <DeviceInfo apiUrl={infoUrl} />
        )}
      </div>
      
      <div className="mt-auto py-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        Raspberry Pi Smart Frame UI
      </div>
    </div>
  );
}

export default App;