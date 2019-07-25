import { ChangeEvent, useState } from 'react';
import { resetInputValue, updateInputValue } from './utils';

export interface FormValues {
  [key: string]: any;
}

export function useFormValues(initialValues: FormValues) {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  return {
    formValues,
    resetFormValues: () => setFormValues(initialValues),
    resetInputValue: (name: string) => resetInputValue(name, setFormValues, initialValues),
    updateInputValye: (event: ChangeEvent<HTMLInputElement>) => updateInputValue(event, setFormValues),
    setInputValue: (name: string, value: string) => setFormValues(prevState => ({...prevState, [name]: value})),
  };
}
