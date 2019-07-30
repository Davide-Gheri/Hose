import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getEnvironment, makeByIdSelector } from '../../../store/environments';
import { AppState } from '../../../store';
import { getLoading } from '../../../store/selectors';
import { Loading } from '../../Loading';
import { RecordsChart } from '../../Records/Chart';
import { createStyles, makeStyles, Slider, Typography, Button, Chip } from '@material-ui/core';
import { Widget } from '../../Dashboard/Widget';
import { WidgetArea } from '../../Dashboard/WidgetArea';
import { AppLink, PageTitle } from '../../common';
import { uuidregexp } from '../../../lib/pathRegexp';
import { asyncLoader } from '../../asyncLoader';

const AsyncEditEnvironment = asyncLoader(() => import('../EditEnvironment/Dialog'));

export const EnvironmentPage: React.FC<RouteComponentProps<{id: string}>> = props => {
  const classes = useStyles();
  const getById = useMemo(makeByIdSelector, []);
  const id = props.match.params.id;

  const environment = useSelector((state: AppState) => getById(state, id));
  const loading = useSelector(getLoading('environments'));
  const dispatch = useDispatch();

  const [take, setTake] = useState(20);

  useEffect(() => {
    if (!environment) {
      dispatch(getEnvironment(id));
    }
  }, [id, environment]);

  const onSliderChange = useCallback((e: ChangeEvent<{}>, value: any) => {
    setTake(value as number);
  }, []);

  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      {environment ? (
        <>
          <PageTitle title={(
            <span>Environment <b>{environment.title}</b></span>
          )}>
            <Button
              variant="outlined" color="primary"
              component={AppLink} to={`/environments/${environment.id}/edit`}
            >Edit</Button>
          </PageTitle>
          <div className={classes.description}>
            {environment.gpios.length > 0 ? (
              <div className={classes.chips}>
                <Typography variant="h6">GPIO pins:</Typography>
                {environment.gpios.map(gpio => (
                  <Chip key={gpio.id} label={gpio.pin} className={classes.chip}/>
                ))}
              </div>
            ) : 'This Environment does not have any associated GPIOs'}
          </div>
          {environment.description && (
            <div className={classes.description}>
              <Typography color="textSecondary">{environment.description}</Typography>
            </div>
          )}

          <Route
            path={`/environments/:id(${uuidregexp})/edit`}
            render={(props) => <AsyncEditEnvironment environment={environment} {...props}/>}
          />
        </>
      ) : null}
      <WidgetArea>
        <Widget title="Last records" sm={12}>
          {environment ? (
            <>
              <div className={classes.chartContainer}>
                {/*<RecordsChart environment={environment} take={take}/>*/}
              </div>
              <div className={classes.sliderContainer}>
                <Slider
                  defaultValue={take}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={100}
                  onChange={onSliderChange}
                />
              </div>
            </>
          ) : <Loading/>}
        </Widget>
      </WidgetArea>
    </>
  );
};

export default EnvironmentPage;

const useStyles = makeStyles(theme => createStyles({
  chartContainer: {
    height: 300,
    padding: theme.spacing(2),
  },
  sliderContainer: {
    padding: theme.spacing(1, 2),
  },
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
