import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { asArray, deleteBoard, getBoards } from '../../store/boards';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Link } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { boardCheckingMessage } from '../../lib/messages';
import { AppLink, ConfirmButton, DisabledDeleteButton } from '../common';
import { formatDate } from '../../lib/dates';
import { useErrorHandler } from '../../hooks/error';
import { useTranslation } from 'react-i18next';

export interface BoardTableProps {
  take?: number;
}

export const BoardTable: React.FC<BoardTableProps> = ({take}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const boards = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('boards'));

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    dispatch(getBoards({take})).catch(errorHandler);
  }, [dispatch, take]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteBoard(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('board:deleted'),
        });
      }).catch(errorHandler);
  }, [t, dispatch, openNotification]);

  if (loading) {
    return <Loading minHeight={100}/>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>{t('board:id')}</TableCell>
          <TableCell>{t('board:healthcheck')}</TableCell>
          <TableCell>{t('board:last_check')}</TableCell>
          <TableCell>{t('common:delete')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {boards.map(board => (
          <TableRow key={board.id} hover>
            <TableCell component="th" scope="row">
              <Link component={AppLink} to={`/boards/${board.id}`}>{board.id}</Link>
            </TableCell>
            <TableCell>
              {boardCheckingMessage(board)}
            </TableCell>
            <TableCell>
              {formatDate(board.lastCheckedAt) || t('common:never')}
            </TableCell>
            <TableCell>
              {!!board.environmentId ? (
                <DisabledDeleteButton text={t('board:cannot_delete')}/>
              ) : (
                <ConfirmButton
                  size="small"
                  onClick={() => onDelete(board.id)}
                  renderButton={props => <IconButton {...props}/>}>
                  <DeleteForever/>
                </ConfirmButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

const useStyles = makeStyles(theme => createStyles({
  table: {},
  errorCell: {
    color: theme.palette.error.main,
  },
}));
