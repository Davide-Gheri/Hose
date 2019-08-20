import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { asArray, getBoards, deleteBoard } from '../../store/boards';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, createStyles } from '@material-ui/core';
import { AppLink, ConfirmButton, ListItemLink } from '../common';
import { DeleteForever } from '@material-ui/icons';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { DisabledDeleteButton } from './DisabledDeleteButton';
import { useTranslation } from 'react-i18next';

export interface BoardListProps {
  take?: number;
}

export const BoardList: React.FC<BoardListProps> = ({take}) => {
  const classes = useStyles();
  const { t } = useTranslation();
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
          text: t('board:deleted'),
        });
      });
  }, [dispatch, t]);

  if (loading) {
    return <div className={classes.loading}><Loading/></div>;
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
            {!!board.environment ? 
              <DisabledDeleteButton board={board}/> :
              <ConfirmButton
                renderButton={props => <IconButton {...props}/>}
                onClick={() => onDelete(board.id)}
              >
                <DeleteForever/>
              </ConfirmButton>
            }
          </ListItemSecondaryAction>
        </ListItemLink>
      ))}
    </List>
  )
}

const useStyles = makeStyles(theme => createStyles({
  loading: {
    width: '100%',
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
  },
}));