import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Button, createStyles, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { AppLink } from '../common';
import { Add } from '@material-ui/icons';
import { BoardTable } from './Table';
import { asyncLoader } from '../asyncLoader';
import { useSelector } from 'react-redux';
import { boardsSelector } from '../../store/boards';
import { isEmpty } from '../../lib/util';
import Error404 from '../ErrorPages/Error404';

const AsyncNewBoard = asyncLoader(() => import('./NewBoard/Dialog'));
const AsyncEditBoard = asyncLoader(() => import('./EditBoard/Dialog'));

export const BoardsPage: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const boards = useSelector(boardsSelector);

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
      <Switch>
        <Route path="/boards/new" component={AsyncNewBoard}/>
        {!isEmpty(boards) && (
          <Route
            path="/boards/:id"
            render={props => {
              const board = boards[props.match.params.id];
              if (!board) {
                return <Redirect to="/404"/>;
              }
              return <AsyncEditBoard {...props} board={board}/>;
            }}
          />
        )}
      </Switch>
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
