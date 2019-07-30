import { ChangeEvent, useMemo, useState } from 'react';
import { clearInputErrors, getInitialFormErrors, validateForm, validateInputValue } from './utils';
import { FormValues } from './useFormValues';

export type ValidationFn = (value: any) => string | undefined;

export type FormValidations<F = any> = {
  [K in keyof F]: ValidationFn[];
}

export type FormErrors<F = any> = {
  [K in keyof F]: string[];
}

export function useFormErrors<F = any>(formValidations: FormValidations<F> = {} as any) {
  const initialFormErrors = useMemo(
    () => getInitialFormErrors(formValidations),
    [],
  );

  const [formErrors, setFormErrors] = useState<FormErrors<F>>(initialFormErrors);

  return {
    formErrors,
    numberOfErrors: Object.values<string[]>(formErrors).filter(value => value.length > 0).length,
    validateForm: (formValues: FormValues) => validateForm(formValues, setFormErrors, formValidations),
    validateInputValue: (event: ChangeEvent<HTMLInputElement>) => validateInputValue(event, setFormErrors, formValidations),
    clearFormErrors: () => setFormErrors(initialFormErrors),
    clearInputErrors: (name: string) => clearInputErrors(name, setFormErrors),
    setInputErrors: (name: string, errors: string[]) => setFormErrors(prevState => ({...prevState, [name]: errors})),
  };
}
