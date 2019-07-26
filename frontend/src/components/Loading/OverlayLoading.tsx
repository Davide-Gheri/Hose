import React from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';

export const OverlayLoading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress/>
    </div>
  )
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    background: 'rgba(255, 255, 255, .5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
}));
