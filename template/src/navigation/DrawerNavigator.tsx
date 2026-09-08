import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, useTheme, Divider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '@app/core';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies } from '@app/ui';

export type DrawerParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = observer((props: DrawerContentComponentProps) => {
  const { authStore } = useStores();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Avatar.Text
          label={authStore.user?.name.substring(0, 2).toUpperCase() || 'US'}
          size={60}
          style={{ backgroundColor: theme.colors.primaryContainer }}
        />
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>
          {authStore.user?.name || 'Guest User'}
        </Text>
        <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
          {authStore.user?.email || 'guest@domain.com'}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => authStore.logout()}
          icon="logout"
          style={[styles.logoutBtn, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
        >
          {t('profile.logoutButton')}
        </Button>
      </View>
    </DrawerContentScrollView>
  );
});

export const DrawerNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerActiveBackgroundColor: theme.colors.secondaryContainer,
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: t('home.title'),
          drawerIcon: ({ color, size }) => <Icon name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: t('profile.title'),
          drawerIcon: ({ color, size }) => <Icon name="account-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: t('settings.title'),
          drawerIcon: ({ color, size }) => <Icon name="cog-outline" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    marginTop: 10,
  },
  email: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  divider: {
    marginHorizontal: 16,
  },
  drawerList: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    padding: 20,
  },
  logoutBtn: {
    borderRadius: 8,
  },
});
export default DrawerNavigator;
