import React from 'react';
import { Toaster } from 'react-hot-toast';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Frame</h1>
        <p className="text-zinc-400">Wgraj nowe zdjęcie do swojej ramki</p>
      </div>

      <ImageUpload />
      
      <div className="mt-8 text-xs text-zinc-600">
        Endpoint: <code className="bg-zinc-900 px-2 py-1 rounded">POST http://192.168.0.194:8000/upload</code>
      </div>
    </div>
  );
}

export default App;