import React, { memo } from 'react';
import { StyleSheet, View, Modal, Pressable, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CustomBottomSheet = memo<CustomBottomSheetProps>(function CustomBottomSheet({
  visible,
  onClose,
  children,
  style,
}) {
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }, style]}>
          <View style={[styles.dragHandle, { backgroundColor: theme.colors.outlineVariant }]} />
          {children}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    minHeight: 200,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
