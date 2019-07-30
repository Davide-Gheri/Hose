import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { EnvironmentForm } from '../Form';
import { RouteComponentProps } from 'react-router';
import { EnvironmentModel } from '../../../store/models';

export type EditEnvironmentDialogProps = RouteComponentProps & {environment: EnvironmentModel};

export const EditEnvironmentDialog: React.FC<EditEnvironmentDialogProps> = ({history, environment}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    history.push(`/environments/${environment.id}`);
    setOpen(false);
  }, [history, environment]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Environment</DialogTitle>
      <DialogContent>
        <EnvironmentForm onSubmit={onClose} onCancel={onClose} environment={environment}/>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnvironmentDialog;
