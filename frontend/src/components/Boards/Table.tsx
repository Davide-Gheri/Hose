import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format, isDate } from 'date-fns';
import { asArray, deleteBoard, getBoards } from '../../store/boards';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { boardCheckingMessage } from '../../lib/messages';
import { AppLink, ConfirmButton } from '../common';
import { formatDate } from '../../lib/dates';

export interface BoardTableProps {
  take?: number;
}

export const BoardTable: React.FC<BoardTableProps> = ({take}) => {
  const classes = useStyles();
  const boards = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('boards'));

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();

  useEffect(() => {
    dispatch(getBoards({take})).catch(console.error);
  }, [dispatch]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteBoard(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: 'Board deleted',
        });
      })
  }, []);

  if (loading) {
    return <div className={classes.root}><Loading/></div>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Healthcheck</TableCell>
            <TableCell>Last check</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.map(board => (
            <TableRow key={board.id} hover>
              <TableCell component="th" scope="row">
                <AppLink to={`/boards/${board.id}`}>{board.id}</AppLink>
              </TableCell>
              <TableCell>
                {boardCheckingMessage(board)}
              </TableCell>
              <TableCell>
                {formatDate(board.lastCheckedAt) || 'Never'}
              </TableCell>
              <TableCell>
                <ConfirmButton
                  size="small"
                  onClick={() => onDelete(board.id)}
                  renderButton={props => <IconButton {...props}/>}>
                  <DeleteForever/>
                </ConfirmButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    width: '100%',
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  table: {},
  errorCell: {
    color: theme.palette.error.main,
  },
}));
