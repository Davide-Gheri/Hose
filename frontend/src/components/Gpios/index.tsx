import React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { AppLink } from '../common';
import { Add } from '@material-ui/icons';
import { GpioList } from './List';
import { asyncLoader } from '../asyncLoader';

const AsyncNewGpio = asyncLoader(() => import('./NewGpio/Dialog'));

export const GpiosPage: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h4">Gpios pins</Typography>
          <Button variant="contained" color="primary" component={AppLink} to="/gpios/new">
            <Add/>
            Add new
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <GpioList/>
          </Paper>
        </Grid>
      </Grid>
      <Route path="/gpios/new" component={AsyncNewGpio}/>
    </>
  )
};

export default GpiosPage;

const useStyles = makeStyles(theme => createStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
