import { createSlice } from '@reduxjs/toolkit';

export const DeviceType = {
  Mobile: 'MOBILE',
  Desktop: 'DESKTOP'
};

const initialState = {
  device: DeviceType.Desktop,
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  statusNumber: 0
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.opened = !state.sidebar.opened;
    },
    closeSidebar: (state, action) => {
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = action.payload;
    },
    toggleDevice: (state, action) => {
      state.device = action.payload;
    },
    setStatusNumber: (state, action) => {
      state.statusNumber = action.payload;
    }
  }
});

export const { toggleSidebar, closeSidebar, toggleDevice, setStatusNumber } = appSlice.actions;
export default appSlice.reducer;