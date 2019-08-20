import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { BoardForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';

export const NewBoardDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    history.push('/boards');
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('board:add_new')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('board:add_new_description')}
        </DialogContentText>
        <BoardForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewBoardDialog;
