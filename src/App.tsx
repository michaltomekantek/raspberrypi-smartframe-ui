import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Image as ImageIcon, Info } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';
import DeviceInfo from './components/DeviceInfo';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'info'>('upload');
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('smartframe_api_url') || 'http://192.168.0.194:8000/upload';
  });

  useEffect(() => {
    localStorage.setItem('smartframe_api_url', apiUrl);
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 pt-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Zarządzaj swoją ramką Raspberry Pi</p>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-6">
        {/* Ustawienia adresu są teraz zawsze na górze */}
        <EndpointSettings apiUrl={apiUrl} onUrlChange={setApiUrl} />

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
          <ImageUpload apiUrl={apiUrl} />
        ) : (
          <DeviceInfo apiUrl={apiUrl} />
        )}
      </div>
      
      <div className="mt-auto py-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        Raspberry Pi Smart Frame UI
      </div>
    </div>
  );
}

export default App;