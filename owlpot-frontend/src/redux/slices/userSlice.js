import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout } from '../../api/auth';
import { setToken, removeToken, setUserInfo, removeUserInfo } from '../../utils/cookies';
import { useNavigate, useNavigate } from 'react-router-dom';

export const loginUser = createAsyncThunk('user/login', async (userInfo) => {
  const { data } = await login(userInfo);
  if (String(data.code) === '200') {
    setToken(data.data.token);
    setUserInfo(data.data);
    return data.data;
  } else {
    throw new Error(data.msg);
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const { data } = await logout({});
  removeToken();
  removeUserInfo();
  return data;
});

const initialState = {
  token: '',
  role: '',
  name: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetToken: (state) => {
      state.token = '';
      state.role = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.name = action.payload.name;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = '';
        state.role = '';
        state.name = '';
      });
  }
});

export const { resetToken } = userSlice.actions;
export default userSlice.reducer;