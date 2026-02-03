import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ImageUpload from './components/ImageUpload';
import EndpointSettings from './components/EndpointSettings';

function App() {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('smartframe_api_url') || 'http://192.168.0.194:8000/upload';
  });

  useEffect(() => {
    localStorage.setItem('smartframe_api_url', apiUrl);
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Wgraj nowe zdjęcie do swojej ramki</p>
      </div>

      <EndpointSettings apiUrl={apiUrl} onUrlChange={setApiUrl} />

      <ImageUpload apiUrl={apiUrl} />
      
      <div className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest">
        Raspberry Pi Smart Frame UI
      </div>
    </div>
  );
}

export default App;