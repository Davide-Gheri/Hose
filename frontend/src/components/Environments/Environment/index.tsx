import React, { useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getEnvironment, makeByIdSelector } from '../../../store/environments';
import { AppState } from '../../../store';
import { getLoading } from '../../../store/selectors';
import { Loading } from '../../Loading';
import { RecordsChart } from '../../Records/Chart';
import { createStyles, makeStyles, Paper } from '@material-ui/core';

export const EnvironmentPage: React.FC<RouteComponentProps<{id: string}>> = props => {
  const classes = useStyles();
  const getById = useMemo(makeByIdSelector, []);
  const id = props.match.params.id;

  const environment = useSelector((state: AppState) => getById(state, id));
  const loading = useSelector(getLoading('environments'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!environment) {
      dispatch(getEnvironment(id));
    }
  }, [id, environment]);

  console.log(environment)

  if (loading) {
    return <Loading/>;
  }

  return (
    <Paper className={classes.chartContainer}>
      {environment ? <RecordsChart environment={environment} take={20}/> : <Loading/>}
    </Paper>
  );
};

export default EnvironmentPage;

const useStyles = makeStyles(theme => createStyles({
  chartContainer: {
    height: 300,
    padding: theme.spacing(2),
  },
}));
