import React, { memo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { fontFamilies } from '../theme/typography';

interface CustomSearchbarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const CustomSearchbar = memo<CustomSearchbarProps>(function CustomSearchbar({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
}) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={[styles.search, style]}
      inputStyle={styles.input}
    />
  );
});

const styles = StyleSheet.create({
  search: {
    borderRadius: 8,
    marginVertical: 8,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    minHeight: 0,
  },
});
