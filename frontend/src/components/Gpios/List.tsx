import React, { useCallback, useEffect } from 'react';
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { AppLink, ConfirmButton, ListItemLink } from '../common';
import { useSelector } from 'react-redux';
import { asArray, deleteGpio, getGpios } from '../../store/gpios';
import { getLoadingError } from '../../store/selectors';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';

export interface GpioListProps {
  take?: number;
}

export const GpioList: React.FC<GpioListProps> = ({take}) => {
  const gpios = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('gpios'));

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();

  useEffect(() => {
    dispatch(getGpios({take})).catch(console.error);
  }, [dispatch]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteGpio(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: 'GPIO deleted',
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
      {gpios.length === 0 && (
        <ListItem>
          <ListItemText primary="No GPIOs set"/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/gpios/new">
              Create new
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {gpios.map((gpio, i) => (
        <ListItem key={gpio.id} divider={i < gpios.length - 1}>
          <ListItemText
            primary={`Pin ${gpio.pin}`}
            secondary={gpio.environments.length ? gpio.environments.map(env => env.title).join(', ') : 'No associated environments'}
          />
          <ListItemSecondaryAction>
            <ConfirmButton
              renderButton={props => <IconButton {...props}/>}
              onClick={() => onDelete(gpio.id)}
            >
              <DeleteForever/>
            </ConfirmButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
};
