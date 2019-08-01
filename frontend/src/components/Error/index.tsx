import React, { useCallback } from 'react';
import { createStyles, makeStyles, Typography, Button } from '@material-ui/core';

export const Error: React.FC = () => {
  const classes = useStyles();

  const onReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className={classes.root}>
      <Typography color="error" variant="h5">An error occurred</Typography>
      <Button onClick={onReload} variant="outlined" className={classes.reloadBtn}>
        Reload
      </Button>
    </div>
  )
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  reloadBtn: {
    marginTop: theme.spacing(1),
  },
}));
