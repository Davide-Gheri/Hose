import React, { useCallback, useEffect } from 'react';
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, IconButton } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { AppLink, ConfirmButton, ListItemLink } from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { asArray, deleteGpio, getGpios } from '../../store/gpios';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';

export interface GpioListProps {
  take?: number;
}

export const GpioList: React.FC<GpioListProps> = ({take}) => {
  const gpios = useSelector(asArray);
  const loading = useSelector(getLoading('gpios'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGpios({take}));
  }, [dispatch]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteGpio(id));
  }, [dispatch]);

  if (loading) {
    return <Loading/>;
  }

  console.log(gpios);

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
        <ListItemLink key={gpio.id} to={`/gpios/${gpio.id}`} divider={i < gpios.length - 1}>
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
        </ListItemLink>
      ))}
    </List>
  )
};
