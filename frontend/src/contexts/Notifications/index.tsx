import React, { useContext } from 'react';
import { Message, NotificationsContext } from './NotificationsContext';

export * from './NotificationsProvider';
export * from './NotificationsContext';

export const useNotifications = () => useContext(NotificationsContext);

export const withNotifications = (Comp: React.ComponentType) => (
  function WithNotifications(props: any) {
    const ctx = useNotifications();
    return <Comp {...props} {...ctx}/>
  }
);

export const commonNotificationOpts: Partial<Message> = {
  horizontal: 'left',
  vertical: 'bottom',
  autoHide: 2000,
};
