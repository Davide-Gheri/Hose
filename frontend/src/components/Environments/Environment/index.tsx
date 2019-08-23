import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createStyles, makeStyles, Typography, Button, Chip, Link, IconButton, Tooltip } from '@material-ui/core';
import { StarBorder, Star } from '@material-ui/icons';
import { getEnvironment, makeByIdSelector } from '../../../store/environments';
import { AppState, useThunkDispatch } from '../../../store';
import { getLoading } from '../../../store/selectors';
import { Loading } from '../../Loading';
import { WidgetArea } from '../../Dashboard/WidgetArea';
import { AppLink, PageHeader, PageContent } from '../../common';
import { uuidregexp } from '../../../lib/pathRegexp';
import { asyncLoader } from '../../asyncLoader';
import { RecordsWidget } from '../../Records/RecordsWidgets';
import { WateringsWidgets } from '../../Waterings/WateringsWidgets';
import { minSleep } from '../../../lib/sleep';
import { useErrorHandler } from '../../../hooks/error';
import { preferredEnvSelector, setPreferredEnv } from '../../../store/dashboard';

const AsyncEditEnvironment = asyncLoader(() => minSleep(import('../EditEnvironment/Dialog')));

export const EnvironmentPage: React.FC<RouteComponentProps<{id: string}>> = props => {
  const [ready, setReady] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const getById = useMemo(makeByIdSelector, []);
  const id = props.match.params.id;

  const environment = useSelector((state: AppState) => getById(state, id));
  const loading = useSelector(getLoading('environments'));

  const preferredEnv = useSelector(preferredEnvSelector);

  const dispatch = useThunkDispatch();
  const errorHandler = useErrorHandler();

  const setPreferred = useCallback(() => {
    if (preferredEnv === environment.id) {
      dispatch(setPreferredEnv(null));
    } else {
      dispatch(setPreferredEnv(environment.id));
    }
  }, [environment, preferredEnv]);

  useEffect(() => {
    setReady(false);
    dispatch(getEnvironment(id))
      .then(() => setReady(true))
      .catch(errorHandler);
  }, [id]);

  if (loading || !ready) {
    return <Loading/>;
  }

  if (!environment) {
    return null; // TODO loading??
  }

  return (
    <>
      <PageHeader title={(
        <>
          <IconButton onClick={setPreferred}>
            <Tooltip title={t('dashboard:set_preferred_env')}>
              {preferredEnv === environment.id ? <Star/> : <StarBorder/>}
            </Tooltip>
          </IconButton>
          <span>{t('environment:environment')} <b>{environment.title}</b></span>
        </>
      )}>
        <Button
          variant="outlined" color="inherit"
          component={AppLink} to={`/environments/${environment.id}/edit`}
        >
          {t('common:edit')}
        </Button>
      </PageHeader>
      <PageContent>
        <div className={classes.description}>
          {environment.gpios.length > 0 ? (
            <div className={classes.chips}>
              <Typography variant="h6">{t('gpio:gpio_pin', {count: 100})}:</Typography>
              {environment.gpios.map(gpio => (
                <Chip key={gpio.id} label={gpio.pin} className={classes.chip} />
              ))}
            </div>
          ) : t('environment:no_associated_pins')}
        </div>
        {environment.rule && (
          <div className={classes.description}>
            <Typography>
              {t('rule:rule')}:
              <Link component={AppLink} to={`/rules/${environment.rule.id}`}>{environment.rule.title}</Link>
            </Typography>
          </div>
        )}
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
