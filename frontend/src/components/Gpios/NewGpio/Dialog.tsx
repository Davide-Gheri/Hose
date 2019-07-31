import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { GpioForm } from '../Form';
import { RouteComponentProps } from 'react-router';

export const NewGpioDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    history.push('/gpios');
    setOpen(false);
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a new GPIO</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Register a new GPIO pin of the Raspberry Pi
        </DialogContentText>
        <GpioForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewGpioDialog;
