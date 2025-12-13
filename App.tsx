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
    <div className="min-h-screen flex flex-col text-gray-100 font-sans">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 glass-panel m-4 mt-0 rounded-t-none border-t-0 bg-opacity-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-2.5 rounded-xl shadow-neon-red">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block drop-shadow-md">
                Prefeitura de Inajá
              </h1>
              <p className="text-xs text-red-300 font-medium tracking-wide uppercase">Calendário de Pagamentos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPdf}
              className={`
                hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-white/10
                ${isGeneratingPdf ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'glass-button text-white hover:text-white hover:border-red-500/50'}
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

            <div className="flex items-center glass-panel px-1 py-1">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="px-4 py-1 font-bold text-white min-w-[140px] text-center capitalize select-none text-lg drop-shadow-sm">
                {monthName} {currentYear}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Calendar Grid */}
          <div className="lg:col-span-2">
             <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel p-4 px-6">
                <h2 className="text-lg font-semibold text-white/90 mb-3 sm:mb-0">Legenda Visual</h2>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-300">
                   <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-red-500/30 shadow-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> 
                      <span className="text-red-200">Pagamento</span>
                   </div>
                   <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-purple-500/30">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div> 
                      <span className="text-purple-200">Empenho</span>
                   </div>
                   <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div> 
                      <span className="text-amber-200">Feriado</span>
                   </div>
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
              className="mt-6 w-full md:hidden flex items-center justify-center gap-2 glass-button text-white py-4 rounded-xl font-medium"
            >
               {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Calendário em PDF'}
            </button>
          </div>

          {/* Right: Info Panel */}
          <div className="lg:col-span-1 h-full">
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