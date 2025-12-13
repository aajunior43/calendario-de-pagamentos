import React from 'react';
import { CalendarDay, DayType } from '../types';

interface InfoPanelProps {
  day: CalendarDay | null;
  lastBusinessDay: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ day, lastBusinessDay }) => {
  // Empty State
  if (!day) {
    return (
      <div className="glass-panel h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10 group-hover:scale-110 transition-transform duration-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
        <h3 className="text-xl font-medium text-white/80 mb-2">Detalhes do Dia</h3>
        <p className="text-gray-400 font-light text-sm max-w-[200px]">Selecione uma data no calendário para visualizar pagamentos e empenhos.</p>
        
        {/* Footer info in empty state */}
        <div className="mt-auto pt-12 opacity-50">
           <p className="text-xs uppercase tracking-widest text-white/40">Pagamento Geral</p>
           <p className="text-2xl font-bold text-white/60">Dia {lastBusinessDay}</p>
        </div>
      </div>
    );
  }

  const dateFormatted = day.date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const isPayment = day.type === DayType.PAYMENT_DAY && day.isCurrentMonth;
  const isCommitment = day.type === DayType.COMMITMENT_DAY && day.isCurrentMonth;
  const isHoliday = day.type === DayType.HOLIDAY;
  const isWeekend = day.type === DayType.WEEKEND;

  // Configuration based on Day Type
  let theme = {
    gradient: 'from-blue-500/20 to-blue-900/5',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'bg-blue-500',
    title: 'Dia Útil',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  };

  if (isPayment) {
    theme = {
      gradient: 'from-red-600/40 to-red-900/20',
      iconColor: 'text-red-200',
      borderColor: 'border-red-500/50',
      glowColor: 'bg-red-500',
      title: 'Pagamento',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
  } else if (isCommitment) {
    theme = {
      gradient: 'from-purple-600/40 to-purple-900/20',
      iconColor: 'text-purple-200',
      borderColor: 'border-purple-500/50',
      glowColor: 'bg-purple-500',
      title: 'Empenho',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    };
  } else if (isHoliday) {
    theme = {
      gradient: 'from-amber-600/30 to-amber-900/10',
      iconColor: 'text-amber-300',
      borderColor: 'border-amber-500/40',
      glowColor: 'bg-amber-500',
      title: 'Feriado',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    };
  } else if (isWeekend) {
    theme = {
      gradient: 'from-white/10 to-transparent',
      iconColor: 'text-gray-400',
      borderColor: 'border-white/20',
      glowColor: 'bg-white',
      title: 'Fim de Semana',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    };
  }

  return (
    <div className={`glass-panel overflow-hidden flex flex-col h-full relative border ${theme.borderColor} transition-colors duration-500`}>
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-100`}></div>
      
      {/* Decorative Glow */}
      <div className={`absolute -top-20 -right-20 w-60 h-60 ${theme.glowColor} rounded-full blur-[80px] opacity-20 pointer-events-none`}></div>

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header: Date */}
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-white text-lg font-bold capitalize leading-tight">
            {dateFormatted}
          </h2>
        </div>

        {/* Hero Content: Icon & Main Status */}
        <div className="flex-1 flex flex-col items-center justify-start pt-4">
          <div className={`
            p-6 rounded-3xl mb-4 shadow-lg backdrop-blur-sm border border-white/10
            bg-white/5 ring-1 ring-white/5
            ${isPayment ? 'shadow-[0_0_30px_rgba(239,68,68,0.3)] bg-gradient-to-br from-red-500/20 to-transparent' : ''}
            ${isCommitment ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)] bg-gradient-to-br from-purple-500/20 to-transparent' : ''}
          `}>
             <div className={`${theme.iconColor} drop-shadow-md transform transition-transform hover:scale-110 duration-300`}>
               {theme.icon}
             </div>
          </div>
          
          <h1 className={`text-3xl font-black uppercase tracking-tight text-center mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 drop-shadow-sm`}>
            {theme.title}
          </h1>
          
          {/* Specific Text Description */}
          <div className="text-center max-w-[280px]">
            {isPayment && (
              <p className="text-xl font-medium text-red-200 animate-pulse">
                {day.paymentText || 'Pagamento dos Servidores'}
              </p>
            )}
            
            {isHoliday && (
              <p className="text-lg font-medium text-amber-200">
                {day.holidayName}
              </p>
            )}

            {isCommitment && (
               <div className="mt-4 w-full">
                  <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/20 text-left">
                     <p className="text-xs uppercase text-purple-300 font-bold mb-2 tracking-wider">Itens do Empenho:</p>
                     {day.commitmentText && day.commitmentText.includes(',') ? (
                       <ul className="space-y-2">
                         {day.commitmentText.split(',').map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-purple-100">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                             <span className="capitalize">{item.trim()}</span>
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <p className="text-sm text-purple-100 font-medium capitalize flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          {day.commitmentText}
                       </p>
                     )}
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Footer: General Context */}
        {!isPayment && !isCommitment && (
          <div className="mt-auto bg-black/20 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Pagamento Geral</p>
                  <p className="text-sm text-gray-300">Último dia útil do mês</p>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-bold text-red-500">{lastBusinessDay}</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};