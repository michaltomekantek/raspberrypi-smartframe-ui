import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

interface EpaperUploadProps {
  apiUrl: string;
}

const EpaperUpload = ({ apiUrl }: EpaperUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [debugData, setDebugData] = useState<{
    status: string | number;
    rawResponse: string;
    isError: boolean;
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
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'accept': 'application/json' },
        body: formData,
      });

      const text = await response.text();
      const isOk = response.ok;
      
      setDebugData({
        status: response.status,
        rawResponse: text,
        isError: !isOk
      });

      if (isOk) {
        toast.success("Zdjęcie wysłane na E-Papier!");
        setFile(null);
        setPreview(null);
      } else {
        toast.error(`Błąd: ${response.status}`);
        setShowLogs(true);
      }
    } catch (error: any) {
      setDebugData({
        status: 'BŁĄD',
        rawResponse: error.message || "Błąd połączenia.",
        isError: true
      });
      setShowLogs(true);
      toast.error('Błąd połączenia z API E-Papieru.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div 
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative
              ${preview ? 'border-transparent' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/50'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black/20" />
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
                <p className="text-sm font-medium">Wybierz zdjęcie dla E-Papieru</p>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${!file || uploading ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-black hover:bg-white shadow-lg shadow-white/5'}`}
          >
            {uploading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "WYŚLIJ NA E-PAPIER"}
          </button>
        </div>
      </div>

      {debugData && (
        <div className={`rounded-xl border overflow-hidden transition-all ${debugData.isError ? 'border-red-900/50 bg-red-950/10' : 'border-emerald-900/50 bg-emerald-950/10'}`}>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              {debugData.isError ? <AlertCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
              <span className={debugData.isError ? 'text-red-400' : 'text-emerald-400'}>
                Status: {debugData.status}
              </span>
            </div>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLogs && (
            <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all">
                  {debugData.rawResponse || "(Brak treści)"}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpaperUpload;