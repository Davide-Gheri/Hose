import React from 'react';
import { EnvList } from './List';
import { Paper, Grid, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Route } from 'react-router';
import { asyncLoader } from '../asyncLoader';
import { AppLink, PageHeader, PageContent } from '../common';

const AsyncNewEnvironment = asyncLoader(() => import('./NewEnvironment/Dialog'));

export const EnvironmentsPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Environments">
        <Button variant="outlined" color="inherit" component={AppLink} to="/environments/new">
          <Add />
          Add new
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
