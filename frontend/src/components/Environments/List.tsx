import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Button,
  makeStyles,
  createStyles
} from '@material-ui/core';
import { asArray, getEnvironments } from '../../store/environments';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { AppLink, ListItemLink } from '../common';
import { useThunkDispatch } from '../../store';

export interface EnvListProps {
  take?: number;
}

export const EnvList: React.FC<EnvListProps> = ({take}) => {
  const classes = useStyles();
  const environments = useSelector(asArray);
  const loading = useSelector(getLoading('environments'));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getEnvironments({take})).catch(console.error);
  }, [dispatch]);

  if (loading) {
    return (
      <div className={classes.loading}>
        <Loading/>
      </div>
    );
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
          <ListItemText primary={env.title} secondary={env.board && env.board.id}/>
        </ListItemLink>
      ))}
    </List>
  );
};

const useStyles = makeStyles(theme => createStyles({
  loading: {
    width: '100%',
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
  },
}));
