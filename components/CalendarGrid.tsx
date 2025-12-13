import React from 'react';
import { CalendarDay, DayType } from '../types';

interface CalendarGridProps {
  days: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  selectedDate?: Date;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, onDayClick, selectedDate }) => {
  const today = new Date();

  return (
    <div className="w-full glass-panel overflow-hidden">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 bg-black/20 border-b border-white/5">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-4 text-center text-xs font-bold text-white/60 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, index) => {
          const isSelected = selectedDate && 
                             day.date.getDate() === selectedDate.getDate() && 
                             day.date.getMonth() === selectedDate.getMonth();
          
          const isToday = day.date.getDate() === today.getDate() &&
                          day.date.getMonth() === today.getMonth() &&
                          day.date.getFullYear() === today.getFullYear();

          // Base Glass Style
          let bgClass = 'bg-transparent';
          let textClass = 'text-gray-300';
          let hoverClass = 'hover:bg-white/5';
          let borderClass = 'border-r border-b border-white/5';
          
          if (!day.isCurrentMonth) {
            textClass = 'text-gray-600';
            bgClass = 'bg-black/20'; // Darker for disabled
          } else {
            if (day.type === DayType.PAYMENT_DAY) {
              // RED FOR PAYMENT (Anamorphic Red)
              bgClass = 'bg-gradient-to-br from-red-900/40 to-red-900/10';
              textClass = 'text-red-100 font-bold';
              borderClass = `${borderClass} shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]`;
              hoverClass = 'hover:bg-red-900/50 hover:shadow-[inset_0_0_30px_rgba(220,38,38,0.4)]';
            } else if (day.type === DayType.COMMITMENT_DAY) {
              // Purple for Commitment
              bgClass = 'bg-purple-900/20'; 
              textClass = 'text-purple-200 font-semibold';
              hoverClass = 'hover:bg-purple-900/30';
            } else if (day.type === DayType.WEEKEND) {
              bgClass = 'bg-black/10';
              textClass = 'text-gray-500';
            } else if (day.type === DayType.HOLIDAY) {
              bgClass = 'bg-amber-900/20';
              textClass = 'text-amber-500 font-medium';
            }
          }

          // Today Highlighting
          if (isToday && !isSelected) {
             bgClass = `${bgClass} relative overflow-hidden`;
             // Add a subtle glow for today
             borderClass = `${borderClass} ring-1 ring-inset ring-blue-400/50`;
          }

          // Selected State (Glass pop effect)
          if (isSelected) {
             bgClass = 'bg-gradient-to-br from-blue-600/90 to-blue-800/90 text-white shadow-xl scale-105 transform z-10 rounded-xl backdrop-blur-2xl border border-white/20';
             textClass = 'text-white';
             hoverClass = '';
             borderClass = 'ring-1 ring-white/30'; 
             
             // Override specifics if selected
             if (day.type === DayType.PAYMENT_DAY) {
                 bgClass = 'bg-gradient-to-br from-red-600/90 to-red-800/90 text-white shadow-neon-red scale-105 z-20 rounded-xl border border-red-400/50';
             } else if (day.type === DayType.COMMITMENT_DAY) {
                 bgClass = 'bg-gradient-to-br from-purple-600/90 to-purple-800/90 text-white shadow-lg scale-105 z-10 rounded-xl border border-purple-400/50';
             }
          }

          return (
            <button
              key={index}
              onClick={() => onDayClick(day)}
              className={`
                relative h-24 sm:h-32 p-3 flex flex-col items-start justify-start 
                transition-all duration-300 ease-out outline-none
                /* Animation & Interaction Classes */
                active:scale-[0.96] active:duration-75
                ${bgClass} ${textClass} ${hoverClass} ${borderClass}
              `}
            >
              {/* Interaction Overlay (Flash/Ripple Effect) */}
              <div className="absolute inset-0 bg-white/0 active:bg-white/10 transition-colors duration-75 pointer-events-none rounded-xl" />

              <div className="flex justify-between w-full relative z-10">
                <span className={`text-sm ${day.dayOfMonth === 1 ? 'font-extrabold underline decoration-white/30' : ''}`}>
                  {day.dayOfMonth}
                </span>
                {isToday && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                  </span>
                )}
              </div>
              
              {/* Indicators */}
              <div className="mt-auto w-full flex flex-col gap-1.5 relative z-10">
                {day.type === DayType.PAYMENT_DAY && day.isCurrentMonth && (
                  <div className={`
                    text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md w-full text-center leading-tight transition-all
                    ${isSelected ? 'bg-black/20 text-white' : 'bg-red-500/20 text-red-200 border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]'}
                  `}>
                    {day.paymentText && day.paymentText.toLowerCase().includes('oficineiros') ? 'OFICINEIROS' : 'PAGAMENTO'}
                  </div>
                )}
                
                {day.type === DayType.COMMITMENT_DAY && day.isCurrentMonth && (
                  <div className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md w-full mb-1
                     ${isSelected ? 'bg-black/20 text-white' : 'bg-purple-500/20 text-purple-200 border border-purple-500/30'}`}>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    EMPENHO
                  </div>
                )}
                
                {day.type === DayType.HOLIDAY && day.isCurrentMonth && (
                   <span className="text-[9px] sm:text-[10px] font-medium leading-tight truncate w-full text-center opacity-80 text-amber-400">
                     {day.holidayName}
                   </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};