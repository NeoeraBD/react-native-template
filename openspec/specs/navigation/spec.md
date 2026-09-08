# Specification: Navigation System (React Navigation 7)

## 1. Overview
The application uses **React Navigation 7** with complete TypeScript type safety and multi-level navigational structures (Native Stack, Drawer, Bottom Tabs, Material Top Tabs).

```
AppNavigator (Root Switcher)
 ├── (Not Authenticated) ──> AuthStackNavigator (Native Stack)
 │                            ├── LoginScreen
 │                            └── RegisterScreen / ForgotPassword
 └── (Authenticated)     ──> DrawerNavigator (Drawer)
                              ├── TabNavigator (Bottom Tabs)
                              │    ├── HomeScreen (contains TopTabNavigator)
                              │    │    ├── PostsTab
                              │    │    └── TrendingTab
                              │    ├── DashboardScreen
                              │    ├── ProfileScreen
                              │    └── SettingsScreen
                              └── Custom Drawer Content
```

## 2. Navigators & Structure (`src/navigation/`)

### 2.1 `AppNavigator.tsx`
- Serves as the root navigation container.
- Wrapped in `observer` from `mobx-react-lite`.
- Reads `authStore.isAuthenticated` to dynamically swap between `AuthStackNavigator` and `DrawerNavigator`.
- Applies the navigation theme based on `themeStore.isDarkMode`.

### 2.2 `AuthStackNavigator.tsx`
- Type: `@react-navigation/native-stack`.
- Contains unauthenticated onboarding and authentication flows.
- Header options: clean MD3 header styling or `headerShown: false`.

### 2.3 `DrawerNavigator.tsx`
- Type: `@react-navigation/drawer`.
- Hosts the primary authenticated shell.
- Integrates custom drawer content with user profile header, navigation items, theme toggle, language toggle, and logout button.

### 2.4 `TabNavigator.tsx`
- Type: `@react-navigation/bottom-tabs`.
- Primary bottom tab navigation bar with vector icons and Material Design 3 active indicator pills.
- Screens: Home, Dashboard, Profile, Settings.

### 2.5 `TopTabNavigator.tsx`
- Type: `@react-navigation/material-top-tabs` (powered by `react-native-pager-view`).
- Embedded inside `HomeScreen` to demonstrate nested horizontal tab pagination.

### 2.6 `navigationRef.ts`
- Provides an imperative reference for triggering navigation actions outside of React components (e.g., inside network error interceptors or background notification handlers).
```typescript
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
```

## 3. Type-Safe Navigation Guidelines
- Always define route param types using `ParamListBase` or specific interfaces.
- Avoid using loose `any` for route params.
- When navigating, use typed navigation props:
```typescript
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const navigation = useNavigation<NavigationProp>();
navigation.navigate('Dashboard', { userId: '123' });
```
