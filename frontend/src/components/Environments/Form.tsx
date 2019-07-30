import React, { ChangeEvent, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormValidations, useFormErrors, useFormValues } from '../../hooks/form';
import { alpha, array, makeMaxLength, numeric, required } from '../../validations';
import { createStyles, makeStyles, Button, DialogActions, MenuItem, CircularProgress, Chip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { asArray as rulesAsArray, getRules } from '../../store/rules';
import { asArray as gpiosAsArray, getGpios } from '../../store/gpios';
import { getLoading } from '../../store/selectors';
import { OverlayLoading } from '../Loading';
import { AppSelect, AppTextField, ConfirmButton } from '../common';
import { EnvironmentModel } from '../../store/models';
import { createEnvironment, updateEnvironment } from '../../store/environments';
import { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '../../store';
import { Message, useNotifications } from '../../contexts/Notifications';

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
  environment?: EnvironmentModel;
}

const safeValue = (env: any, field: any, def: any = ''): any => env ? typeof env[field] === 'string' ? env[field] : env[field].id || def : def;

const commonNotificationOpts: Partial<Message> = {
  horizontal: 'left',
  vertical: 'bottom',
  autoHide: 2000,
};

export const EnvironmentForm: React.FC<NewEnvironmentFormProps> = ({onSubmit, onCancel, environment}) => {
  const classes = useStyles();

  const [submit, setSubmit] = useState(false);

  const {
    formValues,
    updateInputValue,
    resetFormValues,
  } = useFormValues<FormData>({
    title: safeValue(environment, 'title'),
    description: safeValue(environment, 'description'),
    boardId: safeValue(environment, 'boardId'),
    rule: safeValue(environment, 'rule'),
    gpios: environment ? environment.gpios.map(gpio => gpio.pin) : [],
  });

  const formValidations = useMemo<FormValidations<Omit<FormData, ''>>>(() => ({
    title: [required, alpha, makeMaxLength(255)],
    description: [alpha, makeMaxLength(255)],
    boardId: [required, alpha, makeMaxLength(255)],
    rule: [alpha],
    gpios: [array(numeric)],
  }), []);

  const {
    formErrors,
    validateForm,
    validateInputValue,
    clearFormErrors,
  } = useFormErrors<Omit<FormData, ''>>(formValidations);

  const rules = useSelector(rulesAsArray);
  const gpios = useSelector(gpiosAsArray);
  const rulesLoading = useSelector(getLoading('rules'));
  const gpiosLoading = useSelector(getLoading('gpios'));
  const dispatch = useDispatch<ThunkDispatch<{}, {}, PayloadAction<any>>>();

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
            text: 'Environment updated',
          });
        });
      } else {
        submitPromise = dispatch(createEnvironment(formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: 'Environment created',
          });
        });
      }
      submitPromise.then(() => {
        setSubmit(false);
        if (typeof onSubmit === 'function') {
          onSubmit(e);
        }
      });
    }
  }, [validateForm, formValues, onSubmit, environment]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormReset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormReset, onCancel]);

  useEffect(() => {
    dispatch(getRules());
    dispatch(getGpios());
  }, [dispatch]);

  return (
    <form onSubmit={onSubmit} noValidate>
      {(rulesLoading || gpiosLoading) && <OverlayLoading/>}
      <fieldset disabled={submit}>
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
          multiline
          rowsMax="4"
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
          className={classes.textField}
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
        <AppSelect
          multiple
          className={classes.textField}
          variant="outlined"
          value={formValues.gpios}
          onChange={onInputChange}
          label="Gpios"
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
  );
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
