import React, { useMemo, useState } from 'react';
import { NotificationsCtx, NotificationsContext, Message } from './NotificationsContext';

export const NotificationsProvider: React.FC = (props) => {
  const [message, setMessage] = useState<Message | null>(null);

  const value: NotificationsCtx = useMemo<NotificationsCtx>(() => ({
    message,
    closeNotification: () => setMessage(null),
    openNotification: (msg: Partial<Message>) => {
      if (msg.autoHide) {
        msg.autoHide = typeof msg.autoHide === 'boolean' ? 4000 : msg.autoHide;
      } else {
        msg.autoHide = null;
      }
      if (!msg.horizontal) msg.horizontal = 'left';
      if (!msg.vertical) msg.vertical = 'bottom';
      setMessage(msg as Message);
    }
  }), [message]);

  return (
    <NotificationsContext.Provider value={value}>
      {props.children}
    </NotificationsContext.Provider>
  )
};
