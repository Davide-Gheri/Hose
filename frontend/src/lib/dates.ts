import { isDate } from 'date-fns';
import { format } from 'date-fns/fp';

const formatFn = format('dd/MM/yyyy HH:mm');

export const formatDate = (value: Date) => (
  isDate(value) ? formatFn(value) : null
);
