import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useLoginViewModel } from "./useLoginViewModel";
import {
  CustomFormInput,
  CustomButton,
  CustomThemeToggler,
  CustomLanguageToggler,
  CustomDialog,
  fontFamilies,
} from "@app/ui";

export const LoginScreen = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const viewModel = useLoginViewModel();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleLogin = useCallback(async () => {
    const error = await viewModel.submitLogin();
    if (error) {
      setShowErrorDialog(true);
    }
  }, [viewModel.submitLogin]);

  const handleDismissError = useCallback(() => setShowErrorDialog(false), []);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  const logoTextStyle = useMemo(
    () => [styles.logoText, { color: theme.colors.primary }],
    [theme.colors.primary],
  );

  const subtitleStyle = useMemo(
    () => [styles.subtitle, { color: theme.colors.onSurfaceVariant }],
    [theme.colors.onSurfaceVariant],
  );

  const langLabelStyle = useMemo(
    () => [styles.langLabel, { color: theme.colors.outline }],
    [theme.colors.outline],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={containerStyle}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerActions}>
          <CustomThemeToggler />
        </View>

        <View style={styles.logoContainer}>
          <Text variant="displaySmall" style={logoTextStyle}>
            React Native Template
          </Text>
          <Text variant="titleMedium" style={subtitleStyle}>
            {t("login.subtitle")}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomFormInput
            name="email"
            control={viewModel.control}
            label={t("login.emailLabel")}
            placeholder={t("login.emailPlaceholder")}
            keyboardType="email-address"
            leftIcon="email-outline"
            rules={{
              required: t("login.invalidEmail"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("login.invalidEmail"),
              },
            }}
          />

          <CustomFormInput
            name="password"
            control={viewModel.control}
            label={t("login.passwordLabel")}
            placeholder={t("login.passwordPlaceholder")}
            secureTextEntry
            leftIcon="lock-outline"
            rules={{
              required: t("login.invalidPassword"),
              minLength: {
                value: 6,
                message: t("login.invalidPassword"),
              },
            }}
          />

          <CustomButton
            mode="contained"
            onPress={handleLogin}
            loading={viewModel.isLoading}
            style={styles.button}
          >
            {t("login.button")}
          </CustomButton>
        </View>

        <View style={styles.languageSection}>
          <Text variant="labelLarge" style={langLabelStyle}>
            {t("settings.languageSection")}
          </Text>
          <CustomLanguageToggler />
        </View>
      </ScrollView>

      <CustomDialog
        visible={showErrorDialog}
        title={t("login.errorTitle")}
        message={viewModel.errorMessage || ""}
        onConfirm={handleDismissError}
        onDismiss={handleDismissError}
        showCancel={false}
      />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  logoText: {
    fontFamily: fontFamilies.bold,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    marginTop: 8,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  button: {
    marginTop: 16,
  },
  languageSection: {
    alignItems: "center",
    marginTop: "auto",
  },
  langLabel: {
    fontFamily: fontFamilies.semibold,
    marginBottom: 8,
  },
});

export default LoginScreen;
