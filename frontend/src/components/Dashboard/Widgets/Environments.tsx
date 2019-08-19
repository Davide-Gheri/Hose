import React from 'react';
import { Widget } from '../Widget';
import { EnvList } from '../../Environments/List';
import { AppLink } from '../../common';
import { CardActions, Link } from '@material-ui/core';

export const Environments: React.FC = () => {
  return (
    <Widget title="Environments">
      <EnvList take={3}/>
      <CardActions>
        <Link component={AppLink} to="/environments">See all</Link>
      </CardActions>
    </Widget>
  )
};
