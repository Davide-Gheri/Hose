import React from 'react';
import { createStyles, makeStyles, Typography } from '@material-ui/core';

export interface PageTitleProps {
  title: string | JSX.Element;
}

export const PageTitle: React.FC<PageTitleProps> = ({title, children}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">{title}</Typography>
      <div className={classes.rightChildren}>
        {children}
      </div>
    </div>
  );
};

export const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  rightChildren: {
    marginLeft: 'auto',
  },
}));
