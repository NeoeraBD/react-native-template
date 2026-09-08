import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Menu, TextInput, HelperText, useTheme } from 'react-native-paper';
import { fontFamilies } from '../theme/typography';

export interface DropdownItem<T extends string = string> {
  label: string;
  value: T;
}

interface CustomDropdownProps<T extends string = string> {
  label: string;
  items: DropdownItem<T>[];
  value: T | '';
  onValueChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CustomDropdown<T extends string = string>({
  label,
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
  style,
}: CustomDropdownProps<T>) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedLabel = useMemo(
    () => items.find(item => item.value === value)?.label ?? '',
    [items, value],
  );

  const menuContentStyle = useMemo(
    () => [styles.menuContent, { backgroundColor: theme.colors.surface }],
    [theme.colors.surface],
  );

  const open = useCallback(() => {
    if (!disabled) { setVisible(true); }
  }, [disabled]);

  const close = useCallback(() => setVisible(false), []);

  const menuItems = useMemo(
    () =>
      items.map(item => (
        <Menu.Item
          key={item.value}
          title={item.label}
          onPress={() => {
            onValueChange(item.value);
            setVisible(false);
          }}
          titleStyle={[
            styles.menuItemTitle,
            item.value === value && { color: theme.colors.primary },
          ]}
          trailingIcon={item.value === value ? 'check' : undefined}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, value, onValueChange, theme.colors.primary],
  );

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={visible}
        onDismiss={close}
        contentStyle={menuContentStyle}
        anchor={
          <TextInput
            mode="outlined"
            label={label}
            value={selectedLabel}
            placeholder={placeholder}
            editable={false}
            onPressIn={open}
            error={!!error}
            disabled={disabled}
            right={
              <TextInput.Icon
                icon={visible ? 'chevron-up' : 'chevron-down'}
                onPress={open}
              />
            }
            style={[styles.input, { fontFamily: fontFamilies.regular }]}
          />
        }
      >
        {menuItems}
      </Menu>
      <HelperText type="error" visible={!!error} style={styles.helper}>
        {error}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  input: {
    fontSize: 16,
  },
  menuContent: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  menuItemTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  helper: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
  },
});

export default CustomDropdown;
