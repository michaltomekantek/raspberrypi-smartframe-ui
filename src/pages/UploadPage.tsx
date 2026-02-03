"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { Toaster } from 'react-hot-toast';

const UploadPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-8">
      <Toaster position="bottom-center" />
      
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Powrót do Dashboardu</span>
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <ImageUpload />
    </div>
  );
};

export default UploadPage;