import React, { ChangeEvent, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FormValidations, useFormErrors, useFormValues, useFormStyles, safeValue } from '../../hooks/form';
import { alpha, makeMaxLength, numeric, required } from '../../validations';
import { Button, DialogActions, CircularProgress } from '@material-ui/core';
import { AppTextField, ConfirmButton } from '../common';
import { RuleModel } from '../../store/models';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { useTranslation } from 'react-i18next';
import { createRule, deleteRule, updateRule } from '../../store/rules';

interface FormData {
  title: string;
  minHumidity: number;
  wateringSeconds: number;
}

export interface RuleFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
  rule?: RuleModel;
}

export const RuleForm: React.FC<RuleFormProps> = ({onSubmit, onCancel, rule}) => {
  const classes = useFormStyles();
  const { t } = useTranslation();
  const [submit, setSubmit] = useState(false);

  const {
    formValues,
    updateInputValue,
    resetFormValues,
  } = useFormValues<FormData>({
    title: safeValue(rule, 'title'),
    minHumidity: safeValue(rule, 'minHumidity'),
    wateringSeconds: safeValue(rule, 'wateringSeconds'),
  });

  const formValidations = useMemo<FormValidations<FormData>>(() => ({
    title: [required, alpha, makeMaxLength(255)],
    minHumidity: [required, numeric],
    wateringSeconds: [required, numeric],
  }), []);

  const {
    formErrors,
    validateForm,
    validateInputValue,
    clearFormErrors,
  } = useFormErrors<FormData>(formValidations);

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();

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
      if (rule) {
        submitPromise = dispatch(updateRule(rule!.id, formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('rule:updated'),
          });
        });
      } else {
        submitPromise = dispatch(createRule(formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('rule:created'),
          });
        });
      }
      submitPromise.then(() => {
        setSubmit(false);
        if (typeof onSubmit === 'function') {
          onSubmit(e);
        }
      }).catch(console.error); //TODO show errors
    }
  }, [validateForm, formValues, onSubmit, rule, t]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormReset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormReset, onCancel]);

  const onDelete = useCallback(() => {
    if (rule) {
      dispatch(deleteRule(rule.id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('rule:deleted'),
        })
      })
    }
  }, [rule, t]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset disabled={submit}>
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.title}
          name="title"
          label={t('rule:title')}
          errors={formErrors.title}
          onChange={onInputChange}
          fullWidth
        />
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.minHumidity}
          name="minHumidity"
          label={t('rule:minHumidity')}
          errors={formErrors.minHumidity}
          onChange={onInputChange}
          fullWidth
          type="number"
        />
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.wateringSeconds}
          name="wateringSeconds"
          label={t('rule:wateringSeconds')}
          errors={formErrors.wateringSeconds}
          onChange={onInputChange}
          fullWidth
          type="number"
        />
      </fieldset>
      <DialogActions>
        {rule && rule.environmentIds.length === 0 && (
          <ConfirmButton
            color="secondary"
            className={classes.deleteBtn}
            disabled={submit}
            onClick={onDelete}
          >
            {t('common:delete')}
          </ConfirmButton>
        )}
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
  );
};
