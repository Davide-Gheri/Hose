import { AppState } from '../index';
import { makeAsArray } from '../selectors';

export const notificationsSelector = (state: AppState) => state.notifications.notifications;

export const asArray = makeAsArray(notificationsSelector);
