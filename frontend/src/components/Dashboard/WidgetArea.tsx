import React from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';

export const WidgetArea: React.FC = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      {props.children}
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,
  },
}));
