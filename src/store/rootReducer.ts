import { combineReducers } from '@reduxjs/toolkit';

import * as reducers from './reducers';

const { commonReducer } = reducers;

export const rootReducer = combineReducers({
  commonReducer,
});
