import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { asArray, getBoards, deleteBoard } from '../../store/boards';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { AppLink, ConfirmButton, ListItemLink } from '../common';
import { DeleteForever } from '@material-ui/icons';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';

export interface BoardListProps {
  take?: number;
}

export const BoardList: React.FC<BoardListProps> = ({take}) => {
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
      });
  }, [dispatch]);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <List dense>
      {boards.length === 0 && (
        <ListItem>
          <ListItemText primary="No Boards set"/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/boards/new">
              Create new
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {boards.map((board, i) => (
        <ListItemLink key={board.id} to={`/boards/${board.id}`} divider={i < boards.length - 1}>
          <ListItemText
            primary={`${board.id}`}
          />
          <ListItemSecondaryAction>
            <ConfirmButton
              renderButton={props => <IconButton {...props}/>}
              onClick={() => onDelete(board.id)}
            >
              <DeleteForever/>
            </ConfirmButton>
          </ListItemSecondaryAction>
        </ListItemLink>
      ))}
    </List>
  )
}