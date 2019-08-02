export * from './useFormErrors';
export * from './useFormValues';
export * from './useFormStyles';

export const safeValue = (model: any, field: any, def: any = ''): any =>
  model ? typeof model[field] === 'string' ? model[field] : model[field] ? model[field].id : def || def : def;
