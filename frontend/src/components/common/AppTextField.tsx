import React from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';

export type AppTextFieldProps = TextFieldProps & {
  errors?: string[];
};

export const AppTextField = React.forwardRef<HTMLInputElement, AppTextFieldProps>(({helperText, error, errors, ...rest}, ref) => {
  return (
    <TextField
      innerRef={ref}
      error={(errors && errors.length > 0)}
      helperText={errors && errors.length > 0 && errors[0]}
      {...rest}
    />
  )
});
