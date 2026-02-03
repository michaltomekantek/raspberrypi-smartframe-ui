"use client";

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Zdjęcie zostało wysłane pomyślnie!');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error('Błąd serwera');
      }
    } catch (error) {
      toast.error('Nie udało się wysłać zdjęcia. Upewnij się, że serwer działa.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Upload size={20} /> Wgraj zdjęcie
      </h2>

      {!previewUrl ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Kliknij, aby wybrać zdjęcie do wysłania
          </p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/20">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={clearSelection}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? 'Wysyłanie...' : 'Wyślij na serwer'}
          </button>
        </div>
      )}
      
      <div className="mt-6 text-[10px] text-muted-foreground font-mono bg-black/20 p-3 rounded-lg break-all">
        Endpoint: POST http://127.0.0.1:8000/upload
      </div>
    </div>
  );
};

export default ImageUpload;