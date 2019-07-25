import React from 'react';
import { WidgetArea } from './WidgetArea';
import { Environments } from './Widgets';
import { PreferredEnvReadings } from './Widgets/PreferredEnvReadings';

export const Dashboard: React.FC = () => {
  return (
    <WidgetArea>
      <Environments/>
      <PreferredEnvReadings/>
    </WidgetArea>
  )
};

export default Dashboard;
