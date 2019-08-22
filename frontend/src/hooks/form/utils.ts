import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { FormValues } from './useFormValues';
import { FormErrors, FormValidations, ValidationFn } from './useFormErrors';

export function updateInputValue<S = any>(event: ChangeEvent<HTMLInputElement>, setFormValues: Dispatch<SetStateAction<S>>): void {
  const { target } = event;
  const { name } = target;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  setFormValues(prevState => ({...prevState, [name]: value}));
}

export function validateForm<E = any>(formValues: FormValues, setFormErrors: Dispatch<SetStateAction<E>>, formValidations: FormValidations): boolean {
  const toValidate = Object.keys(formValidations);
  if (toValidate.length === 0) {
    return true;
  }
  const updatedFormErrors: any = {};
  toValidate.forEach(name => {
    updatedFormErrors[name] = getInputValidationErrors(
      formValues[name],
      formValidations[name],
    );
  });

  setFormErrors(updatedFormErrors);

  return Object.values(updatedFormErrors).filter((value: any) => value.length > 0)
    .length === 0;
}

export function validateInputValue<E = any>(event: ChangeEvent<HTMLInputElement>, setFormErrors: Dispatch<SetStateAction<E>>, formValidations: FormValidations) {
  const { name, value } = event.target;

  if (!formValidations.hasOwnProperty(name)) {
    return;
  }

  setFormErrors(prevFormErrors => ({
    ...prevFormErrors,
    [name]: getInputValidationErrors(
      value,
      formValidations[name]
    ),
  }));
}

export function resetInputValue<S>(name: string, setFormValues: Dispatch<SetStateAction<S>>, initialFormValues: FormValues) {
  const value = initialFormValues[name];

  setFormValues(prevFormValues => ({ ...prevFormValues, [name]: value }));
}

export function clearInputErrors<E = any>(name: string, setFormErrors: Dispatch<SetStateAction<E>>) {
  setFormErrors(prevFormErrors => ({
    ...prevFormErrors,
    [name]: [],
  }));
}

export function getInitialFormErrors(formValidations: FormValidations): FormErrors {
  const formInputNames = Object.keys(formValidations);
  const initialFormErrors: any = {};

  for (let a = 0; a < formInputNames.length; a++) {
    initialFormErrors[formInputNames[a]] = []
  }

  return initialFormErrors
}

function getInputValidationErrors(value: string, inputValidations: ValidationFn[]) {
  return inputValidations
    .map((validate: any) => validate(value))
    .filter((error: any) => error !== undefined);
}
