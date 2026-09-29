export function formatDateToDDMMYYYY(date: string): string {
  if (!date) {
    return '';
  }

  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}

export function formatDateToMMDDYYYYFromDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function formatDateToLongDate(
  date: string | null | undefined
): string {
  if (!date) {
    return '';
  }

  const [day, month, year] = date.split('/');

  if (!day || !month || !year) {
    return date;
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = Number(month) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return date;
  }

  return `${day} ${months[monthIndex]} ${year}`;
}