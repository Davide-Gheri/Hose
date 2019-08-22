import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Button,
} from '@material-ui/core';
import { asArray, getEnvironments } from '../../store/environments';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { AppLink, ListItemLink } from '../common';
import { useThunkDispatch } from '../../store';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '../../hooks/error';

export interface EnvListProps {
  take?: number;
  filter?: any;
}

export const EnvList: React.FC<EnvListProps> = ({take, filter}) => {
  const { t } = useTranslation();
  const environments = useSelector(asArray);
  const loading = useSelector(getLoading('environments'));
  const dispatch = useThunkDispatch();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    dispatch(getEnvironments({take, ...filter})).catch(errorHandler);
  }, [dispatch, take, filter]);

  if (loading) {
    return <Loading minHeight={100}/>;
  }

  return (
    <List dense>
      {environments.length === 0 && (
        <ListItem>
          <ListItemText primary={t('environment:no_environments_set')}/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/environments/new">
              {t('common:create_new')}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {environments.map((env, i) => (
        <ListItemLink key={env.id} to={`/environments/${env.id}`} divider={i < environments.length - 1}>
          <ListItemText primary={env.title} secondary={env.board && env.board.id}/>
        </ListItemLink>
      ))}
    </List>
  );
};
