import React from 'react';
import { CalendarDay, DayType } from '../types';

interface InfoPanelProps {
  day: CalendarDay | null;
  lastBusinessDay: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ day, lastBusinessDay }) => {
  if (!day) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex items-center justify-center text-gray-500 text-center border border-gray-700">
        <p>Selecione um dia no calendário para ver detalhes.</p>
      </div>
    );
  }

  const dateFormatted = day.date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isPaymentDay = day.type === DayType.PAYMENT_DAY && day.isCurrentMonth;
  const isCommitmentDay = day.type === DayType.COMMITMENT_DAY && day.isCurrentMonth;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Header Color Stripe */}
      <div className={`h-4 w-full ${isPaymentDay ? 'bg-green-600' : isCommitmentDay ? 'bg-purple-600' : 'bg-blue-600'}`}></div>
      
      <div className="p-6 flex flex-col gap-6 flex-1 text-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Data Selecionada</h3>
          <p className="text-2xl font-bold text-gray-100 capitalize">{dateFormatted}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {day.type === DayType.PAYMENT_DAY && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/40 text-green-200 border border-green-800 capitalize">
                💰 {day.paymentText || 'Dia de Pagamento'}
              </span>
            )}
            {day.type === DayType.COMMITMENT_DAY && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/40 text-purple-200 border border-purple-800">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                 </svg>
                Dia de Empenho
              </span>
            )}
            {day.type === DayType.HOLIDAY && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-900/40 text-amber-200 border border-amber-800">
                🎉 Feriado: {day.holidayName}
              </span>
            )}
            {day.type === DayType.WEEKEND && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                ☕ Fim de Semana
              </span>
            )}
            {day.type === DayType.BUSINESS_DAY && !isPaymentDay && !isCommitmentDay && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-200 border border-blue-800">
                💼 Dia Útil
              </span>
            )}
          </div>
        </div>
        
        {/* Commitment Info */}
        {isCommitmentDay && (
           <div className="mt-4 p-4 bg-purple-900/20 rounded-xl border border-purple-800/50">
             <h4 className="text-purple-300 font-bold text-sm mb-2 flex items-center gap-2">
               Lembrete de Empenho
             </h4>
             {day.commitmentText && day.commitmentText.includes(',') ? (
               <ul className="list-disc list-inside text-purple-200 text-sm font-medium space-y-1">
                 {day.commitmentText.split(',').map((item, idx) => (
                   <li key={idx} className="capitalize">{item.trim()}</li>
                 ))}
               </ul>
             ) : (
                <p className="text-purple-200 text-sm font-medium capitalize">
                  {day.commitmentText || 'Empenho programado'}
                </p>
             )}
           </div>
        )}

        {!isPaymentDay && !isCommitmentDay && day.isCurrentMonth && (
          <div className="mt-auto bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
             <p className="text-sm text-gray-400">O pagamento geral deste mês será no dia</p>
             <p className="text-3xl font-bold text-green-500">{lastBusinessDay}</p>
             <p className="text-xs text-gray-500 uppercase">Último dia útil</p>
          </div>
        )}
      </div>
    </div>
  );
};