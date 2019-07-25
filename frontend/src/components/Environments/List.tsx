import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { asArray, getEnvironments } from '../../store/environments';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { Link } from 'react-router-dom';
import { ListItemLink } from '../common';

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
      {environments.map((env, i) => (
        <ListItemLink key={env.id} to={`/environments/${env.id}`} divider={i < environments.length - 1}>
          <ListItemText primary={env.title} secondary={env.boardId}/>
        </ListItemLink>
      ))}
    </List>
  );
};
