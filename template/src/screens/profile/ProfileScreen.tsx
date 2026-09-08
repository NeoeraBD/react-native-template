import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useStores } from '@app/core';
import {
  CustomHeader,
  CustomAvatar,
  CustomCard,
  CustomButton,
  CustomDialog,
  fontFamilies,
} from '@app/ui';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

export const ProfileScreen = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { authStore } = useStores();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleOpenDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
  const handleShowLogout = useCallback(() => setShowLogoutDialog(true), []);
  const handleDismissLogout = useCallback(() => setShowLogoutDialog(false), []);
  const handleConfirmLogout = useCallback(() => {
    setShowLogoutDialog(false);
    authStore.logout();
  }, [authStore]);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  const logoutBtnStyle = useMemo(
    () => [styles.btn, { backgroundColor: theme.colors.error }],
    [theme.colors.error],
  );

  const labelStyle = useMemo(
    () => [styles.label, { color: theme.colors.outline }],
    [theme.colors.outline],
  );

  const valStyle = useMemo(
    () => [styles.val, { color: theme.colors.onSurface }],
    [theme.colors.onSurface],
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={containerStyle}>
      <CustomHeader
        title={t('profile.title')}
        onMenuPress={handleOpenDrawer}
      />

      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <CustomAvatar
            type="text"
            value={authStore.user?.name || 'US'}
            size={90}
          />
        </View>

        <CustomCard title={authStore.user?.name || 'Guest User'} style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={labelStyle}>{t('profile.username')}</Text>
            <Text style={valStyle}>{authStore.user?.name || 'Guest'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={labelStyle}>{t('profile.email')}</Text>
            <Text style={valStyle}>{authStore.user?.email || 'guest@domain.com'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={labelStyle}>{t('profile.role')}</Text>
            <Text style={valStyle}>{authStore.user?.role || 'Guest'}</Text>
          </View>
        </CustomCard>

        <CustomButton
          mode="contained"
          onPress={handleShowLogout}
          style={logoutBtnStyle}
          icon="logout"
        >
          {t('profile.logoutButton')}
        </CustomButton>
      </View>

      <CustomDialog
        visible={showLogoutDialog}
        title={t('profile.logoutButton')}
        message={t('profile.logoutConfirm')}
        confirmText={t('profile.logoutButton')}
        cancelText={t('common.cancel')}
        onConfirm={handleConfirmLogout}
        onDismiss={handleDismissLogout}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginVertical: 24,
  },
  card: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
  },
  val: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
  btn: {
    width: '100%',
    marginTop: 24,
  },
});

export default ProfileScreen;
