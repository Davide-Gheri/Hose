import { ChangeEvent, useMemo, useState } from 'react';
import { clearInputErrors, getInitialFormErrors, validateForm, validateInputValue } from './utils';
import { FormValues } from './useFormValues';

export type ValidationFn = (value: string) => string | undefined;

export interface FormValidations {
  [key: string]: ValidationFn[];
}

export interface FormErrors {
  [key: string]: string[];
}

export function useFormErrors(formValidations: FormValidations = {}) {
  const initialFormErrors = useMemo(
    () => getInitialFormErrors(formValidations),
    [],
  );

  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);

  return {
    formErrors,
    numberOfErrors: Object.values(formErrors).filter(value => value.length > 0).length,
    validateForm: (formValues: FormValues) => validateForm(formValues, setFormErrors, formValidations),
    validateInputValue: (event: ChangeEvent<HTMLInputElement>) => validateInputValue(event, setFormErrors, formValidations),
    clearFormErrors: () => setFormErrors(initialFormErrors),
    clearInputErrors: (name: string) => clearInputErrors(name, setFormErrors),
    setInputErrors: (name: string, errors: string[]) => setFormErrors(prevState => ({...prevState, [name]: errors})),
  };
}
