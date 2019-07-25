import React from 'react';
import { useSelector } from 'react-redux';
import { getPreferredEnv } from '../../../store/dashboard';
import { Widget } from '../Widget';
import { RecordsTable } from '../../Records/Table';
import { Loading } from '../../Loading';
import { CardActions } from '@material-ui/core';
import { AppLink } from '../../common/AppLink';

export const PreferredEnvReadings: React.FC = () => {
  const environment = useSelector(getPreferredEnv);

  return (
    <Widget
      sm={12}
      title={environment ? environment.title : 'No preferred environment set'}
      rightTitle={environment ? environment.boardId : ''}
    >
      {environment ? <RecordsTable environment={environment} take={5}/> : <Loading/>}
      <CardActions>
        {environment && <AppLink to={`/environments/${environment.id}/records`}>See all</AppLink>}
      </CardActions>
    </Widget>
  );
};
