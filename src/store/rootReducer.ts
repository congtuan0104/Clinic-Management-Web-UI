import { combineReducers } from '@reduxjs/toolkit';

import * as reducers from './reducers';

const { commonReducer, clinicReducer } = reducers;

export const rootReducer = combineReducers({
  commonReducer,
  clinicReducer,
});
