import { configureStore } from '@reduxjs/toolkit';
import { appReducer, userReducer, notificationReducer } from './slices/index';


const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    notification: notificationReducer
  }
});

export default store;