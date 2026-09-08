import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme as NavLightTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { fontFamilies } from './typography';

const customFonts = configureFonts({
  config: {
    displayLarge: { fontFamily: fontFamilies.bold, letterSpacing: 0, fontSize: 57, lineHeight: 64 },
    displayMedium: { fontFamily: fontFamilies.semibold, letterSpacing: 0, fontSize: 45, lineHeight: 52 },
    displaySmall: { fontFamily: fontFamilies.regular, letterSpacing: 0, fontSize: 36, lineHeight: 44 },
    headlineLarge: { fontFamily: fontFamilies.bold, letterSpacing: 0, fontSize: 32, lineHeight: 40 },
    headlineMedium: { fontFamily: fontFamilies.semibold, letterSpacing: 0, fontSize: 28, lineHeight: 36 },
    headlineSmall: { fontFamily: fontFamilies.regular, letterSpacing: 0, fontSize: 24, lineHeight: 32 },
    titleLarge: { fontFamily: fontFamilies.bold, letterSpacing: 0, fontSize: 22, lineHeight: 28 },
    titleMedium: { fontFamily: fontFamilies.medium, letterSpacing: 0.15, fontSize: 16, lineHeight: 24 },
    titleSmall: { fontFamily: fontFamilies.regular, letterSpacing: 0.1, fontSize: 14, lineHeight: 20 },
    labelLarge: { fontFamily: fontFamilies.semibold, letterSpacing: 0.1, fontSize: 14, lineHeight: 20 },
    labelMedium: { fontFamily: fontFamilies.medium, letterSpacing: 0.5, fontSize: 12, lineHeight: 16 },
    labelSmall: { fontFamily: fontFamilies.regular, letterSpacing: 0.5, fontSize: 11, lineHeight: 16 },
    bodyLarge: { fontFamily: fontFamilies.regular, letterSpacing: 0.15, fontSize: 16, lineHeight: 24 },
    bodyMedium: { fontFamily: fontFamilies.regular, letterSpacing: 0.25, fontSize: 14, lineHeight: 20 },
    bodySmall: { fontFamily: fontFamilies.regular, letterSpacing: 0.4, fontSize: 12, lineHeight: 16 },
  },
});

export const AppLightTheme = {
  ...MD3LightTheme,
  fonts: customFonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    background: '#FFFFFF',
    surface: '#FDFAFF',
    error: '#B3261E',
  },
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  fonts: customFonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#F2B8B5',
  },
};

export const NavigationLightTheme = {
  ...NavLightTheme,
  colors: {
    ...NavLightTheme.colors,
    primary: '#6750A4',
    background: '#FFFFFF',
    card: '#FDFAFF',
    text: '#1C1B1F',
    border: '#CAC4D0',
    notification: '#B3261E',
  },
};

export const NavigationDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#D0BCFF',
    background: '#121212',
    card: '#1E1E1E',
    text: '#E6E1E5',
    border: '#49454F',
    notification: '#F2B8B5',
  },
};
