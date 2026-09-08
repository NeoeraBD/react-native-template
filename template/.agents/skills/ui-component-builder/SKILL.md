---
name: ui-component-builder
description: Design and implement mobile UI screens and forms using the 31 React Native Paper MD3 components in @app/ui.
---

# UI Component Builder Skill

This skill provides comprehensive instructions on how to leverage the 31 custom Material Design 3 components in `@app/ui` to build responsive, accessible, and theme-adaptive screens.

## Component Quick Lookup Table

### Layout
- `Row`: Horizontal flexbox layout (`<Row justifyContent="space-between" alignItems="center" gap={8}>{children}</Row>`)
- `Col`: Vertical flexbox layout (`<Col gap={16}>{children}</Col>`)

### Screen Header & Display
- `CustomHeader`: Standard top header with back button, title, and action icons.
- `CustomAvatar`: Avatar supporting remote image URL, name initials, or icon.
- `CustomBadge`: Notification badge or counter pill.
- `CustomCard`: Content container with title, subtitle, cover image, and action buttons.
- `CustomChip`: Tag / filter chip supporting selection state, icon, and dismiss.
- `CustomDivider`: Clean divider rule.
- `CustomListItem`: List item row with left/right icons and press handler.
- `CustomProgressBar`: Progress bar with determinate or indeterminate modes.
- `CustomLoader`: Fullscreen or inline overlay loading spinner.
- `CustomToast`: Animated toast banner driven by `useToastStore()`.

### Form Controls (React Hook Form Compatible)
Always use the `Form` variant when integrating inside forms:
- `CustomFormInput`: Wrapped TextInput with label, helper text, error handling, and password toggle.
- `CustomFormDropdown`: Modal select picker with searchable list and multi-select option.
- `CustomFormDatePicker`: Date/Time picker using `@react-native-community/datetimepicker`.
- `CustomFormFilePicker`: Native document picker with preview, file size, and extension filters.
- `CustomFormSwitch`: Labelled toggle switch.
- `CustomSearchbar`: Search input with debounce and clear button.

### Action Buttons & Sheets
- `CustomButton`: MD3 button (`mode="contained" | "outlined" | "text"`).
- `CustomFAB`: Floating action button.
- `CustomDownloadButton`: Integrated file download button with progress animation.
- `CustomDialog`: Alert and confirmation dialog with custom actions.
- `CustomBottomSheet`: Slide-up modal bottom sheet.

### Lists & Feed
- `CustomFlatList`: Optimized FlatList with pull-to-refresh, empty state, and footer spinner.

### Togglers
- `CustomThemeToggler`: Theme switch (Dark / Light mode).
- `CustomLanguageToggler`: Language switch (English / Bengali).

---

## Form Composition Pattern

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Col,
  CustomFormInput,
  CustomFormDropdown,
  CustomFormDatePicker,
  CustomButton,
  CustomCard,
} from '@app/ui';

interface CreatePostForm {
  title: string;
  category: string;
  publishDate: Date;
}

export const CreatePostView = () => {
  const { control, handleSubmit } = useForm<CreatePostForm>({
    defaultValues: {
      title: '',
      category: '',
      publishDate: new Date(),
    },
  });

  const onSubmit = (data: CreatePostForm) => {
    console.log('Form data:', data);
  };

  return (
    <CustomCard title="Create New Post">
      <Col gap={14}>
        <CustomFormInput
          name="title"
          control={control}
          label="Post Title"
          rules={{ required: 'Title is required' }}
        />
        <CustomFormDropdown
          name="category"
          control={control}
          label="Category"
          options={[
            { label: 'Technology', value: 'tech' },
            { label: 'Business', value: 'biz' },
            { label: 'Design', value: 'design' },
          ]}
          rules={{ required: 'Category is required' }}
        />
        <CustomFormDatePicker
          name="publishDate"
          control={control}
          label="Publish Date"
          mode="date"
        />
        <CustomButton
          title="Submit Post"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        />
      </Col>
    </CustomCard>
  );
};
```

## Theming & Styling Guidelines
1. Always import `useTheme` from `react-native-paper` to read palette tokens (`colors.primary`, `colors.surface`, `colors.onSurface`).
2. Component style props must use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`.
3. Typography automatically applies the Inter font family defined in `@app/ui/src/theme/typography.ts`.
