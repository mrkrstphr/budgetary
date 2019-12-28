import { format } from 'date-fns';

export function formatDate(date) {
  // It would be nice to use this for locale specifics, but it does timezone
  // conversion, which messes with the date.
  // Fingers crossed for: https://github.com/tc39/proposal-temporal
  // return (date instanceof Date ? date : new Date(date)).toLocaleDateString();
  return format(date, 'MM/DD/YYYY');
}

export function formatIsoDate(date) {
  return format(date, 'YYYY-MM-DD');
}

export function formatMonthAndYear(date) {
  return format(date, 'MMMM YYYY');
}
