import React, { ChangeEvent, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormValidations, useFormErrors, useFormValues, useFormStyles, safeValue } from '../../hooks/form';
import { alpha, array, makeMaxLength, numeric, required } from '../../validations';
import { Button, DialogActions, MenuItem, CircularProgress, Chip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { asArray as rulesAsArray, getRules } from '../../store/rules';
import { asArray as gpiosAsArray, getGpios } from '../../store/gpios';
import { asArray as boardsAsArray } from '../../store/boards';
import { getLoading } from '../../store/selectors';
import { OverlayLoading } from '../Loading';
import { AppSelect, AppTextField, ConfirmButton } from '../common';
import { EnvironmentModel } from '../../store/models';
import { createEnvironment, deleteEnvironment, updateEnvironment } from '../../store/environments';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { getBoards } from '../../store/boards';
import { boardCheckingMessage } from '../../lib/messages';
import { useTranslation } from 'react-i18next';

interface FormData {
  title: string;
  description: string;
  board: string;
  rule: string;
  gpios: string[];
}

export interface EnvironmentFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
  environment?: EnvironmentModel;
}

export const EnvironmentForm: React.FC<EnvironmentFormProps> = ({onSubmit, onCancel, environment}) => {
  const classes = useFormStyles();
  const { t } = useTranslation();
  const [submit, setSubmit] = useState(false);

  const {
    formValues,
    updateInputValue,
    resetFormValues,
  } = useFormValues<FormData>({
    title: safeValue(environment, 'title'),
    description: safeValue(environment, 'description'),
    board: (environment && environment.board) ? environment.board.id : '',
    rule: safeValue(environment, 'rule'),
    gpios: environment ? environment.gpios.map(gpio => gpio.pin) : [],
  });

  const formValidations = useMemo<FormValidations<FormData>>(() => ({
    title: [required, alpha, makeMaxLength(255)],
    description: [alpha, makeMaxLength(255)],
    board: [alpha, makeMaxLength(255)],
    rule: [alpha],
    gpios: [array(numeric)],
  }), []);

  const {
    formErrors,
    validateForm,
    validateInputValue,
    clearFormErrors,
  } = useFormErrors<FormData>(formValidations);

  const rules = useSelector(rulesAsArray);
  const gpios = useSelector(gpiosAsArray);
  const boards = useSelector(boardsAsArray);
  const rulesLoading = useSelector(getLoading('rules'));
  const gpiosLoading = useSelector(getLoading('gpios'));
  const boardsLoading = useSelector(getLoading('boards'));
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
      if (environment) {
        submitPromise = dispatch(updateEnvironment(environment!.id, formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('environment:updated'),
          });
        });
      } else {
        submitPromise = dispatch(createEnvironment(formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('environment:created'),
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
  }, [validateForm, formValues, onSubmit, environment, t]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormReset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormReset, onCancel]);

  const onDelete = useCallback(() => {
    if (environment) {
      dispatch(deleteEnvironment(environment.id))
        .then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('environment:deleted'),
          })
        })
    }
  }, [environment, t, openNotification]);

  useEffect(() => {
    dispatch(getRules()).catch(console.error);
    dispatch(getGpios()).catch(console.error);
    dispatch(getBoards()).catch(console.error);
  }, []);

  return (
    <form onSubmit={onSubmit} noValidate>
      {(rulesLoading || gpiosLoading || boardsLoading) && <OverlayLoading/>}
      <fieldset disabled={submit}>
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.title}
          name="title"
          label={t('environment:title')}
          errors={formErrors.title}
          onChange={onInputChange}
          fullWidth
        />
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.description}
          name="description"
          label={t('environment:description')}
          errors={formErrors.description}
          onChange={onInputChange}
          fullWidth
          multiline
          rowsMax="4"
        />
        <AppSelect
          className={classes.textField}
          variant="outlined"
          value={formValues.board}
          onChange={onInputChange}
          label={t('board:board')}
          id="boardSelect"
          fullWidth
          inputProps={{
            name: 'board',
          }}
        >
          <MenuItem value="">Select a board</MenuItem>
          {boards.map(board => (
            <MenuItem key={board.id} value={board.id}>{board.id} ({boardCheckingMessage(board)})</MenuItem>
          ))}
        </AppSelect>
        <AppSelect
          className={classes.textField}
          variant="outlined"
          value={formValues.rule}
          onChange={onInputChange}
          label={t('rule:rule')}
          id="ruleSelect"
          fullWidth
          inputProps={{
            name: 'rule',
          }}
        >
          <MenuItem value="">{t('environment:select_rule')}</MenuItem>
          {rules.map(rule => (
            <MenuItem key={rule.id} value={rule.id}>{rule.title} ({rule.minHumidity})</MenuItem>
          ))}
        </AppSelect>
        <AppSelect
          multiple
          className={classes.textField}
          variant="outlined"
          value={formValues.gpios}
          onChange={onInputChange}
          label={t('gpio:gpio', {count: 100})}
          id="gpiosSelect"
          fullWidth
          inputProps={{
            name: 'gpios',
          }}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip}/>
              ))}
            </div>
          )}
        >
          {gpios.map(gpio => (
            <MenuItem key={gpio.id} value={gpio.pin}>{gpio.pin}</MenuItem>
          ))}
        </AppSelect>
        <br/>
        <br/>
      </fieldset>
      <DialogActions>
        {environment && (
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
