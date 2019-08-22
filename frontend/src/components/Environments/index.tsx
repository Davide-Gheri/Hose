import React from 'react';
import { EnvList } from './List';
import { Paper, Grid, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Route } from 'react-router';
import { asyncLoader } from '../asyncLoader';
import { AppLink, PageHeader, PageContent } from '../common';
import { useTranslation } from 'react-i18next';
import { minSleep } from '../../lib/sleep';

const AsyncNewEnvironment = asyncLoader(() => minSleep(import('./NewEnvironment/Dialog')));

export const EnvironmentsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('environment:environment', {count: 100})}>
        <Button variant="outlined" color="inherit" component={AppLink} to="/environments/new">
          <Add />
          {t('common:add_new')}
        </Button>
      </PageHeader>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <EnvList />
            </Paper>
          </Grid>
        </Grid>
      </PageContent>
      <Route path="/environments/new" component={AsyncNewEnvironment}/>
    </>
  )
};

export default EnvironmentsPage;
