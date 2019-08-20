import React from 'react';
import { Widget } from '../Dashboard/Widget';
import { useTranslation } from 'react-i18next';
import { EnvList, EnvListProps } from './List';

export type EnvironmentsWidgetProps = EnvListProps;

export const EnvironmentsWidget: React.FC<EnvironmentsWidgetProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Widget title={t('environment:environment', {count: 100})}>
      <EnvList {...props}/>
    </Widget>
  )
};
