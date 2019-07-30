import React from 'react';

export interface MessageAction {
  onClick: (e: any) => void;
  text: string | number;
}

export interface Message {
  text: string;
  horizontal: 'left' | 'right';
  vertical: 'top' | 'bottom';
  autoHide: number | boolean | null;
  action?: MessageAction;
}

export interface NotificationsCtx {
  message: Message | null;
  openNotification: (message: Partial<Message>) => void;
  closeNotification: () => void;
}

export const NotificationsContext = React.createContext<NotificationsCtx>({
  message: null,
  openNotification: (message: Partial<Message>) => {},
  closeNotification: () => {},
});
