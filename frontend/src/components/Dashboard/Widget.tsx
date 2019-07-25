import React from 'react';
import clsx from 'clsx';
import { Grid, makeStyles, Card, CardContent, Typography, createStyles, Paper } from '@material-ui/core';
import { PaperProps } from '@material-ui/core/Paper';
import { GridProps } from '@material-ui/core/Grid';

export type WidgetProps = Omit<PaperProps, 'component'> & Omit<GridProps, 'component'> & {
  title: string;
  rightTitle?: string;
};

export const Widget: React.FC<WidgetProps> = ({children, className, title, rightTitle, ...rest}) => {
  const classes = useStyles();

  return (
    <Grid
      item xs={12} sm={6}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Paper {...rest} className={classes.paper}>
        <div className={classes.widgetTitle}>
          <Typography color="textSecondary" gutterBottom className={classes.title}>{title}</Typography>
          {rightTitle && <Typography color="textSecondary" gutterBottom className={classes.rightTitle}>{rightTitle}</Typography>}
        </div>
        {children}
      </Paper>
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    minHeight: 200,
  },
  paper: {
    height: '100%',
  },
  widgetTitle: {
    display: 'flex',
    padding: theme.spacing(2, 2, 0),
  },
  cardContent: {
    paddingBottom: 0,
  },
  title: {
    // fontSize: 14,
  },
  rightTitle: {
    fontSize: 14,
    marginLeft: 'auto',
  }
}));
