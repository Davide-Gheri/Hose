import React, { useCallback } from 'react';
import { BoardModel } from '../../store/models/board.model';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications/index';
import { IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';

export const DisabledDeleteButton = ({ board }: { board: BoardModel }) => {
    const { openNotification } = useNotifications();

    const onClick = useCallback(() => {
        openNotification({
            ...commonNotificationOpts,
            autoHide: 4000,
            text: 'Cannot delete a board associated with an Environment. You have to delete the Environment!',
        });
    }, []);

    return (
        <IconButton onClick={onClick} size="small">
            <DeleteForever />
        </IconButton>
    )
}