import { IClinic, IClinicStaff, IUserInfo } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { cookies } from '@/utils';
import { COOKIE_KEY } from '@/constants';
import { PERMISSION } from '@/enums';

export interface ClinicState {
  currentClinic?: IClinic;
  staff?: IClinicStaff;
  staffPermission: PERMISSION[];
  listClinic: IClinic[];
  focusMode: boolean;
  openSidebar: boolean;
}

const initState: ClinicState = {
  currentClinic: undefined,
  staff: undefined,
  staffPermission: [],
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

    setStaffPermission(state: ClinicState, action: PayloadAction<PERMISSION[]>) {
      state.staffPermission = action.payload;
    },

    setStaffInfo(state: ClinicState, action: PayloadAction<IClinicStaff>) {
      state.staff = action.payload;
    },
  },
});

export const staffInfoSelector = (state: RootState) => state?.clinicReducer?.staff;
export const staffPermissionSelector = (state: RootState) => state?.clinicReducer?.staffPermission;
export const currentClinicSelector = (state: RootState) => state?.clinicReducer?.currentClinic;
export const listClinicSelector = (state: RootState) => state?.clinicReducer?.listClinic;
export const focusModeSelector = (state: RootState) => state?.clinicReducer?.focusMode;
export const openSidebarClinicSelector = (state: RootState) => state?.clinicReducer?.openSidebar;

export const {
  setCurrentClinic,
  setListClinics,
  setFocusMode,
  toggleSidebarClinic,
  setStaffPermission,
  setStaffInfo,
} = clinicSlice.actions;
export const clinicReducer = clinicSlice.reducer;
