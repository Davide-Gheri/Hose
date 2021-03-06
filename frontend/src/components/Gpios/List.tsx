import React, { useCallback, useEffect } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { AppLink, ConfirmButton } from '../common';
import { useSelector } from 'react-redux';
import { asArray, deleteGpio, getGpios } from '../../store/gpios';
import { getLoadingError } from '../../store/selectors';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { useThunkDispatch } from '../../store';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { useErrorHandler } from '../../hooks/error';
import { useTranslation } from 'react-i18next';

export interface GpioListProps {
  take?: number;
}

export const GpioList: React.FC<GpioListProps> = ({take}) => {
  const { t } = useTranslation();
  const gpios = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('gpios'));

  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    dispatch(getGpios({take})).catch(errorHandler);
  }, [take]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteGpio(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('gpio:deleted'),
        });
      }).catch(errorHandler);
  }, [t]);

  if (loading) {
    return <Loading minHeight={100}/>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <List dense>
      {gpios.length === 0 && (
        <ListItem>
          <ListItemText primary={t('gpio:no_gpio_set')}/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/gpios/new">
              {t('common:create_new')}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {gpios.map((gpio, i) => (
        <ListItem key={gpio.id} divider={i < gpios.length - 1}>
          <ListItemText
            primary={`${t('gpio:pin')} ${gpio.pin}`}
            secondary={gpio.environments ? gpio.environments.length ? gpio.environments.map(env => env.title).join(', ') : t('gpio:no_associated_environments') : t('gpio:no_associated_environments')}
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
