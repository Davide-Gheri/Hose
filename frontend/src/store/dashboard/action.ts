import { PayloadAction } from '../index';
import { types, Types } from './reducer';

// export const getPreferredEnv = (): AppAction<Types['GET_PREFERRED_ENV']> => ({
//   type: types.GET_PREFERRED_ENV,
// });

export const setPreferredEnv = (id: string): PayloadAction<Types['SET_PREFERRED_ENV']> => ({
  type: types.SET_PREFERRED_ENV,
  payload: id,
});
