import React, { ChangeEvent, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { BoardModel } from '../../store/models';
import { Button, CircularProgress, DialogActions } from '@material-ui/core';
import { useFormValues, useFormErrors, useFormStyles, safeValue, FormValidations } from '../../hooks/form';
import { isUrl, makeMaxLength, required } from '../../validations';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { AppTextField, ConfirmButton } from '../common';
import { createBoard, deleteBoard, updateBoard } from '../../store/boards';
import { useTranslation } from 'react-i18next';
import { useRouter } from '../../hooks/router';

interface FormData {
  id: string;
  checkUrl: string;
}

export interface BoardFormProps {
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
  board?: BoardModel;
}

export const BoardForm: React.FC<BoardFormProps> = ({onSubmit, onCancel, board}) => {
  const classes = useFormStyles();
  const { t } = useTranslation();
  const { history } = useRouter();

  const [submit, setSubmit] = useState(false);

  const {
    formValues,
    updateInputValue,
    resetFormValues,
  } = useFormValues<FormData>({
    id: safeValue(board, 'id'),
    checkUrl: safeValue(board, 'checkUrl'),
  });

  const formValidations = useMemo<FormValidations<FormData>>(() => ({
    id: [required, makeMaxLength(255)],
    checkUrl: [makeMaxLength(255), isUrl],
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
      if (board) {
        submitPromise = dispatch(updateBoard(board!.id, formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('board:updated'),
          });
        });
      } else {
        submitPromise = dispatch(createBoard(formValues)).then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('board:created'),
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
  }, [validateForm, formValues, onSubmit, board, t]);

  const onDelete = useCallback(() => {
    if (board) {
      dispatch(deleteBoard(board.id))
        .then(() => {
          openNotification({
            ...commonNotificationOpts,
            text: t('board:deleted'),
          });
          history.replace('/boards');
        });
    }
  }, [board]);

  const onFormCancel = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    onFormReset();
    if (typeof onCancel === 'function') {
      onCancel(e);
    }
  }, [onFormReset, onCancel]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset disabled={submit}>
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.id}
          name="id"
          label={t("board:id")}
          errors={formErrors.id}
          onChange={onInputChange}
          fullWidth
        />
        <AppTextField
          className={classes.textField}
          variant="outlined"
          value={formValues.checkUrl}
          name="checkUrl"
          label={t("board:ip")}
          errors={formErrors.checkUrl}
          onChange={onInputChange}
          fullWidth
        />
      </fieldset>
      <DialogActions>
        {board && (
          <ConfirmButton
            color="secondary"
            className={classes.deleteBtn}
            disabled={submit}
            onClick={onDelete}
          >
            {t("common:delete")}
          </ConfirmButton>
        )}
        <Button color="primary" onClick={onFormCancel} disabled={submit}>
          {t('common:cancel')}
        </Button>
        <div className={classes.confirmButtonWrapper}>
          <Button color="primary" onClick={onFormSubmit} disabled={submit}>
            {t('common:submit')}
          </Button>
          {submit && (
            <CircularProgress
              size={24}
              className={classes.confirmButtonLoader}
            />
          )}
        </div>
      </DialogActions>
    </form>
  );
};
