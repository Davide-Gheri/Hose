import React, { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { Button, CircularProgress, createStyles, DialogActions, makeStyles } from '@material-ui/core';
import { useFormErrors, useFormValues } from '../../hooks/form';
import { numeric, required } from '../../validations';
import { AppTextField, ConfirmButton } from '../common';
import { GpioModel } from '../../store/models';
import { createEnvironment, updateEnvironment } from '../../store/environments';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '../../store';

interface FormData {
  pin: string;
}

export interface GpioFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
  gpio?: GpioModel;
}

export const GpioForm: React.FC<GpioFormProps> = ({onSubmit, onCancel, gpio}) => {
  const classes = useStyles();
  const [submit, setSubmit] = useState(false);

  const {formValues, resetFormValues, updateInputValue} = useFormValues<FormData>({
    pin: '',
  });

  const {formErrors, validateInputValue, validateForm, clearFormErrors} = useFormErrors<FormData>({
    pin: [required, numeric],
  });

  const dispatch = useDispatch<ThunkDispatch<{}, {}, PayloadAction<any>>>();

  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement | any>) => {
    updateInputValue(event);
    validateInputValue(event);
  }, [updateInputValue, validateInputValue]);

  const onFormReset = useCallback(() => {
    resetFormValues();
    clearFormErrors();
  }, [resetFormValues, clearFormErrors]);

  const onFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    setSubmit(true);

    if (validateForm(formValues)) {
      let submitPromise: Promise<any>;
      if (gpio) {
        // submitPromise = dispatch(updateEnvironment(environment!.id, formValues)).then(() => {
        //   openNotification({
        //     ...commonNotificationOpts,
        //     text: 'Environment updated',
        //   });
        // });
      } else {
        // submitPromise = dispatch(createEnvironment(formValues)).then(() => {
        //   openNotification({
        //     ...commonNotificationOpts,
        //     text: 'Environment created',
        //   });
        // });
      }
      // submitPromise.then(() => {
      //   setSubmit(false);
      //   if (typeof onSubmit === 'function') {
      //     onSubmit(e);
      //   }
      // });
    }
  }, [validateForm, formValues, onSubmit]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormReset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormReset, onCancel]);

  return (
    <form noValidate>
      <fieldset disabled={submit}>
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.pin}
          name="pin"
          label="Pin"
          errors={formErrors.pin}
          onChange={onInputChange}
          fullWidth
        />
      </fieldset>
      <DialogActions>
        {gpio && (
          <ConfirmButton color="secondary" className={classes.deleteBtn} disabled={submit}>
            Delete
          </ConfirmButton>
        )}
        <Button color="primary" onClick={onFormCancel} disabled={submit}>
          Cancel
        </Button>
        <div className={classes.confirmButtonWrapper}>
          <Button color="primary" onClick={onFormSubmit} disabled={submit}>
            Submit
          </Button>
          {submit && <CircularProgress size={24} className={classes.confirmButtonLoader}/>}
        </div>
      </DialogActions>
    </form>
  )
};

const useStyles = makeStyles(theme => createStyles({
  form: {
    position: 'relative',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  deleteBtn: {
    marginRight: 'auto',
  },
  confirmButtonWrapper: {
    position: 'relative',
  },
  confirmButtonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));
