import { ValidationFn } from '../hooks/form';
import { isNil } from '../lib/util';

export function required(value: string) {
  if (isNil(value)) {
    return 'Field required';
  }
}

export function email(value: string) {
  if (isNil(value)) return undefined;
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
    if (isNil(value)) return undefined;
    if (value.length < min) {
      return `Field must be at least ${min} characters`;
    }
  }
}

export function makeMaxLength(max: number) {
  return function maxLength(value: string) {
    if (isNil(value)) return undefined;
    if (value.length > max) {
      return `Field must be maximum ${max} characters`;
    }
  }
}

export function makeOneOf(toCheck: any[]) {
  return function onOf(value: string) {
    if (isNil(value)) return undefined;
    if (!toCheck.includes(value)) {
      return `Field must be one of: ${toCheck.join(', ')}`;
    }
  }
}

export function numeric(value: string) {
  if (isNil(value)) return undefined;
  if (!/[0-9]/.test(value)) {
    return 'Field must be numeric';
  }
}

export function alpha(value: string) {
  if (isNil(value)) return undefined;
  if (!/[a-zA-Z]/.test(value)) {
    return 'Field must be only letters';
  }
}

export function confirmed(value: string, check: string) {
  if (isNil(value)) return undefined;
  if (value !== check) {
    return 'Field does not match';
  }
}

export function isUrl(value: string) {
  if (isNil(value)) return undefined;
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i');
  if (!pattern.test(value)) {
    return 'Field must be a valid Url';
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
