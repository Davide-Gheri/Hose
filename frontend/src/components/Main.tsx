import React, { useCallback, useState } from 'react';
import { TopBar } from './Navigation/TopBar';
import { SideBar } from './Navigation/SideBar';
import { createStyles, makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router';
import { asyncLoader } from './asyncLoader';
import { uuidregexp } from '../lib/pathRegexp';

const AsyncDashboard = asyncLoader(() => import('./Dashboard'));
const AsyncEnvironments = asyncLoader(() => import('./Environments'));
const AsyncEnvironment = asyncLoader(() => import('./Environments/Environment'));

export const Main: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), [setOpen]);
  const closeDrawer = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <TopBar open={open} openDrawer={openDrawer}/>
      <SideBar open={open} closeDrawer={closeDrawer}/>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Switch>
          <Route path={`/environments/:id(${uuidregexp})`} component={AsyncEnvironment}/>
          <Route path="/environments" component={AsyncEnvironments}/>
          <Route path="/" component={AsyncDashboard}/>
        </Switch>
      </main>
    </>
  );
};

const useStyles = makeStyles(theme => createStyles({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
}));
