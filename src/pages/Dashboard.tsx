"use client";

import React from 'react';
import Clock from '../components/Clock';

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
        <section className="flex justify-center">
          <Clock />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Weather</h2>
            <div className="text-3xl font-light">22°C</div>
            <div className="text-muted-foreground">Partly Cloudy</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Calendar</h2>
            <div className="text-lg">No upcoming events</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;