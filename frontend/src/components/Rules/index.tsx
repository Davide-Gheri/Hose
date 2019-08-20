import React from 'react';
import { RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageContent, PageHeader, AppLink } from '../common';
import { Grid, Paper, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { RuleList } from './List';

export const RulesPage: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("rule:rule", { count: 100 })}>
        <Button
          variant="outlined"
          color="inherit"
          component={AppLink}
          to="/rules/new"
        >
          <Add />
          {t("common:add_new")}
        </Button>
      </PageHeader>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <RuleList/>
            </Paper>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}

export default RulesPage;