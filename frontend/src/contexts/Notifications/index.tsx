import React, { useContext } from 'react';
import { NotificationsContext } from './NotificationsContext';

export * from './NotificationsProvider';
export * from './NotificationsContext';

export const useNotifications = () => useContext(NotificationsContext);

export const withNotifications = (Comp: React.ComponentType) => (
  function WithNotifications(props: any) {
    const ctx = useNotifications();
    return <Comp {...props} {...ctx}/>
  }
);
