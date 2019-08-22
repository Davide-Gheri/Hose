import { PayloadAction } from '../interfaces';
import { types, Types } from './reducer';

export const setPreferredEnv = (id: string): PayloadAction<Types['SET_PREFERRED_ENV']> => ({
  type: types.SET_PREFERRED_ENV,
  payload: id,
});
