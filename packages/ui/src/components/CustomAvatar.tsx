import React, { memo } from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';

interface CustomAvatarProps {
  type?: 'text' | 'image' | 'icon';
  value: string; // url, character, or icon name
  size?: number;
  style?: ViewStyle;
}

export const CustomAvatar = memo<CustomAvatarProps>(function CustomAvatar({
  type = 'text',
  value,
  size = 40,
  style,
}) {
  switch (type) {
    case 'image':
      return <Avatar.Image source={{ uri: value }} size={size} style={[styles.avatar, style]} />;
    case 'icon':
      return <Avatar.Icon icon={value} size={size} style={[styles.avatar, style]} />;
    default:
      return <Avatar.Text label={value.substring(0, 2).toUpperCase()} size={size} style={[styles.avatar, style]} />;
  }
});

const styles = StyleSheet.create({
  avatar: {
    elevation: 1,
  },
});
