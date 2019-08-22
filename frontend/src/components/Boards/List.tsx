import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { asArray, getBoards, deleteBoard } from '../../store/boards';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, createStyles } from '@material-ui/core';
import { AppLink, ConfirmButton, ListItemLink, DisabledDeleteButton } from '../common';
import { DeleteForever } from '@material-ui/icons';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '../../hooks';

export interface BoardListProps {
  take?: number;
}

export const BoardList: React.FC<BoardListProps> = ({take}) => {
  const { t } = useTranslation();
  const boards = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('boards'));
  const handleError = useErrorHandler();

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();

  useEffect(() => {
    dispatch(getBoards({take})).catch(handleError);
  }, []);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteBoard(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('board:deleted'),
        });
      });
  }, [t]);

  if (loading) {
    return <Loading minHeight={100}/>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <List dense>
      {boards.length === 0 && (
        <ListItem>
          <ListItemText primary={t('board:no_boards_set')}/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/boards/new">
              {t('common:create_new')}
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
            {!!board.environmentId ? (
                <DisabledDeleteButton text={t('board:cannot_delete')}/>
              ) : (
              <ConfirmButton
                size="small"
                renderButton={props => <IconButton {...props}/>}
                onClick={() => onDelete(board.id)}
              >
                <DeleteForever/>
              </ConfirmButton>
            )}
          </ListItemSecondaryAction>
        </ListItemLink>
      ))}
    </List>
  )
};
