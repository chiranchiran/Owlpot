import { createSlice } from '@reduxjs/toolkit';

export const DeviceType = {
  Mobile: 'MOBILE',
  Desktop: 'DESKTOP'
};

const initialState = {
  device: DeviceType.Desktop,
  sidebar: {
    closed: false,
    withoutAnimation: false
  },
  status: 0
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.closed = !state.sidebar.closed;
    },
    toggleDevice: (state, action) => {
      state.device = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    }
  }
});

export const { toggleSidebar, toggleDevice, setStatus } = appSlice.actions;
export default appSlice.reducer;