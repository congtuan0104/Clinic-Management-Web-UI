import { IUserInfo } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';

export interface CommonState {
  user?: IUserInfo | null;
}

const initState: CommonState = {
  user: JSON.parse(cookies.get(COOKIE_KEY.USER_INFO) || 'null'),
};

export const userInfoSelector = (state: RootState) => state?.commonReducer?.user;

const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUserInfo(state: CommonState, action: PayloadAction<IUserInfo | undefined | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUserInfo } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;
