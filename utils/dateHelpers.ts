import { CalendarDay, DayType } from '../types';
import { isHoliday, getHolidayName, isWeekend } from './holidays';

export const getMonthName = (monthIndex: number): string => {
  const date = new Date(2024, monthIndex, 1);
  return date.toLocaleString('pt-BR', { month: 'long' });
};

export const getLastBusinessDays = (year: number, month: number, count: number): number[] => {
  const foundDays: number[] = [];
  const lastDay = new Date(year, month + 1, 0); // Last day of current month
  let currentDay = lastDay;

  // Safety break after checking 32 days
  let iterations = 0;
  while (currentDay.getDate() >= 1 && foundDays.length < count && iterations < 32) {
    if (!isWeekend(currentDay) && !isHoliday(currentDay)) {
      foundDays.push(currentDay.getDate());
    }
    // Move back one day
    currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - 1);
    iterations++;
  }
  return foundDays;
};

export const getLastBusinessDayOfMonth = (year: number, month: number): number => {
  const days = getLastBusinessDays(year, month, 1);
  return days.length > 0 ? days[0] : 1;
};

const findNextBusinessDay = (year: number, month: number, startDay: number): number => {
  let day = startDay;
  // We use the date object to check weekends/holidays correctly.
  // Note: Date(year, month, 32) automatically rolls over to next month, which is fine for the check,
  // but the returned 'day' might be > daysInMonth. The render loop handles this (it won't display).
  let date = new Date(year, month, day);
  
  let iterations = 0;
  // Check for next business day (limit iterations to avoid infinite loops, though unlikely)
  while (iterations < 10) {
    if (!isWeekend(date) && !isHoliday(date)) {
      return day;
    }
    day++;
    date = new Date(year, month, day);
    iterations++;
  }
  return startDay;
};

export const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get last 2 business days: [last, secondToLast]
  const businessDays = getLastBusinessDays(year, month, 2);
  const lastBusinessDay = businessDays[0];
  const secondToLastBusinessDay = businessDays[1];
  
  // Calculate specific commitment/payment dates (moving to next business day if needed)
  const copelSaneparDay = findNextBusinessDay(year, month, 15);
  const oficineirosPaymentDay = findNextBusinessDay(year, month, 10);

  const calendarDays: CalendarDay[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      dayOfMonth: prevMonthLastDay - i,
      isCurrentMonth: false,
      type: DayType.BUSINESS_DAY // Default for padding
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    let type = DayType.BUSINESS_DAY;
    let commitmentText: string | undefined;
    let paymentText: string | undefined;
    const holiday = getHolidayName(currentDate);

    if (i === lastBusinessDay) {
      type = DayType.PAYMENT_DAY;
      paymentText = 'Pagamento Servidores';
    } else if (i === oficineirosPaymentDay) {
       // Day 10 (or next business day): Payment of Oficineiros
       type = DayType.PAYMENT_DAY;
       paymentText = 'Pagamento Oficineiros';
    } else if (i === secondToLastBusinessDay) {
      type = DayType.COMMITMENT_DAY;
      commitmentText = 'Enfermeiras, estagiários, recicla já';
    } else if (i === copelSaneparDay) {
      // Day 15 (or next business day): Copel and Sanepar
      type = DayType.COMMITMENT_DAY;
      commitmentText = 'Copel e Sanepar';
    } else if (i >= 5 && i <= 7 && !isWeekend(currentDate) && !holiday) {
      // New rule: Days 5 to 7 (3 days) are for "Oficineiros" if business days
      type = DayType.COMMITMENT_DAY;
      commitmentText = 'Oficineiros';
    } else if (holiday) {
      type = DayType.HOLIDAY;
    } else if (isWeekend(currentDate)) {
      type = DayType.WEEKEND;
    }

    calendarDays.push({
      date: currentDate,
      dayOfMonth: i,
      isCurrentMonth: true,
      type,
      holidayName: holiday,
      commitmentText,
      paymentText
    });
  }

  // Next month padding
  const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      dayOfMonth: i,
      isCurrentMonth: false,
      type: DayType.BUSINESS_DAY
    });
  }

  return calendarDays;
};