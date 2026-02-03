import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Terminal, Bug, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [debugData, setDebugData] = useState<{
    status: string | number;
    statusText: string;
    url: string;
    method: string;
    rawResponse: string;
    errorDetails?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDebugData(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setDebugData(null);
    
    const url = 'http://127.0.0.1:8000/upload';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      
      setDebugData({
        status: response.status,
        statusText: response.statusText,
        url: url,
        method: 'POST',
        rawResponse: text
      });

      if (response.ok) {
        toast.success(`Sukces: ${response.status}`);
        setFile(null);
        setPreview(null);
      } else {
        toast.error(`Serwer zwrócił błąd: ${response.status}`);
      }
    } catch (error: any) {
      // To się wykona jeśli jest błąd sieciowy (np. brak CORS lub serwer wyłączony)
      setDebugData({
        status: 'FETCH_ERROR',
        statusText: 'Błąd krytyczny / Sieć',
        url: url,
        method: 'POST',
        rawResponse: 'Brak odpowiedzi z serwera (prawdopodobnie CORS lub serwer nie działa)',
        errorDetails: `${error.name}: ${error.message}\n\nMożliwe przyczyny:\n1. Serwer na porcie 8000 nie działa.\n2. Brak nagłówków CORS (Access-Control-Allow-Origin) na serwerze.\n3. Przeglądarka blokuje zapytanie do localhost.`
      });
      toast.error('Błąd połączenia. Sprawdź konsolę i debugera.');
      console.error('Pełny obiekt błędu:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div 
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative
              ${preview ? 'border-transparent' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/50'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <Upload size={40} className="mb-2" />
                <p className="text-sm font-medium">Wybierz zdjęcie do testu</p>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${!file || uploading ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {uploading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "WYŚLIJ I POKAŻ LOGI"}
          </button>
        </div>
      </div>

      {debugData && (
        <div className="p-4 bg-black rounded-xl border border-zinc-700 font-mono text-[11px]">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2 text-zinc-400 uppercase tracking-tighter">
              <Bug size={14} />
              <span>Raport Diagnostyczny</span>
            </div>
            <div className={`px-2 py-0.5 rounded ${debugData.status === 200 ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
              STATUS: {debugData.status}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-zinc-500 mb-1">// Request Info</p>
              <p className="text-zinc-300">{debugData.method} {debugData.url}</p>
              <p className="text-zinc-300">Status Text: {debugData.statusText}</p>
            </div>

            {debugData.errorDetails && (
              <div className="bg-red-950/30 p-3 rounded border border-red-900/50">
                <p className="text-red-400 flex items-center gap-1 mb-1">
                  <AlertTriangle size={12} /> BŁĄD WYJĄTKU (JS EXCEPTION):
                </p>
                <pre className="text-red-300 whitespace-pre-wrap">{debugData.errorDetails}</pre>
              </div>
            )}

            <div>
              <p className="text-zinc-500 mb-1">// Server Response Body</p>
              <pre className="bg-zinc-900 p-3 rounded border border-zinc-800 text-zinc-300 overflow-x-auto">
                {debugData.rawResponse || "(Brak treści odpowiedzi)"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;