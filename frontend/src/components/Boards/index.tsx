import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Button, Grid, Paper } from '@material-ui/core';
import { AppLink, PageHeader, PageContent } from '../common';
import { Add } from '@material-ui/icons';
import { BoardTable } from './Table';
import { asyncLoader } from '../asyncLoader';
import { useSelector } from 'react-redux';
import { boardsSelector } from '../../store/boards';
import { isEmpty } from '../../lib/util';
import { useTranslation } from 'react-i18next';

const AsyncNewBoard = asyncLoader(() => import('./NewBoard/Dialog'));
const AsyncEditBoard = asyncLoader(() => import('./EditBoard/Dialog'));

export const BoardsPage: React.FC<RouteComponentProps> = () => {
  const boards = useSelector(boardsSelector);
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('board:board', {count: 100})}>
        <Button variant="outlined" color="inherit" component={AppLink} to="/boards/new">
          <Add />
          {t('common:add_new')}
        </Button>
      </PageHeader>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <BoardTable />
            </Paper>
          </Grid>
        </Grid>
      </PageContent>
      <Switch>
        <Route path="/boards/new" component={AsyncNewBoard}/>
        {!isEmpty(boards) && (
          <Route
            path="/boards/:id"
            render={props => {
              const board = boards[props.match.params.id];
              if (!board) {
                return <Redirect to="/404"/>;
              }
              return <AsyncEditBoard {...props} board={board}/>;
            }}
          />
        )}
      </Switch>
    </>
  );
};

export default BoardsPage;
