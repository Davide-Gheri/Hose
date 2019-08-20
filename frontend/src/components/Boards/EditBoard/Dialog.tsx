import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { BoardForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { BoardModel } from '../../../store/models';
import { useTranslation } from 'react-i18next';

export type EditBoardDialogProps = RouteComponentProps & {board: BoardModel};

export const EditBoardDialog: React.FC<EditBoardDialogProps> = ({history, board}) => {
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
      <DialogTitle>{t('board:edit')}</DialogTitle>
      <DialogContent>
        <BoardForm onSubmit={onClose} onCancel={onClose} board={board}/>
      </DialogContent>
    </Dialog>
  );
};

export default EditBoardDialog;
