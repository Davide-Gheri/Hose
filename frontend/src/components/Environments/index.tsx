import React from 'react';
import { EnvList } from './List';
import { createStyles, makeStyles, Paper, Typography, Grid, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

export const EnvironmentsPage: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h4">Environments</Typography>
        <Button variant="contained" color="primary">
          <Add/>
          Add new
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <EnvList/>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default EnvironmentsPage;

const useStyles = makeStyles(theme => createStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
