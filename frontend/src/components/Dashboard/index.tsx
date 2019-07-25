import React from 'react';
import { WidgetArea } from './WidgetArea';
import { Environments } from './Widgets';

export const Dashboard: React.FC = () => {
  return (
    <WidgetArea>
      <Environments/>
    </WidgetArea>
  )
};

export default Dashboard;
