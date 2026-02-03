"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-8xl font-bold tracking-tighter">
        {format(time, 'HH:mm')}
      </div>
      <div className="text-2xl text-muted-foreground mt-2">
        {format(time, 'EEEE, MMMM do')}
      </div>
    </div>
  );
};

export default Clock;