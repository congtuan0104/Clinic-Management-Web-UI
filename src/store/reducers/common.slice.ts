import { IUserInfo } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';

export interface CommonState {
  user?: IUserInfo | null;
  clinicId?: number | null;
}

const initState: CommonState = {
  user: JSON.parse(cookies.get(COOKIE_KEY.USER_INFO) || 'null'),
};

export const userInfoSelector = (state: RootState) => state?.commonReducer?.user;
export const clinicIdSelector = (state: RootState) => state?.commonReducer?.clinicId;

const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUserInfo(state: CommonState, action: PayloadAction<IUserInfo | undefined | null>) {
      state.user = action.payload;
    },
    setClinicId(state: CommonState, action: PayloadAction<number | undefined | null>) {
      state.clinicId = action.payload;
    }
  },
});

export const { setUserInfo, setClinicId } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;
