import React, { useEffect, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AppLink, PageContent, PageHeader } from '../../common';
import { getRule, makeByIdSelector } from '../../../store/rules';
import { AppState, useThunkDispatch } from '../../../store';
import { getLoading } from '../../../store/selectors';
import { Loading } from '../../Loading';
import { WidgetArea } from '../../Dashboard/WidgetArea';
import { EnvironmentsWidget } from '../../Environments/EnvironmentsWidget';
import { resetEnvironments } from '../../../store/environments';
import { asyncLoader } from '../../asyncLoader';
import { uuidregexp } from '../../../lib/pathRegexp';
import { Widget } from '../../Dashboard/Widget';
import { useErrorHandler } from '../../../hooks/error';

const AsyncEditRule = asyncLoader(() => import('../EditRule/Dialog'));

export const RulePage: React.FC<RouteComponentProps<{id: string}>> = (props) => {
  const { t } = useTranslation();
  const getById = useMemo(makeByIdSelector, []);
  const id = props.match.params.id;

  const rule = useSelector((state: AppState) => getById(state, id));
  const loading = useSelector(getLoading('rules'));
  const dispatch = useThunkDispatch();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (!rule) {
      dispatch(getRule(id)).catch(errorHandler);
    }
  }, [id, rule]);

  useEffect(() => {
    dispatch(resetEnvironments);
  }, [id]);

  if (loading) {
    return <Loading/>;
  }

  if (!rule) {
    return null; // TODO loading??
  }

  return (
    <>
      <PageHeader title={(
        <span>{t('rule:rule')} <b>{rule.title}</b></span>
      )}>
        <Button
          variant="outlined" color="inherit"
          component={AppLink} to={`/rules/${rule.id}/edit`}
        >
          {t('common:edit')}
        </Button>
      </PageHeader>
      <PageContent>
        <WidgetArea>
          <Widget>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row" align="left">{t('rule:minHumidity')}</TableCell>
                  <TableCell component="th" scope="row" align="right">{t('rule:wateringSeconds')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left">{rule.minHumidity}</TableCell>
                  <TableCell align="right">{rule.wateringSeconds}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Widget>
          <EnvironmentsWidget filter={{id__in: rule.environmentIds.join(',')}}/>
        </WidgetArea>
      </PageContent>
      <Route
        path={`/rules/:id(${uuidregexp})/edit`}
        render={(props) => <AsyncEditRule rule={rule} {...props}/>}
      />
    </>
  );
};

export default RulePage;
