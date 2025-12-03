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
    <div className="w-full bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 bg-gray-900/50 border-b border-gray-700">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-800">
        {days.map((day, index) => {
          const isSelected = selectedDate && 
                             day.date.getDate() === selectedDate.getDate() && 
                             day.date.getMonth() === selectedDate.getMonth();
          
          const isToday = day.date.getDate() === today.getDate() &&
                          day.date.getMonth() === today.getMonth() &&
                          day.date.getFullYear() === today.getFullYear();

          let bgClass = 'bg-gray-800';
          let textClass = 'text-gray-300';
          let hoverClass = 'hover:bg-gray-700';
          let borderClass = 'border-gray-700';

          if (!day.isCurrentMonth) {
            textClass = 'text-gray-600';
            bgClass = 'bg-gray-900/50';
          } else {
            if (day.type === DayType.PAYMENT_DAY) {
              bgClass = 'bg-green-900/20';
              textClass = 'text-green-400 font-bold';
              borderClass = 'ring-1 ring-inset ring-green-900/50';
              hoverClass = 'hover:bg-green-900/30';
            } else if (day.type === DayType.COMMITMENT_DAY) {
              // More vibrant purple
              bgClass = 'bg-purple-900/60'; 
              textClass = 'text-purple-100 font-bold';
              borderClass = 'ring-1 ring-inset ring-purple-500/50';
              hoverClass = 'hover:bg-purple-900/70';
            } else if (day.type === DayType.WEEKEND) {
              bgClass = 'bg-gray-900/30';
              textClass = 'text-gray-500';
            } else if (day.type === DayType.HOLIDAY) {
              bgClass = 'bg-amber-900/20';
              textClass = 'text-amber-500 font-medium';
            }
          }

          // Today Highlighting (if not selected)
          if (isToday && !isSelected) {
             borderClass = `${borderClass} ring-2 ring-inset ring-blue-500`;
             textClass = `${textClass} font-bold`;
          }

          if (isSelected) {
             bgClass = 'bg-blue-600 text-white shadow-md scale-105 transform transition-transform z-10 rounded-lg';
             textClass = 'text-white'; // Override
             hoverClass = 'hover:bg-blue-700';
             // Override specific types if selected
             if (day.type === DayType.PAYMENT_DAY) {
                 bgClass = 'bg-green-600 text-white shadow-lg scale-105 z-10 rounded-lg';
                 hoverClass = 'hover:bg-green-700';
             } else if (day.type === DayType.COMMITMENT_DAY) {
                 bgClass = 'bg-purple-600 text-white shadow-lg scale-105 z-10 rounded-lg';
                 hoverClass = 'hover:bg-purple-700';
             }
             borderClass = ''; 
          }

          return (
            <button
              key={index}
              onClick={() => onDayClick(day)}
              className={`
                relative h-24 sm:h-32 p-2 flex flex-col items-start justify-start transition-all duration-200 ease-in-out border-b border-r border-gray-700
                ${bgClass} ${textClass} ${hoverClass} ${borderClass}
              `}
            >
              <div className="flex justify-between w-full">
                <span className={`text-sm ${day.dayOfMonth === 1 ? 'font-bold underline' : ''}`}>
                  {day.dayOfMonth}
                </span>
                {isToday && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </div>
              
              {/* Indicators */}
              <div className="mt-auto w-full flex flex-col gap-1">
                {day.type === DayType.PAYMENT_DAY && day.isCurrentMonth && (
                  <span className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded w-fit self-center mb-1 text-center leading-tight ${isSelected ? 'bg-white/20 text-white' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
                    {day.paymentText && day.paymentText.toLowerCase().includes('oficineiros') ? 'PGTO OFICINEIROS' : 'PAGAMENTO'}
                  </span>
                )}
                
                {day.type === DayType.COMMITMENT_DAY && day.isCurrentMonth && (
                  <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded w-fit self-center mb-1 ${isSelected ? 'bg-white/20 text-white' : 'bg-purple-600 text-white border border-purple-500 shadow-sm'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    EMPENHO
                  </span>
                )}
                
                {day.type === DayType.HOLIDAY && day.isCurrentMonth && (
                   <span className="text-[9px] sm:text-[10px] leading-tight truncate w-full text-center opacity-70">
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