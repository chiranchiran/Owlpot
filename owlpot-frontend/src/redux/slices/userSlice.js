import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  token: '',
  role: '',
  name: ''
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 新增同步action
    loginUser: (state, action) => {
      state.id = action.payload.id; // 假设登录时会返回用户ID
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.name = action.payload.name;
    },
    logoutOut: (state) => {
      state.id = '';
      state.token = '';
      state.role = '';
      state.name = '';
    }
  },
  // 移除extraReducers（不再需要）
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;