import React from 'react';
import { Widget } from '../Widget';
import { EnvList } from '../../Environments/List';

export const Environments: React.FC = () => {
  return (
    <Widget title="Environments">
      <EnvList take={3}/>
    </Widget>
  )
};
