import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { NewEnvironmentForm } from './Form';
import { RouteComponentProps } from 'react-router';

export const NewEnvironmentDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    history.push('/environments');
    setOpen(false);
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a new Environment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a new Environment associated with 1 moisture sensor board.
          <br/>
          Add a Rule and 1 or more GPIO pins to activate auto irrigation
        </DialogContentText>
        <NewEnvironmentForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewEnvironmentDialog;
