export enum DayType {
  BUSINESS_DAY = 'BUSINESS_DAY',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
  PAYMENT_DAY = 'PAYMENT_DAY',
  COMMITMENT_DAY = 'COMMITMENT_DAY'
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  type: DayType;
  holidayName?: string;
  commitmentText?: string;
  paymentText?: string;
}
