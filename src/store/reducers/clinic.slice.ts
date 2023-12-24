import { IClinic, IUserInfo } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';

export interface ClinicState {
  currentClinic: IClinic | undefined;
  listClinic: IClinic[];
}

const initState: ClinicState = {
  currentClinic: undefined,
  listClinic: [],
};

const clinicSlice = createSlice({
  name: 'clinic',
  initialState: initState,
  reducers: {
    setCurrentClinic(state: ClinicState, action: PayloadAction<IClinic | undefined>) {
      state.currentClinic = action.payload;
    },

    setListClinics(state: ClinicState, action: PayloadAction<IClinic[]>) {
      state.listClinic = action.payload;
    },
  },
});

export const currentClinicSelector = (state: RootState) => state?.clinicReducer?.currentClinic;
export const listClinicSelector = (state: RootState) => state?.clinicReducer?.listClinic;
export const { setCurrentClinic, setListClinics } = clinicSlice.actions;
export const clinicReducer = clinicSlice.reducer;
