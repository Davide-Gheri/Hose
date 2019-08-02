
export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function isNil(value: any) {
  return !value || value === null || value === undefined || value === '';
}
