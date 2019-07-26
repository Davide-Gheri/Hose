import React, { ChangeEvent, SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { FormValidations, useFormErrors, useFormValues } from '../../../hooks/form';
import { alpha, makeMaxLength, required } from '../../../validations';
import { AppTextField } from '../../common/AppTextField';
import { createStyles, makeStyles, Button, DialogActions, Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { asArray, getRules } from '../../../store/rules';
import { getLoading } from '../../../store/selectors';
import { OverlayLoading } from '../../Loading';
import { AppSelect } from '../../common/AppSelect';

interface FormData {
  title: string;
  description: string;
  boardId: string;
  rule: string;
  gpios: string[];
}

export interface NewEnvironmentFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
}

export const NewEnvironmentForm: React.FC<NewEnvironmentFormProps> = ({onSubmit, onCancel}) => {
  const classes = useStyles();

  const {
    formValues,
    updateInputValue,
    resetFormValues,
  } = useFormValues<FormData>({
    title: '',
    description: '',
    boardId: '',
    rule: '',
    gpios: [],
  });

  const formValidations = useMemo<FormValidations<Omit<FormData, 'gpios'>>>(() => ({
    title: [required, alpha, makeMaxLength(255)],
    description: [alpha, makeMaxLength(255)],
    boardId: [required, alpha, makeMaxLength(255)],
    rule: [alpha],
  }), []);

  const {
    formErrors,
    validateForm,
    validateInputValue,
    clearFormErrors,
  } = useFormErrors<Omit<FormData, 'gpios'>>(formValidations);

  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement | any>) => {
    updateInputValue(event);
    validateInputValue(event);
  }, [updateInputValue, validateInputValue]);

  const onFormreset = useCallback(() => {
    resetFormValues();
    clearFormErrors();
  }, [resetFormValues, clearFormErrors]);

  const onFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    console.log(validateForm(formValues));
    if (validateForm(formValues)) {
      console.log('Form is valid');
      if (typeof onSubmit === 'function') {
        onSubmit(e);
      }
    }
  }, [validateForm, formValues]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormreset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormreset, onCancel]);

  const rules = useSelector(asArray);
  const loading = useSelector(getLoading('rules'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRules());
  }, []);

  return (
    <form onSubmit={onSubmit} noValidate>
      {loading && <OverlayLoading/>}
      <AppTextField
        className={classes.textField}
        variant="outlined"
        value={formValues.title}
        name="title"
        label="Title"
        errors={formErrors.title}
        onChange={onInputChange}
        fullWidth
      />
      <AppTextField
        className={classes.textField}
        variant="outlined"
        value={formValues.description}
        name="description"
        label="Description"
        errors={formErrors.description}
        onChange={onInputChange}
        fullWidth
      />
      <AppTextField
        className={classes.textField}
        variant="outlined"
        value={formValues.boardId}
        name="boardId"
        label="Board id"
        errors={formErrors.boardId}
        onChange={onInputChange}
        fullWidth
      />
      <AppSelect
        variant="outlined"
        value={formValues.rule}
        onChange={onInputChange}
        label="Rule"
        id="ruleSelect"
        fullWidth
        inputProps={{
          name: 'rule',
        }}
      >
        <MenuItem value="">Select a rule</MenuItem>
        {rules.map(rule => (
          <MenuItem key={rule.id} value={rule.id}>{rule.title} ({rule.minHumidity})</MenuItem>
        ))}
      </AppSelect>
      <DialogActions>
        <Button color="primary" onClick={onFormCancel}>
          Cancel
        </Button>
        <Button color="primary" onClick={onFormSubmit}>
          Submit
        </Button>
      </DialogActions>
    </form>
  );
};

const useStyles = makeStyles(theme => createStyles({
  form: {
    position: 'relative',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));
