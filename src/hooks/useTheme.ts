import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Themes } from '../utils/colors';
import { Appearance } from 'react-native';
import { useMemo } from 'react';

export const useTheme = () => {
  const themeType = useSelector((state: RootState) => state.theme.currentTheme);
  const systemTheme = Appearance.getColorScheme() ?? 'light';

  const { effectiveThemeKey, theme } = useMemo(() => {
    const resolvedTheme: 'light' | 'dark' =
      themeType === 'default' ? systemTheme : themeType;

    const selectedTheme = Themes[resolvedTheme] ?? Themes.light;
    return {
      effectiveThemeKey: resolvedTheme,
      theme: selectedTheme,
    };
  }, [themeType, systemTheme]);

  return { themeType, effectiveTheme: effectiveThemeKey, theme };
};
