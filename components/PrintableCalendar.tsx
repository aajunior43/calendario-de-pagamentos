import React from 'react';
import { CalendarDay, DayType } from '../types';

interface PrintableCalendarProps {
  days: CalendarDay[];
  monthName: string;
  year: number;
  lastBusinessDay: number;
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const PrintableCalendar: React.FC<PrintableCalendarProps> = ({ days, monthName, year, lastBusinessDay }) => {
  return (
    <div id="printable-calendar" className="w-[210mm] min-h-[297mm] bg-white p-8 text-black font-sans box-border relative">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
            Calendário de Pagamentos
          </h1>
          <p className="text-sm text-gray-600 mt-1">Prefeitura de Inajá</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {monthName} <span className="text-red-600">{year}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="w-full border-t border-l border-gray-300">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-300 bg-gray-100">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2 text-center text-xs font-bold text-gray-700 uppercase border-r border-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
            let bgClass = 'bg-white';
            let textClass = 'text-gray-800';
            
            if (!day.isCurrentMonth) {
              bgClass = 'bg-gray-50';
              textClass = 'text-gray-400';
            } else if (day.type === DayType.WEEKEND) {
              bgClass = 'bg-gray-50';
            }

            return (
              <div
                key={index}
                className={`
                  h-28 p-2 flex flex-col items-start justify-between border-b border-r border-gray-300
                  ${bgClass}
                `}
              >
                <div className="w-full flex justify-between">
                   <span className={`text-sm ${day.dayOfMonth === 1 ? 'font-bold' : ''} ${textClass}`}>
                    {day.dayOfMonth}
                  </span>
                  {day.type === DayType.HOLIDAY && (
                    <span className="text-[8px] uppercase font-bold text-amber-600">{day.holidayName}</span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-1 items-center">
                  {day.type === DayType.PAYMENT_DAY && day.isCurrentMonth && (
                    <div className="w-full bg-red-100 border border-red-300 rounded px-1 py-1 text-center">
                      <p className="text-[9px] font-bold text-red-800 uppercase leading-tight">
                         {day.paymentText || 'Pagamento'}
                      </p>
                    </div>
                  )}
                  
                  {day.type === DayType.COMMITMENT_DAY && day.isCurrentMonth && (
                    <div className="w-full bg-purple-50 border border-purple-200 rounded px-1 py-1 text-center">
                      <p className="text-[8px] font-semibold text-purple-800 uppercase leading-tight line-clamp-2">
                        {day.commitmentText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Legend */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b border-gray-200 pb-1">Legenda</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-xs text-gray-700 font-medium">Dia de Pagamento (Vermelho)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border border-purple-200 rounded"></div>
              <span className="text-xs text-gray-700 font-medium">Dia de Empenho</span>
            </div>
             <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 font-bold uppercase">Nome do Feriado</span>
              <span className="text-xs text-gray-700 font-medium">Feriado Nacional/Facultativo</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
           <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b border-gray-200 pb-1">Resumo</h3>
           <p className="text-xs text-gray-600 mb-1">
             O pagamento geral dos servidores será realizado no dia:
           </p>
           <p className="text-xl font-bold text-red-600">
             {lastBusinessDay} de {monthName}
           </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 w-full text-center">
         <p className="text-[10px] text-gray-400">Documento gerado automaticamente. Verifique as datas oficiais no diário oficial.</p>
      </div>
    </div>
  );
};