import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { observer } from "mobx-react-lite";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader, CustomFAB, CustomDialog } from "@app/ui";
import { HomeTopTabNavigator } from "../../navigation/TopTabNavigator";
import { DrawerParamList } from "../../navigation/DrawerNavigator";

export const HomeScreen = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleOpenDrawer = useCallback(
    () => navigation.openDrawer(),
    [navigation],
  );
  const handleOpenDialog = useCallback(() => setShowAddDialog(true), []);
  const handleCloseDialog = useCallback(() => setShowAddDialog(false), []);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <CustomHeader title={t("home.title")} onMenuPress={handleOpenDrawer} />

      <HomeTopTabNavigator />

      <CustomFAB
        icon="plus"
        onPress={handleOpenDialog}
        label={t("home.fabLabel")}
      />

      <CustomDialog
        visible={showAddDialog}
        title={t("home.fabLabel")}
        message="This is a demonstration of opening a custom alert modal on Floating Action Button (FAB) pressed. Reusable components work instantly!"
        confirmText={t("common.ok")}
        onConfirm={handleCloseDialog}
        onDismiss={handleCloseDialog}
        showCancel={false}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
