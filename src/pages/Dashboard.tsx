"use client";

import React from 'react';
import Clock from '../components/Clock';
import Weather from '../components/Weather';
import Calendar from '../components/Calendar';
import Quote from '../components/Quote';

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-8 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Left Column: Weather & Calendar */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <Weather />
          <Calendar />
        </div>

        {/* Center Column: Clock & Quote */}
        <div className="flex flex-col items-center justify-center gap-12 order-1 lg:order-2">
          <Clock />
          <Quote />
        </div>

        {/* Right Column: Placeholder for future widgets (e.g., Smart Home, News) */}
        <div className="flex flex-col gap-6 order-3">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Smart Home</h2>
            <p className="text-muted-foreground text-sm">All systems normal</p>
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">Lights: Off</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">Temp: 21°C</div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">News</h2>
            <div className="space-y-3">
              <div className="text-xs border-l-2 border-blue-500 pl-3 py-1">
                <div className="font-medium">Tech Breakthrough</div>
                <div className="text-muted-foreground">2 hours ago</div>
              </div>
              <div className="text-xs border-l-2 border-green-500 pl-3 py-1">
                <div className="font-medium">Market Update</div>
                <div className="text-muted-foreground">4 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;