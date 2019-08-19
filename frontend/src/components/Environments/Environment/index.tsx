import React, { useEffect, useMemo, useState } from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { getEnvironment, makeByIdSelector } from '../../../store/environments';
import { AppState, useThunkDispatch } from '../../../store';
import { getLoading } from '../../../store/selectors';
import { Loading } from '../../Loading';
import { createStyles, makeStyles, Typography, Button, Chip } from '@material-ui/core';
import { WidgetArea } from '../../Dashboard/WidgetArea';
import { AppLink, PageHeader, PageContent } from '../../common';
import { uuidregexp } from '../../../lib/pathRegexp';
import { asyncLoader } from '../../asyncLoader';
import { RecordsWidget } from '../../Records/RecordsWidgets';
import { WateringsWidgets } from '../../Waterings/WateringsWidgets';

const AsyncEditEnvironment = asyncLoader(() => import('../EditEnvironment/Dialog'));

export const EnvironmentPage: React.FC<RouteComponentProps<{id: string}>> = props => {
  const classes = useStyles();
  const getById = useMemo(makeByIdSelector, []);
  const id = props.match.params.id;

  const environment = useSelector((state: AppState) => getById(state, id));
  const loading = useSelector(getLoading('environments'));
  const dispatch = useThunkDispatch();

  const [take, setTake] = useState(20);

  useEffect(() => {
    if (!environment) {
      dispatch(getEnvironment(id)).catch(console.error);
    }
  }, [id, environment]);

  if (loading) {
    return <Loading/>;
  }

  if (!environment) {
    return null; // TODO loading??
  }

  return (
    <>
      <PageHeader title={(
        <span>Environment <b>{environment.title}</b></span>
      )}>
        <Button
          variant="outlined" color="inherit"
          component={AppLink} to={`/environments/${environment.id}/edit`}
        >Edit</Button>
      </PageHeader>
      <PageContent>
        <div className={classes.description}>
          {environment.gpios.length > 0 ? (
            <div className={classes.chips}>
              <Typography variant="h6">GPIO pins:</Typography>
              {environment.gpios.map(gpio => (
                <Chip key={gpio.id} label={gpio.pin} className={classes.chip} />
              ))}
            </div>
          ) : 'This Environment does not have any associated GPIOs'}
        </div>
        {environment.description && (
          <div className={classes.description}>
            <Typography color="textSecondary">{environment.description}</Typography>
          </div>
        )}
        <WidgetArea>
          <RecordsWidget environment={environment} />
          <WateringsWidgets environment={environment} />
        </WidgetArea>
      </PageContent>
      <Route
        path={`/environments/:id(${uuidregexp})/edit`}
        render={(props) => <AsyncEditEnvironment environment={environment} {...props}/>}
      />
    </>
  );
};

export default EnvironmentPage;

const useStyles = makeStyles(theme => createStyles({
  description: {
    paddingBottom: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  chip: {
    margin: theme.spacing(0, 0.5),
  },
}));
