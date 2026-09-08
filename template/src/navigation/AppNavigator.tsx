import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useStores } from '@app/core';
import AuthStackNavigator from './AuthStackNavigator';
import DrawerNavigator from './DrawerNavigator';
import { NavigationLightTheme, NavigationDarkTheme } from '@app/ui';
import { navigationRef } from './navigationRef';

const linking = {
  prefixes: ['helloworld://', 'https://helloworld.com'],
  config: {
    screens: {
      // Unauthenticated screen
      Login: 'login',

      // Authenticated screens nested inside DrawerNavigator
      DrawerNavigator: {
        screens: {
          MainTabs: {
            path: 'main',
            screens: {
              HomeTab: 'home',
              DashboardTab: 'dashboard',
            },
          },
          Profile: 'profile',
          Settings: 'settings',
        },
      },
    },
  },
};

export const AppNavigator = observer(() => {
  const { authStore, themeStore } = useStores();

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={themeStore.isDarkMode ? NavigationDarkTheme : NavigationLightTheme}
      linking={linking}
    >
      {authStore.isAuthenticated ? <DrawerNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
});
export default AppNavigator;
