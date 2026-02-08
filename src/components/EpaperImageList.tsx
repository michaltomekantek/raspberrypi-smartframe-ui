import React, { useState, useEffect } from 'react';
import { RefreshCw, Image as ImageIcon, Trash2, CheckCircle2, XCircle, X, MonitorPlay } from 'lucide-react';
import toast from 'react-hot-toast';

interface EpaperImage {
  id: number;
  filename: string;
  url: string;
  is_active: boolean;
  added_at: string;
}

interface EpaperImageListProps {
  apiUrl: string;
}

const EpaperImageList = ({ apiUrl }: EpaperImageListProps) => {
  const [images, setImages] = useState<EpaperImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingImageId, setLoadingImageId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Wyciągamy bazowy URL dla endpointu /show (zakładając strukturę .../epaper/images)
  const showBaseUrl = apiUrl.replace('/images', '/show');

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd pobierania');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error("Nie udało się pobrać zdjęć E-Papieru");
    } finally {
      setLoading(false);
    }
  };

  const handleShowOnFrame = async (id: number) => {
    setLoadingImageId(id);
    try {
      const response = await fetch(`${showBaseUrl}/${id}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd odświeżania ekranu');
      toast.success("Zlecono wyświetlenie na ramce");
    } catch (error) {
      toast.error("Błąd połączenia z ramką");
    } finally {
      setLoadingImageId(null);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${apiUrl}/${id}?is_active=${newStatus}`, {
        method: 'PATCH',
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd aktualizacji');
      
      setImages(images.map(img => img.id === id ? { ...img, is_active: newStatus } : img));
      toast.success(newStatus ? "Zdjęcie aktywowane" : "Zdjęcie dezaktywowane");
    } catch (error) {
      toast.error("Błąd zmiany statusu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Usunąć to zdjęcie z E-Papieru?")) return;
    
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd usuwania');
      
      setImages(images.filter(img => img.id !== id));
      toast.success("Zdjęcie usunięte");
    } catch (error) {
      toast.error("Błąd podczas usuwania");
    }
  };

  useEffect(() => {
    fetchImages();
  }, [apiUrl]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Biblioteka E-Papier ({images.length})</h3>
        <button onClick={fetchImages} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {images.length === 0 && !loading ? (
        <div className="p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3">
          <ImageIcon size={32} className="opacity-20" />
          <p className="text-xs uppercase tracking-widest">Brak zdjęć</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {images.map((img) => (
            <div key={img.id} className={`p-3 rounded-xl border transition-all flex items-center gap-4 ${img.is_active ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-950 border-zinc-900 opacity-60'}`}>
              <div 
                onClick={() => setSelectedImage(img.url)}
                className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={img.url} alt={img.filename} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-zinc-200">{img.filename}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  {new Date(img.added_at).toLocaleString('pl-PL')}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleShowOnFrame(img.id)}
                  disabled={loadingImageId !== null}
                  className={`p-3 rounded-xl transition-all text-blue-400 hover:bg-blue-500/10 disabled:opacity-50`}
                  title="Załaduj na ekran"
                >
                  <MonitorPlay size={24} />
                </button>

                <button
                  onClick={() => toggleActive(img.id, img.is_active)}
                  className={`p-3 rounded-xl transition-all ${img.is_active ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-zinc-600 hover:bg-zinc-800'}`}
                >
                  {img.is_active ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </button>
                
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Overlay for Screen Refresh */}
      {loadingImageId !== null && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">UWAGA</p>
            <p className="text-blue-400 font-medium">Odświeżam ekran ramki...</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Powiększenie" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default EpaperImageList;