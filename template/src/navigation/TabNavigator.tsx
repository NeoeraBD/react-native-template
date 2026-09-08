import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export type TabParamList = {
  HomeTab: undefined;
  DashboardTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'DashboardTab') {
            iconName = 'view-dashboard';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopWidth: 0,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: t('home.title') }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: t('dashboard.title') }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
