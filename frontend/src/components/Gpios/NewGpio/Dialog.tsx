import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { GpioForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';

export const NewGpioDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    history.push('/gpios');
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('gpio:add_new')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('gpio:add_new_description')}
        </DialogContentText>
        <GpioForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewGpioDialog;
