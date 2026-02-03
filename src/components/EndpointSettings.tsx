import React, { useState } from 'react';
import { Settings, Check, Edit2 } from 'lucide-react';

interface EndpointSettingsProps {
  apiUrl: string;
  onUrlChange: (newUrl: string) => void;
}

const EndpointSettings = ({ apiUrl, onUrlChange }: EndpointSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(apiUrl);

  const handleSave = () => {
    onUrlChange(tempUrl);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-xl mb-6 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Settings size={16} className="text-zinc-500 shrink-0" />
        {isEditing ? (
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs font-mono w-full focus:outline-none focus:border-blue-500 text-zinc-200"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        ) : (
          <div className="text-xs font-mono text-zinc-400 truncate">
            {apiUrl}
          </div>
        )}
      </div>
      
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white shrink-0"
      >
        {isEditing ? <Check size={16} className="text-emerald-500" /> : <Edit2 size={16} />}
      </button>
    </div>
  );
};

export default EndpointSettings;