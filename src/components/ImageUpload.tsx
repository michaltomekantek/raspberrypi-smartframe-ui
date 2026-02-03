import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Proszę wybrać plik graficzny');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Zdjęcie zostało wgrane pomyślnie!');
        setFile(null);
        setPreview(null);
      } else {
        throw new Error('Błąd serwera');
      }
    } catch (error) {
      toast.error('Nie udało się wgrać zdjęcia. Upewnij się, że serwer działa.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
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
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-zinc-400">
              <Upload size={40} className="mb-2" />
              <p className="text-sm font-medium">Kliknij, aby wybrać zdjęcie</p>
              <p className="text-xs text-zinc-500 mt-1">JPG, PNG, GIF</p>
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
            ${!file || uploading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'}`}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={20} />
              Wgraj zdjęcie
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;