import React from 'react';
import { WidgetArea } from './WidgetArea';
import { Environments } from './Widgets';
import { PreferredEnvReadings } from './Widgets/PreferredEnvReadings';
import { PageContent } from '../common';

export const Dashboard: React.FC = () => {
  return (
    <PageContent>
      <WidgetArea>
        <Environments />
        <PreferredEnvReadings />
      </WidgetArea>
    </PageContent>
  )
};

export default Dashboard;
