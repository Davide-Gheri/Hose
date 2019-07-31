import produce from 'immer';
import { GpioModel } from '../models';
import { PayloadAction } from '../index';

export interface GpiosState {
  loading: boolean;
  error: any;
  gpios: Record<string, GpioModel>;
}

export const types = {
  SET_GPIOS_LOADING: 'SET_GPIOS_LOADING',
  GET_GPIOS_SUCCESS: 'GET_GPIOS_SUCCESS',
  GET_GPIOS_ERROR: 'GET_GPIOS_ERROR',
  DELETE_GPIO_SUCCESS: 'DELETE_GPIO_SUCCESS',
};

export type Types = typeof types;

const initialState: GpiosState = {
  loading: false,
  error: null,
  gpios: {},
};

export function reducer(state: GpiosState = initialState, action: PayloadAction) {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_GPIOS_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_GPIOS_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case types.GET_GPIOS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        action.payload.forEach((gpio: GpioModel) => {
          draft.gpios[gpio.id] = gpio;
        });
        break;
      case types.DELETE_GPIO_SUCCESS:
        draft.loading = false;
        draft.error = false;
        delete draft.gpios[action.payload];
        break;
    }
  })
}
