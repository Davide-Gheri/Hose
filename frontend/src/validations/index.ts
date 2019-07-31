import { ValidationFn } from '../hooks/form';

export function required(value: string) {
  if (value === null || value === undefined || value === '') {
    return 'Field required';
  }
}

export function email(value: string) {
  const message = 'Invalid email';
  const lengthValid = value.length >= 1 && value.length <= 255;
  if (!lengthValid) {
    return message;
  }
  if (!/^.+@.+\..+$/.test(value)) {
    return message;
  }
}

export function makeMinLength(min: number) {
  return function minLength(value: string) {
    if (value.length < min) {
      return `Field must be at least ${min} characters`;
    }
  }
}

export function makeMaxLength(max: number) {
  return function maxLength(value: string) {
    if (value.length > max) {
      return `Field must be maximum ${max} characters`;
    }
  }
}

export function makeOneOf(toCheck: any[]) {
  return function onOf(value: string) {
    if (!toCheck.includes(value)) {
      return `Field must be one of: ${toCheck.join(', ')}`;
    }
  }
}

export function numeric(value: string) {
  if (!/[0-9]/.test(value)) {
    return 'Field must be numeric';
  }
}

export function alpha(value: string) {
  if (!/[a-zA-Z]/.test(value)) {
    return 'Field must be only letters';
  }
}

export function confirmed(value: string, check: string) {
  if (value !== check) {
    return 'Field does not match';
  }
}

export function array(...validators: ValidationFn[]) {
  return function validateArray(value: string[]) {
    const errors = value.map(val => {
      for (const validator of validators) {
        const res = validator(val);
        if (res) {
          return res;
        }
      }
    }).filter(Boolean);

    return errors.length ? errors[0] : undefined;
  }
}
