"use client";

import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

const Weather = () => {
  // Mock data - in a real app, this would come from an API
  const weatherData = {
    temp: 22,
    condition: 'Partly Cloudy',
    high: 24,
    low: 18,
    humidity: 45,
    wind: 12,
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Weather</h2>
          <div className="text-4xl font-light mt-1">{weatherData.temp}°C</div>
          <div className="text-muted-foreground">{weatherData.condition}</div>
        </div>
        <Cloud className="w-10 h-10 text-blue-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Droplets size={16} />
          <span>{weatherData.humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind size={16} />
          <span>{weatherData.wind} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;