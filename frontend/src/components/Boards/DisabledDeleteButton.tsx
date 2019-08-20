import React, { useCallback } from 'react';
import { BoardModel } from '../../store/models/board.model';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications/index';
import { IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

export const DisabledDeleteButton = ({ board }: { board: BoardModel }) => {
    const { openNotification } = useNotifications();
    const { t } = useTranslation();

    const onClick = useCallback(() => {
        openNotification({
            ...commonNotificationOpts,
            autoHide: 4000,
            text: t('board:cannot_delete'),
        });
    }, []);

    return (
        <IconButton onClick={onClick} size="small">
            <DeleteForever />
        </IconButton>
    )
}