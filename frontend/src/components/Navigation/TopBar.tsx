import React from 'react'
import clsx from 'clsx';
import { AppBar, createStyles, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

export interface TopBarProps {
  open: boolean;
  openDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({open, openDrawer}) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={clsx(classes.appBar, {
      [classes.appBarShift]: open,
    })}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={openDrawer}
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <Menu/>
        </IconButton>
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
    zIndex: theme.zIndex.drawer + 1,
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
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  }
}));
