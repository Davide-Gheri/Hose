import { parseISO, isDate } from 'date-fns';

export const parseDates = (...fields: string[]) => (res: any | any[]) => {
  const fieldsToCheck = fields.length ? fields : ['createdAt', 'updatedAt'];

  const parseFields = (entity: any) => {
    const parsed = entity;
    fieldsToCheck.forEach(field => {
      if (entity[field]) {
        if (!isDate(entity[field])) {
          parsed[field] = parseISO(entity[field]);
        }
      }
    });
    return parsed;
  };

  if (Array.isArray(res)) {
    return res.map(parseFields);
  }
  return parseFields(res);
};
