import React from 'react'
import clsx from 'clsx';
import { AppBar, createStyles, makeStyles, Toolbar, Typography } from '@material-ui/core';

export interface TopBarProps {
  open: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({open}) => {
  const classes = useStyles();
  return (
    <AppBar
      elevation={0}
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar
        className={clsx(classes.toolbar, {
          [classes.toolbarShift]: open,
        })}
      >
        <Typography component="h1" variant="h6" noWrap>
          Hose
        </Typography>
      </Toolbar>
    </AppBar>
  )
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => createStyles({
  appBar: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingLeft: theme.spacing(7) + 1 + theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(9) + 1 + theme.spacing(2),
    },
  },
  toolbarShift: {
    paddingLeft: theme.spacing(2),
  },
}));
