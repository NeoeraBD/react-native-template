import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PostsTab } from '../screens/home/PostsTab';
import { TrendingTab } from '../screens/home/TrendingTab';
import { fontFamilies } from '@app/ui';

export type HomeTopTabParamList = {
  PostsTab: undefined;
  TrendingTab: undefined;
};

const TopTab = createMaterialTopTabNavigator<HomeTopTabParamList>();

export const HomeTopTabNavigator = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIndicatorStyle: [styles.indicator, { backgroundColor: theme.colors.primary }],
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.colors.surface }],
        tabBarLabelStyle: styles.label,
        tabBarPressColor: theme.colors.primaryContainer,
      }}
    >
      <TopTab.Screen
        name="PostsTab"
        component={PostsTab}
        options={{ title: t('home.postsTitle') }}
      />
      <TopTab.Screen
        name="TrendingTab"
        component={TrendingTab}
        options={{ title: 'Trending' }}
      />
    </TopTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  indicator: {
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    textTransform: 'none',
  },
});

export default HomeTopTabNavigator;
