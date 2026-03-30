import { createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  phone_number: string;
};

const initialState = {
  token: '',
  user: <User>{},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: state => {
      state.token = '';
      state.user = <User>{};
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
