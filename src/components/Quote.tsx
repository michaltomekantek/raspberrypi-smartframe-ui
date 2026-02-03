"use client";

import React from 'react';
import { Quote as QuoteIcon } from 'lucide-react';

const Quote = () => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center text-center">
      <QuoteIcon className="w-6 h-6 text-muted-foreground/30 mb-3" />
      <p className="text-lg font-light italic leading-relaxed max-w-md">
        "The only way to do great work is to love what you do."
      </p>
      <span className="mt-3 text-sm text-muted-foreground">— Steve Jobs</span>
    </div>
  );
};

export default Quote;