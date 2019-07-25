import React from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';

export const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress/>
    </div>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));
