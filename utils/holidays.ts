import { Holiday } from '../types';

// Fixed National Holidays in Brazil
const FIXED_HOLIDAYS: { day: number; month: number; name: string }[] = [
  { day: 1, month: 0, name: 'Confraternização Universal' },
  { day: 21, month: 3, name: 'Tiradentes' },
  { day: 1, month: 4, name: 'Dia do Trabalho' },
  { day: 7, month: 8, name: 'Independência do Brasil' },
  { day: 12, month: 9, name: 'Nossa Sr.ª Aparecida' },
  { day: 2, month: 10, name: 'Finados' },
  { day: 15, month: 10, name: 'Proclamação da República' },
  { day: 20, month: 10, name: 'Dia da Consciência Negra' },
  { day: 25, month: 11, name: 'Natal' },
];

// Specific movable holidays for 2024 and 2025 to ensure accuracy without complex Easter algo
const MOVABLE_HOLIDAYS: Record<string, string> = {
  // 2024
  '2024-02-12': 'Carnaval',
  '2024-02-13': 'Carnaval',
  '2024-03-29': 'Paixão de Cristo',
  '2024-05-30': 'Corpus Christi',
  // 2025
  '2025-03-03': 'Carnaval',
  '2025-03-04': 'Carnaval',
  '2025-04-18': 'Paixão de Cristo',
  '2025-06-19': 'Corpus Christi',
};

export const getHolidayName = (date: Date): string | undefined => {
  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  
  // Check fixed
  const fixed = FIXED_HOLIDAYS.find(h => h.day === day && h.month === month);
  if (fixed) return fixed.name;

  // Check movable
  const dateStr = date.toISOString().split('T')[0];
  if (MOVABLE_HOLIDAYS[dateStr]) return MOVABLE_HOLIDAYS[dateStr];

  return undefined;
};

export const isHoliday = (date: Date): boolean => {
  return !!getHolidayName(date);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};