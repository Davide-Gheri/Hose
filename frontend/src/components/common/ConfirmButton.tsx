import React, { useCallback, useState } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export interface ConfirmButtonProps extends ButtonProps {
  confirmTitle?: string;
  confirmText?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = (
  {
    confirmTitle = 'Are you sure?',
    confirmButtonText = 'Ok',
    cancelButtonText = 'Cancel',
    confirmText,
    onClick,
    ...rest
  }) => {
  const [open, setOpen] = useState(false);

  const onButtonClick = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onConfirm = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(false);
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }, [onClick]);

  return (
    <>
      <Button {...rest} onClick={onButtonClick}/>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onClose}
        maxWidth="xs"
      >
        <DialogTitle>{confirmTitle}</DialogTitle>
        {confirmText && (
          <DialogContent>
            <DialogContentText>{confirmText}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={onClose}>{cancelButtonText}</Button>
          <Button onClick={onConfirm}>{confirmButtonText}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
};
