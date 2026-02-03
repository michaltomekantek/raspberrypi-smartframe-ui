"use client";

import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const Calendar = () => {
  const events = [
    { id: 1, title: 'Morning Standup', time: '09:30 AM', type: 'Work' },
    { id: 2, title: 'Gym Session', time: '05:00 PM', type: 'Personal' },
    { id: 3, title: 'Dinner with Sarah', time: '07:30 PM', type: 'Social' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Upcoming</h2>
      </div>
      
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{event.title}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>{event.time}</span>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase tracking-tight">
                {event.type}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm italic">No events scheduled</div>
        )}
      </div>
    </div>
  );
};

export default Calendar;