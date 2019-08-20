import React from 'react';
import { Widget } from '../Widget';
import { EnvList } from '../../Environments/List';
import { AppLink } from '../../common';
import { CardActions, Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const Environments: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Widget title={t('environment:environment', {count: 100})}>
      <EnvList take={3}/>
      <CardActions>
        <Link component={AppLink} to="/environments">{t('common:see_all')}</Link>
      </CardActions>
    </Widget>
  )
};
