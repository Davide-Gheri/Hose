import React from 'react';
import clsx from 'clsx';
import { Paper, Grid, makeStyles, Card, CardContent, Typography, createStyles } from '@material-ui/core';
import { PaperProps } from '@material-ui/core/Paper';
import { GridProps } from '@material-ui/core/Grid';

export type WidgetProps = Omit<PaperProps, 'component'> & Omit<GridProps, 'component'> & {title: string};

export const Widget: React.FC<WidgetProps> = ({children, className, title, ...rest}) => {
  const classes = useStyles();

  return (
    <Grid
      item xs={12} sm={6}
      component={Card}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.cardContent}>
        <Typography color="textSecondary" gutterBottom className={classes.title}>{title}</Typography>
      </CardContent>
      {children}
    </Grid>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    minHeight: 200,
  },
  cardContent: {
    paddingBottom: 0,
  },
  title: {
    fontSize: 14,
  },
}));
