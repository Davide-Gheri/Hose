import React, { useCallback } from 'react';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';

export interface DisabledDeleteButtonProps {
  text: string;
}

export const DisabledDeleteButton: React.FC<DisabledDeleteButtonProps> = ({text}) => {
  const { openNotification } = useNotifications();

  const onClick = useCallback(() => {
    openNotification({
      ...commonNotificationOpts,
      autoHide: 4000,
      text,
    });
  }, []);

  return (
    <IconButton onClick={onClick} size="small">
      <DeleteForever />
    </IconButton>
  )
};
