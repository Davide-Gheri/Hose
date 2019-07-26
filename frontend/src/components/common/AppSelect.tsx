import React, { useEffect, useMemo, useRef } from 'react';
import { FormControl, FormHelperText, InputLabel, Select } from '@material-ui/core';
import { SelectProps } from '@material-ui/core/Select';
import { OutlinedInput, FilledInput, Input } from '@material-ui/core';

export type AppSelectProps = SelectProps & {
  errors?: string[];
  label?: string;
  fullWidth?: boolean;
};

export const AppSelect = React.forwardRef<HTMLSelectElement, AppSelectProps>(({error, errors, id, label, variant, inputProps, fullWidth, ...rest}, ref) => {
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  const SelectInput: any = useMemo(() => {
    switch (variant) {
      case 'filled':
        return FilledInput;
      case 'outlined':
        return OutlinedInput;
      case 'standard':
        return Input;
    }
  }, [variant]);

  return (
    <FormControl variant={variant} fullWidth={fullWidth}>
      {label && <InputLabel ref={inputLabel} htmlFor={id}>{label}</InputLabel>}
      <Select
        innerRef={ref}
        id={id}
        error={(errors && errors.length > 0)}
        input={<SelectInput labelWidth={labelWidth} {...inputProps}/>}
        {...rest}
      />
      {errors && errors.length > 0 && <FormHelperText>{errors[0]}</FormHelperText>}
    </FormControl>
  )
});
