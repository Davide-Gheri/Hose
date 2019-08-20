export * from './useFormErrors';
export * from './useFormValues';
export * from './useFormStyles';

const isPrimitive = (value: any) =>
  typeof value === 'string'
  || typeof value === 'number';

export const safeValue = (model: any, field: any, def: any = ''): any =>
  model ? isPrimitive(model[field]) ? model[field] : model[field] ? model[field].id : def || def : def;
