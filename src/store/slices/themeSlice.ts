import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'default';

interface ThemeState {
  currentTheme: ThemeType;
}

const systemTheme = Appearance.getColorScheme() as 'light' | 'dark';

const initialState: ThemeState = {
  currentTheme: 'default',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
      AsyncStorage.setItem('APP_THEME', action.payload);
    },

    changeTheme: (state, action) => {
      state.currentTheme = action.payload;
      AsyncStorage.setItem('APP_THEME', action.payload);
    },

    hydrateTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme, changeTheme, hydrateTheme } = themeSlice.actions;
export default themeSlice.reducer;
