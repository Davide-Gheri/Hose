import React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { AppLink } from '../common';
import { Add } from '@material-ui/icons';
import { BoardTable } from './Table';
import { asyncLoader } from '../asyncLoader';

const AsyncNewBoard = asyncLoader(() => import('./NewBoard/Dialog'));

export const BoardsPage: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h4">Boards</Typography>
          <Button variant="contained" color="primary" component={AppLink} to="/boards/new">
            <Add/>
            Add new
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <BoardTable/>
          </Paper>
        </Grid>
      </Grid>
      <Route path="/boards/new" component={AsyncNewBoard}/>
    </>
  );
};

export default BoardsPage;

const useStyles = makeStyles(theme => createStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
