import React, { useState, useMemo } from 'react';
import { CalendarGrid } from './components/CalendarGrid';
import { InfoPanel } from './components/InfoPanel';
import { PrintableCalendar } from './components/PrintableCalendar';
import { generateCalendarDays, getMonthName, getLastBusinessDayOfMonth } from './utils/dateHelpers';
import { CalendarDay } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const calendarDays = useMemo(() => generateCalendarDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const lastBusinessDay = useMemo(() => getLastBusinessDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthName = useMemo(() => getMonthName(currentMonth), [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('printable-calendar');
    
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`calendario-pagamento-inaja-${monthName}-${currentYear}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Erro ao gerar o PDF. Tente novamente.');
      }
    }
    setIsGeneratingPdf(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100 font-sans bg-gray-900">
      {/* Navigation / Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-700 text-white p-2 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Calendário Pagamento <span className="text-green-500">Prefeitura de Inajá</span>
            </h1>
             <h1 className="text-lg font-bold tracking-tight text-white sm:hidden">
              Pagamento <span className="text-green-500">Inajá</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPdf}
              className={`
                hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600
                ${isGeneratingPdf ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600 hover:text-white'}
              `}
            >
              {isGeneratingPdf ? (
                <span>Gerando...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Baixar PDF</span>
                </>
              )}
            </button>

            <div className="flex items-center bg-gray-700 rounded-lg p-1 border border-gray-600">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="px-4 py-1 font-semibold text-gray-200 min-w-[140px] text-center capitalize select-none">
                {monthName} {currentYear}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-600 rounded-md text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Calendar Grid */}
          <div className="lg:col-span-2">
             <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-300">Visão Geral do Mês</h2>
                <div className="flex gap-4 text-xs text-gray-400">
                   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-900/50 border border-green-500 rounded"></div> Pagamento</div>
                   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-900/50 border border-purple-500 rounded"></div> Empenho</div>
                   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-900/50 border border-amber-500 rounded"></div> Feriado</div>
                </div>
             </div>
            <CalendarGrid 
              days={calendarDays} 
              onDayClick={handleDayClick} 
              selectedDate={selectedDay?.date}
            />
            {/* Mobile PDF Button */}
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="mt-6 w-full md:hidden flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-gray-200 py-3 rounded-xl font-medium"
            >
               {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Calendário em PDF'}
            </button>
          </div>

          {/* Right: Info Panel */}
          <div className="lg:col-span-1">
            <InfoPanel day={selectedDay} lastBusinessDay={lastBusinessDay} />
          </div>
        </div>
      </main>

      {/* Hidden Printable Calendar - Positioned off-screen */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -50 }}>
        <PrintableCalendar 
          days={calendarDays}
          monthName={monthName}
          year={currentYear}
          lastBusinessDay={lastBusinessDay}
        />
      </div>
    </div>
  );
};

export default App;