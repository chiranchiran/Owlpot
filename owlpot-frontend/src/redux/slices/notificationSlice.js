// src/features/notification/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: "",
  type: 'info',
  visible: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { message, type = 'info' } = action.payload;
      state.message = message;
      state.type = type;
      state.visible = true;
    },
    hideNotification: (state) => {
      state.visible = false;
      state.message = "";
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

// 选择器
export const selectNotification = (state) => state.notification;