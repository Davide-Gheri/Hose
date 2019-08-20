import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles, Tooltip
} from '@material-ui/core';
import { ChevronLeft, Dashboard, Place, DeveloperBoard, SettingsInputComponent, Menu, Tune } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface SideBarProps {
  open: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
}

interface LinkItem {
  title: string;
  icon: any;
  href: string;
  transProp?: object;
}

const links: LinkItem[] = [
  {
    title: 'common:dashboard',
    icon: <Dashboard/>,
    href: '/',
  },
  {
    title: 'environment:environment',
    icon: <Place/>,
    href: '/environments',
    transProp: {count: 100},
  },
  {
    title: 'gpio:gpio',
    icon: <SettingsInputComponent/>,
    href: '/gpios',
    transProp: {count: 100},
  },
  {
    title: 'board:board',
    icon: <DeveloperBoard/>,
    href: '/boards',
    transProp: {count: 100},
  },
  {
    title: 'rule:rule',
    icon: <Tune/>,
    href: '/rules',
    transProp: {count: 100},
  }
];


export const SideBar: React.FC<SideBarProps> = ({open, closeDrawer, openDrawer}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}
    >
      <div className={clsx(classes.toolbar, {
        [classes.toolbarClose]: !open,
      })}>
        <IconButton onClick={open ? closeDrawer : openDrawer} color="inherit">
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </div>
      <Divider/>
      <List>
        {links.map(link => (
          <ListItem
            key={link.title}
            button
            component={Link}
            to={link.href}
            className={classes.item}
            classes={{gutters: clsx(classes.gutters)}}
          >
            <ListItemIcon>
              {!open ? (
                <Tooltip title={t(link.title, link.transProp)} placement="right">
                  {link.icon}
                </Tooltip>
              ) : link.icon}
            </ListItemIcon>
            <ListItemText primary={t(link.title, link.transProp)}/>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => createStyles({
  gutters: theme.mixins.gutters(),
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.drawerToolbar,
    ...theme.mixins.toolbar,
  },
  toolbarClose: {
    justifyContent: 'center',
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    ...theme.mixins.drawerItem,
  },
}));
