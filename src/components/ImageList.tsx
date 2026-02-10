import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, RefreshCw, Image as ImageIcon, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageItem {
  id: number;
  filename: string;
  url: string;
  is_active: boolean;
  added_at: string;
}

interface ImageListProps {
  apiUrl: string;
  baseUrl: string;
}

const ImageList = ({ apiUrl, baseUrl }: ImageListProps) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(10);
  const [settingInterval, setSettingInterval] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Błąd pobierania zdjęć');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error("Nie udało się pobrać listy zdjęć");
    } finally {
      setLoading(false);
    }
  };

  const fetchInterval = async () => {
    try {
      const response = await fetch(`${baseUrl}/settings/interval`);
      if (response.ok) {
        const data = await response.json();
        const seconds = typeof data === 'object' ? data.seconds : data;
        if (seconds !== undefined) {
          setIntervalSeconds(seconds);
        }
      }
    } catch (error) {
      console.error("Nie udało się pobrać interwału");
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${baseUrl}/images/${id}?is_active=${newStatus}`, {
        method: 'PATCH',
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd aktualizacji');
      
      setImages(images.map(img => img.id === id ? { ...img, is_active: newStatus } : img));
      toast.success(newStatus ? "Zdjęcie aktywowane" : "Zdjęcie ukryte");
    } catch (error) {
      toast.error("Błąd zmiany statusu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;
    
    try {
      const response = await fetch(`${baseUrl}/images/${id}`, {
        method: 'DELETE',
        headers: { 'accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Błąd usuwania');
      
      setImages(images.filter(img => img.id !== id));
      toast.success("Zdjęcie zostało usunięte");
    } catch (error) {
      toast.error("Błąd podczas usuwania zdjęcia");
    }
  };

  const updateInterval = async () => {
    setSettingInterval(true);
    try {
      const response = await fetch(`${baseUrl}/settings/interval?seconds=${intervalSeconds}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Błąd zapisu interwału');
      toast.success(`Interwał ustawiony na ${intervalSeconds}s`);
    } catch (error) {
      toast.error("Błąd zapisu ustawień");
    } finally {
      setSettingInterval(false);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchInterval();
  }, [apiUrl, baseUrl]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4 text-blue-400">
          <Clock size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Interwał Pokazu Slajdów</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            value={intervalSeconds}
            onChange={(e) => setIntervalSeconds(parseInt(e.target.value) || 0)}
            className="flex-1 bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 text-white"
            placeholder="Sekundy"
          />
          <button
            onClick={updateInterval}
            disabled={settingInterval}
            className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50"
          >
            {settingInterval ? "ZAPIS..." : "USTAW"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Biblioteka Zdjęć ({images.length})</h3>
        <button onClick={fetchImages} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {images.length === 0 && !loading ? (
        <div className="p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3">
          <ImageIcon size={32} className="opacity-20" />
          <p className="text-xs uppercase tracking-widest">Brak zdjęć w pamięci</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {images.map((img) => (
            <div key={img.id} className={`p-3 rounded-xl border transition-all flex items-center gap-4 ${img.is_active ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-950 border-zinc-900 opacity-60'}`}>
              <div 
                onClick={() => setSelectedImage(img.url)}
                className="w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-zinc-200">{img.filename}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  {new Date(img.added_at).toLocaleString('pl-PL')}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(img.id, img.is_active)}
                  className={`p-3 rounded-xl transition-all ${img.is_active ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-zinc-600 hover:bg-zinc-800'}`}
                  title={img.is_active ? "Ukryj" : "Pokaż"}
                >
                  {img.is_active ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </button>
                
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                  title="Usuń"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
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

export default ImageList;