import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { EnvironmentForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';

export const NewEnvironmentDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    history.push('/environments');
    setOpen(false);
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('environment:add_new')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('environment:add_new_description')}
        </DialogContentText>
        <EnvironmentForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewEnvironmentDialog;
