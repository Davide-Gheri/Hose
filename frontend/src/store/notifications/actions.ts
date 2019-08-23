import { NotificationModel } from '../models/notification.model';
import { PayloadAction } from '../interfaces';
import { types, Types } from './reducer';
import { ThunkAction } from 'redux-thunk';
import { modelIo, SocketCallback } from '../../lib/io';
import { parseDates } from '../../lib/commonPipes';

const Io = modelIo('/notifications', [
  parseDates('createdAt'),
]);

const getNotificationsSuccess = (notifications: NotificationModel[]): PayloadAction<Types['GET_NOTIFICATIONS_SUCCESS'], NotificationModel[]> => ({
  type: types.GET_NOTIFICATIONS_SUCCESS,
  payload: notifications,
});

const getNewNotification = (notification: NotificationModel): PayloadAction<Types['GET_NEW_NOTIFICATION'], NotificationModel> => ({
  type: types.GET_NEW_NOTIFICATION,
  payload: notification,
});

const setNotificationRead = (id: string, read: boolean = true): PayloadAction<Types['SET_NOTIFICATION_READ'], {id: string, read: boolean}> => ({
  type: types.SET_NOTIFICATION_READ,
  payload: {id, read},
});

const setAllNotificationsRead = (read: boolean = true): PayloadAction<Types['SET_ALL_NOTIFICATIONS_READ'], boolean> => ({
  type: types.SET_ALL_NOTIFICATIONS_READ,
  payload: read,
});

export const getNotifications = (): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Io.emit<NotificationModel[]>('get')
    .then(notifications => {
      if (notifications) {
        dispatch(getNotificationsSuccess(notifications));
      }
    });
};

export const getNewNotifications = (cb: SocketCallback): ThunkAction<void, {}, {}, PayloadAction> => dispatch => {
  return Io.on<NotificationModel>('new', ((payload, off) => {
    dispatch(getNewNotification(payload));
    return cb(payload, off);
  }));
};

export const readNotification = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Io.emit('read', {id})
    .then(() => dispatch(setNotificationRead(id)));
};

export const readAllNotifications = (): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Io.emit('readAll')
    .then(() => dispatch(setAllNotificationsRead()))
};
