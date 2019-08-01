import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPreferredEnv } from '../../../store/dashboard';
import { Widget } from '../Widget';
import { RecordsTable } from '../../Records/Table';
import { Loading } from '../../Loading';
import { CardActions } from '@material-ui/core';
import { AppLink } from '../../common';
import { resetRecords } from '../../../store/records';

export const PreferredEnvReadings: React.FC = () => {
  const environment = useSelector(getPreferredEnv);

  const dispatch = useDispatch();

  useEffect(() => {
    if (environment) {
      dispatch(resetRecords(environment.id));
    }
  }, [environment]);

  return (
    <Widget
      sm={12}
      title={environment ? environment.title : 'No preferred environment set'}
      rightTitle={environment ? environment.board ? environment.board.id : '' : ''}
    >
      {environment ? <RecordsTable environment={environment} take={5}/> : <Loading/>}
      <CardActions>
        {environment && <AppLink to={`/environments/${environment.id}/records`}>See all</AppLink>}
      </CardActions>
    </Widget>
  );
};
