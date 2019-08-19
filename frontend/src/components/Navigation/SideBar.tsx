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
import { ChevronLeft, Dashboard, Place, DeveloperBoard, SettingsInputComponent, Menu } from '@material-ui/icons';
import { Link } from 'react-router-dom';

export interface SideBarProps {
  open: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
}

interface LinkItem {
  title: string;
  icon: any;
  href: string;
}

const links: LinkItem[] = [
  {
    title: 'Dashboard',
    icon: <Dashboard/>,
    href: '/',
  },
  {
    title: 'Environments',
    icon: <Place/>,
    href: '/environments',
  },
  {
    title: 'Gpios',
    icon: <SettingsInputComponent/>,
    href: '/gpios',
  },
  {
    title: 'Boards',
    icon: <DeveloperBoard/>,
    href: '/boards',
  },
];


export const SideBar: React.FC<SideBarProps> = ({open, closeDrawer, openDrawer}) => {
  const classes = useStyles();

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
                <Tooltip title={link.title} placement="right">
                  {link.icon}
                </Tooltip>
              ) : link.icon}
            </ListItemIcon>
            <ListItemText primary={link.title}/>
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
