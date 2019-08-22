import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPreferredEnv } from '../../../store/dashboard';
import { Widget } from '../Widget';
import { RecordsTable } from '../../Records/Table';
import { Loading } from '../../Loading';
import { CardActions, Link } from '@material-ui/core';
import { AppLink } from '../../common';
import { resetRecords } from '../../../store/records';
import { useTranslation } from 'react-i18next';

export const PreferredEnvReadings: React.FC = () => {
  const environment = useSelector(getPreferredEnv);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (environment) {
      dispatch(resetRecords(environment.id));
    }
  }, [environment, dispatch]);

  return (
    <Widget
      sm={12}
      title={environment ? environment.title : t('environment:no_preferred_set')}
      rightTitle={environment ? environment.board ? environment.board.id : '' : ''}
    >
      {environment ? <RecordsTable environment={environment} take={5}/> : <Loading minHeight={100}/>}
      <CardActions>
        {environment && <Link component={AppLink} to={`/environments/${environment.id}/records`}>{t('common:see_all')}</Link>}
      </CardActions>
    </Widget>
  );
};
