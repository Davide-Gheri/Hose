import { ChangeEvent, useState } from 'react';
import { resetInputValue, updateInputValue } from './utils';

export type FormValues<F = any> = {
  [K in keyof F]: any;
}

export function useFormValues<F = any>(initialValues: FormValues<F>) {
  const [formValues, setFormValues] = useState<FormValues<F>>(initialValues);

  return {
    formValues,
    resetFormValues: () => setFormValues(initialValues),
    resetInputValue: (name: string) => resetInputValue(name, setFormValues, initialValues),
    updateInputValue: (event: ChangeEvent<HTMLInputElement>) => updateInputValue(event, setFormValues),
    setInputValue: (name: string, value: any) => setFormValues(prevState => ({...prevState, [name]: value})),
  };
}
