import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { EnvironmentForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { EnvironmentModel } from '../../../store/models';
import { useTranslation } from 'react-i18next';

export type EditEnvironmentDialogProps = RouteComponentProps & {environment: EnvironmentModel};

export const EditEnvironmentDialog: React.FC<EditEnvironmentDialogProps> = ({history, environment}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    history.push(`/environments/${environment.id}`);
  }, [history, environment]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('environment:edit')}</DialogTitle>
      <DialogContent>
        <EnvironmentForm onSubmit={onClose} onCancel={onClose} environment={environment}/>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnvironmentDialog;
