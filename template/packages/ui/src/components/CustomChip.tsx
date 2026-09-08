import React, { memo } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import { fontFamilies } from '../theme/typography';

interface CustomChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export const CustomChip = memo<CustomChipProps>(function CustomChip({
  children,
  selected = false,
  onPress,
  onClose,
  icon,
  style,
}) {
  return (
    <Chip
      selected={selected}
      onPress={onPress}
      onClose={onClose}
      icon={icon}
      style={[styles.chip, style]}
      textStyle={styles.text}
    >
      {children}
    </Chip>
  );
});

const styles = StyleSheet.create({
  chip: {
    margin: 4,
    borderRadius: 8,
  },
  text: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
});
