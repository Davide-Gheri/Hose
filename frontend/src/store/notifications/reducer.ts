import produce from 'immer';
import { NotificationModel } from '../models/notification.model';
import { PayloadAction } from '../interfaces';

export interface NotificationState {
  notifications: Record<string, NotificationModel & {read?: boolean}>;
}

export const types = {
  GET_NOTIFICATIONS_SUCCESS: 'GET_NOTIFICATIONS_SUCCESS',
  GET_NEW_NOTIFICATION: 'GET_NEW_NOTIFICATION',
  SET_NOTIFICATION_READ: 'SET_NOTIFICATION_READ',
  SET_ALL_NOTIFICATIONS_READ: 'SET_ALL_NOTIFICATIONS_READ',
};

export type Types = typeof types;

const initialState: NotificationState = {
  notifications: {},
};

export function reducer(state: NotificationState = initialState, action: PayloadAction): NotificationState {
  return produce(state, draft => {
    switch (action.type) {
      case types.GET_NOTIFICATIONS_SUCCESS:
        action.payload.forEach((not: NotificationModel) => {
          draft.notifications[not.id] = not;
        });
        break;
      case types.GET_NEW_NOTIFICATION:
        console.log(action.payload);
        draft.notifications[action.payload.id] = action.payload;
        break;
      case types.SET_NOTIFICATION_READ:
        if (draft.notifications[action.payload.id]) {
          draft.notifications[action.payload.id].read = action.payload.read;
        }
        break;
      case types.SET_ALL_NOTIFICATIONS_READ:
        draft.notifications = {};
        // draft.notifications = Object.keys(draft.notifications).reduce((obj, id) => {
        //   obj[id] = {
        //     ...draft.notifications[id],
        //     read: action.payload,
        //   };
        //   return obj;
        // }, {} as any);
        break;
    }
  });
}
