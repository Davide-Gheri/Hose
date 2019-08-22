import React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, Grid, Paper } from '@material-ui/core';
import { AppLink, PageContent, PageHeader } from '../common';
import { Add } from '@material-ui/icons';
import { GpioList } from './List';
import { asyncLoader } from '../asyncLoader';
import { useTranslation } from 'react-i18next';
import { minSleep } from '../../lib/sleep';

const AsyncNewGpio = asyncLoader(() => minSleep(import('./NewGpio/Dialog')));

export const GpiosPage: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('gpio:gpio_pin', {count: 100})}>
        <Button variant="outlined" color="inherit" component={AppLink} to="/gpios/new">
          <Add />
          {t('common:add_new')}
        </Button>
      </PageHeader>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <GpioList />
            </Paper>
          </Grid>
        </Grid>
      </PageContent>
      <Route path="/gpios/new" component={AsyncNewGpio}/>
    </>
  )
};

export default GpiosPage;
