import React from 'react'
import clsx from 'clsx';
import {
  AppBar,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { LanguageSwitch } from '../LanguageSwitch';
import { ThemeSwitch } from '../ThemeSwitch';
import { Spacer } from '../common';
import { NotificationsTopBarWidget } from '../Notifications/TopBarWidget';
import { Config } from '../../lib/Config';
import HiddenCss from '@material-ui/core/Hidden/HiddenCss';
import { Menu } from '@material-ui/icons';

export interface TopBarProps {
  open: boolean;
  openDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({open, openDrawer}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));

  return (
    <AppBar
      elevation={0}
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open && !isMobile,
      })}
    >
      <Toolbar
        className={clsx(classes.toolbar, {
          [classes.toolbarShift]: open && !isMobile,
        })}
      >
        <HiddenCss smUp>
          <IconButton onClick={openDrawer} color="inherit" edge="start">
            <Menu />
          </IconButton>
        </HiddenCss>
        <Typography component="h1" variant="h6" noWrap>
          {Config.get<string>('appName', 'Hose')}
        </Typography>
        <Spacer/>
        <LanguageSwitch/>
        <ThemeSwitch/>
        <NotificationsTopBarWidget/>
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
    // paddingLeft: theme.spacing(7) + 1 + theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(9) + 1 + theme.spacing(2),
    },
  },
  toolbarShift: {
    paddingLeft: theme.spacing(2),
  },
}));
