import React, { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { Button, CircularProgress, createStyles, DialogActions, makeStyles } from '@material-ui/core';
import { useFormErrors, useFormValues } from '../../hooks/form';
import { numeric, required } from '../../validations';
import { AppTextField } from '../common';
import { useThunkDispatch } from '../../store';
import { createGpio } from '../../store/gpios';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { useTranslation } from 'react-i18next';

interface FormData {
  pin: string;
}

export interface GpioFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
}

export const GpioForm: React.FC<GpioFormProps> = ({onSubmit, onCancel}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [submit, setSubmit] = useState(false);

  const {formValues, resetFormValues, updateInputValue} = useFormValues<FormData>({
    pin: '',
  });

  const {formErrors, validateInputValue, validateForm, clearFormErrors} = useFormErrors<FormData>({
    pin: [required, numeric],
  });

  const dispatch = useThunkDispatch();

  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement | any>) => {
    updateInputValue(event);
    validateInputValue(event);
  }, [updateInputValue, validateInputValue]);

  const onFormReset = useCallback(() => {
    resetFormValues();
    clearFormErrors();
  }, [resetFormValues, clearFormErrors]);

  const { openNotification } = useNotifications();

  const onFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    setSubmit(true);

    if (validateForm(formValues)) {
      dispatch(createGpio({
        ...formValues,
        pin: parseInt(formValues.pin, 10),
      })).then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('gpio:created'),
        });
        setSubmit(false);
        if (typeof onSubmit === 'function') {
          onSubmit(e);
        }
      }).catch(console.error) // TODO show errors
        .finally(() => setSubmit(false));
    }
  }, [validateForm, formValues, onSubmit, t]);

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
          label={t('gpio:pin')}
          errors={formErrors.pin}
          onChange={onInputChange}
          fullWidth
        />
      </fieldset>
      <DialogActions>
        <Button color="primary" onClick={onFormCancel} disabled={submit}>
          {t('common:cancel')}
        </Button>
        <div className={classes.confirmButtonWrapper}>
          <Button color="primary" onClick={onFormSubmit} disabled={submit}>
            {t('common:submit')}
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
}));
