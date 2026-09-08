import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useStores } from '@app/core';
import {
  CustomHeader,
  CustomSwitch,
  CustomLanguageToggler,
  fontFamilies,
} from '@app/ui';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

export const SettingsScreen = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { themeStore } = useStores();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const handleOpenDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
  const handleThemeChange = useCallback(
    (val: boolean) => themeStore.setDarkMode(val),
    [themeStore],
  );

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  const sectionTitleStyle = useMemo(
    () => [styles.sectionTitle, { color: theme.colors.onSurface }],
    [theme.colors.onSurface],
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={containerStyle}>
      <CustomHeader
        title={t('settings.title')}
        onMenuPress={handleOpenDrawer}
      />

      <View style={styles.content}>
        <Text variant="titleLarge" style={sectionTitleStyle}>
          {t('settings.themeSection')}
        </Text>
        <Card style={styles.card}>
          <CustomSwitch
            label={t('settings.themeDark')}
            value={themeStore.isDarkMode}
            onValueChange={handleThemeChange}
          />
        </Card>

        <Text variant="titleLarge" style={sectionTitleStyle}>
          {t('settings.languageSection')}
        </Text>
        <Card style={styles.card}>
          <View style={styles.langWrapper}>
            <CustomLanguageToggler />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  langWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default SettingsScreen;
