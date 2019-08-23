import React, { useCallback, useState } from 'react';
import { TopBar } from './Navigation/TopBar';
import { SideBar } from './Navigation/SideBar';
import { createStyles, makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router';
import { asyncLoader } from './asyncLoader';
import { uuidregexp } from '../lib/pathRegexp';
import { ErrorBoundary } from './ErrorBoundary';
import { minSleep } from '../lib/sleep';

const Async404 = asyncLoader(() => minSleep(import('./ErrorPages/Error404')));
const AsyncDashboard = asyncLoader(() => minSleep(import('./Dashboard')));

const AsyncEnvironments = asyncLoader(() => minSleep(import('./Environments')));
const AsyncEnvironment = asyncLoader(() => minSleep(import('./Environments/Environment')));

const AsyncGpios = asyncLoader(() => minSleep(import('./Gpios')));
const AsyncBoards = asyncLoader(() => minSleep(import('./Boards')));

const AsyncRules = asyncLoader(() => minSleep(import('./Rules')));
const AsyncRule = asyncLoader(() => minSleep(import('./Rules/Rule')));

export const Main: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), [setOpen]);
  const closeDrawer = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <TopBar open={open} openDrawer={openDrawer}/>
      <SideBar open={open} closeDrawer={closeDrawer} openDrawer={openDrawer}/>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <ErrorBoundary>
          <Switch>
            <Route path={`/environments/:id(${uuidregexp})`} component={AsyncEnvironment}/>
            <Route path="/environments" component={AsyncEnvironments}/>
            <Route path="/gpios" component={AsyncGpios}/>
            <Route path="/boards" component={AsyncBoards}/>
            <Route path={`/rules/:id(${uuidregexp})`} component={AsyncRule}/>
            <Route path="/rules" component={AsyncRules}/>
            <Route path="/" exact component={AsyncDashboard}/>
            <Route path={'*'} component={Async404}/>
          </Switch>
        </ErrorBoundary>
      </main>
    </>
  );
};

const useStyles = makeStyles(theme => createStyles({
  content: {
    flexGrow: 1,
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
}));
