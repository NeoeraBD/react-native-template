# Specification: UI Component System (@app/ui - 31 Components)

## 1. Overview
The `@app/ui` package provides 31 production-ready, highly reusable components built on top of **React Native Paper (MD3)** with custom styling, accessibility, and strict TypeScript types.

## 2. Component Inventory by Category

### 2.1 Layout Components
| Component | Description | Key Props |
|---|---|---|
| `Row` | Flexbox row layout container | `justifyContent`, `alignItems`, `gap`, `style`, `children` |
| `Col` | Flexbox column layout container | `justifyContent`, `alignItems`, `gap`, `style`, `children` |

### 2.2 Display Components
| Component | Description | Key Props |
|---|---|---|
| `CustomHeader` | Screen or section header | `title`, `subtitle`, `showBack`, `onBackPress`, `rightAction` |
| `CustomAvatar` | User avatar image, text initials, or icon | `source`, `label`, `icon`, `size`, `backgroundColor` |
| `CustomBadge` | Notification badge or counter pill | `children` (count/text), `size`, `visible`, `style` |
| `CustomCard` | Content card container | `title`, `subtitle`, `content`, `coverImage`, `actions`, `onPress` |
| `CustomChip` | Tag or filter chip with icon and close button | `label`, `selected`, `onPress`, `onClose`, `icon` |
| `CustomDivider` | Line divider with optional spacing | `horizontalInset`, `bold`, `style` |
| `CustomListItem` | List item row with left/right icons and title | `title`, `description`, `leftIcon`, `rightIcon`, `onPress` |
| `CustomProgressBar` | Progress indicator bar | `progress` (0 to 1), `color`, `indeterminate` |
| `CustomLoader` | Full-screen or inline spinner loader | `visible`, `text`, `overlay` |
| `CustomToast` | Animated toast popup | Managed via `useToastStore()` |

### 2.3 Form & Input Components
Every input component has a standard version and a React Hook Form controlled wrapper prefixed with `Form`:

| Component | Standard Form Wrapper | Description |
|---|---|---|
| `CustomInput` | `CustomFormInput` | Text input supporting icons, password toggle, error states, and outline variant |
| `CustomDropdown` | `CustomFormDropdown` | Select modal dropdown with search, multiple selection, and key/value mapping |
| `CustomDatePicker` | `CustomFormDatePicker` | Date & time picker integrating `@react-native-community/datetimepicker` |
| `CustomFilePicker` | `CustomFormFilePicker` | Document / file picker with file size preview and extension filtering |
| `CustomSwitch` | `CustomFormSwitch` | MD3 toggle switch with label |
| `CustomSearchbar` | — | Search bar with clear button, debounce support, and search icon |

### 2.4 Buttons & Action Components
| Component | Description | Key Props |
|---|---|---|
| `CustomButton` | MD3 Button (contained, outlined, text) | `title`, `mode`, `loading`, `disabled`, `icon`, `onPress` |
| `CustomFAB` | Floating action button | `icon`, `label`, `onPress`, `extended`, `style` |
| `CustomDownloadButton` | Download button with progress bar and status | `url`, `fileName`, `destinationPath`, `onComplete` |

### 2.5 Modals & Bottom Sheets
| Component | Description | Key Props |
|---|---|---|
| `CustomDialog` | Alert or confirmation dialog | `visible`, `title`, `message`, `onConfirm`, `onCancel` |
| `CustomBottomSheet` | Slide-up modal sheet container | `visible`, `onDismiss`, `title`, `children`, `snapPoints` |

### 2.6 Lists & Feed
| Component | Description | Key Props |
|---|---|---|
| `CustomFlatList` | Optimized FlatList with pull-to-refresh, empty state, and footer loader | `data`, `renderItem`, `keyExtractor`, `refreshing`, `onRefresh`, `emptyText` |

### 2.7 App Togglers
| Component | Description | Key Props |
|---|---|---|
| `CustomThemeToggler` | Toggle between Light and Dark mode | Integrated with `ThemeStore` |
| `CustomLanguageToggler` | Toggle between English and Bengali | Integrated with `LanguageStore` & `i18n` |

## 3. Usage Guidelines

### 3.1 React Hook Form Example
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { CustomFormInput, CustomFormDropdown, CustomButton, Col } from '@app/ui';

interface FormValues {
  username: string;
  role: string;
}

export const RegistrationForm = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { username: '', role: '' },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <Col gap={16}>
      <CustomFormInput
        name="username"
        control={control}
        label="Username"
        rules={{ required: 'Username is required' }}
      />
      <CustomFormDropdown
        name="role"
        control={control}
        label="Select Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]}
        rules={{ required: 'Role is required' }}
      />
      <CustomButton title="Save" onPress={handleSubmit(onSubmit)} />
    </Col>
  );
};
```

### 3.2 Theme & Styling Rules
- **Colors**: Access theme colors through `useTheme()` from `react-native-paper` (e.g. `theme.colors.primary`, `theme.colors.surface`).
- **Typography**: Typography is configured with the Inter font family (Regular 400, Medium 500, SemiBold 600, Bold 700).
- **StyleProp Safety**: Always pass custom styles using `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` to eliminate runtime styling warnings.
