import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemSecondaryAction, ListItemText, Button } from '@material-ui/core';
import { asArray, getEnvironments } from '../../store/environments';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { AppLink, ListItemLink } from '../common';

export interface EnvListProps {
  take?: number;
}

export const EnvList: React.FC<EnvListProps> = ({take}) => {
  const environments = useSelector(asArray);
  const loading = useSelector(getLoading('environments'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEnvironments({take}));
  }, [dispatch]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <List dense>
      {environments.length === 0 && (
        <ListItem>
          <ListItemText primary="No environments set"/>
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/environments/new">
              Create new
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {environments.map((env, i) => (
        <ListItemLink key={env.id} to={`/environments/${env.id}`} divider={i < environments.length - 1}>
          <ListItemText primary={env.title} secondary={env.boardId}/>
        </ListItemLink>
      ))}
    </List>
  );
};
