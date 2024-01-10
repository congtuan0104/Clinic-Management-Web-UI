import { IClinic, IUserInfo } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';

export interface ClinicState {
  currentClinic: IClinic | undefined;
  listClinic: IClinic[];
  focusMode: boolean;
  openSidebar: boolean;
}

const initState: ClinicState = {
  currentClinic: undefined,
  listClinic: [],
  focusMode: false,
  openSidebar: true,
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

    setFocusMode(state: ClinicState, action: PayloadAction<boolean>) {
      state.focusMode = action.payload;
    },

    toggleSidebarClinic(state: ClinicState) {
      state.openSidebar = !state.openSidebar;
    },
  },
});

export const currentClinicSelector = (state: RootState) => state?.clinicReducer?.currentClinic;
export const listClinicSelector = (state: RootState) => state?.clinicReducer?.listClinic;
export const focusModeSelector = (state: RootState) => state?.clinicReducer?.focusMode;
export const openSidebarClinicSelector = (state: RootState) => state?.clinicReducer?.openSidebar;

export const { setCurrentClinic, setListClinics, setFocusMode, toggleSidebarClinic } =
  clinicSlice.actions;
export const clinicReducer = clinicSlice.reducer;
