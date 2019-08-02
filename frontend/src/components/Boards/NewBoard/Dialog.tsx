import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { BoardForm } from '../Form';
import { RouteComponentProps } from 'react-router';

export const NewBoardDialog: React.FC<RouteComponentProps> = ({history}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    history.push('/boards');
  }, [history]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a new Board</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Register a new sensor board
          <br/>
          Find the board id on the sensor.
          <br/>
          Optionally (recommended) add the board IP to enable board health check
        </DialogContentText>
        <BoardForm onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default NewBoardDialog;
