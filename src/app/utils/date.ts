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

export function formatDateForInput(
  date: string | null | undefined
): string {
  if (!date) {
    return '';
  }

  const [day, month, year] = date.split('/');

  if (!day || !month || !year) {
    return '';
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function formatTimeForInput(value: string | null | undefined): string {
  if (!value) return '';

  // Already in HH:mm format
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  // Convert 08:30 AM / 08:30 PM to 24-hour format
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (match) {
    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return '';
}

export function formatApiDateForInput(
  date: string | null | undefined
): string {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

