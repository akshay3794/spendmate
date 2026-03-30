import moment from 'moment';

export const formattedDate = (date: number, month: number, year: number) => {
  return `${date}/${month}/${year}`;
};

export const formatDate = (date: string) => {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());

  return `${year}-${month}-${day}`;
};

export const formatToReadableDate = (dateStr: string) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};

export function formatDateToDayMonth(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}/${month}`;
}

export const groupTransactionsByDate = (data: any[]) => {
  const grouped = data.reduce((acc: any, item: any) => {
    const label = getDateLabel(item.transaction_date);

    if (!acc[label]) {
      acc[label] = {
        label,
        data: [],
        value: 0,
      };
    }

    acc[label].data.push(item);
    acc[label].value += item.amount;

    return acc;
  }, {});

  return Object.values(grouped);
};

export const getDateLabel = (dateString: string): string => {
  if (!dateString) return '';

  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(inputDate, today)) {
    return 'Today';
  }

  if (isSameDay(inputDate, yesterday)) {
    return 'Yesterday';
  }

  if (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth()
  ) {
    return 'Older';
  }

  if (inputDate.getFullYear() !== today.getFullYear()) {
    return inputDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  return inputDate.toLocaleString('default', { month: 'long' });
};
