import React from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';
import Box, { BoxProps } from '@material-ui/core/Box';

export const Loading: React.FC<BoxProps> = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} {...props}>
      <CircularProgress/>
    </Box>
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

export * from './OverlayLoading';
