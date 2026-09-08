import React, { memo, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Pressable, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TextInput, HelperText, Portal, Dialog, Button, useTheme } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { fontFamilies } from '../theme/typography';

export interface CustomDatePickerProps {
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  formatString?: (date: Date) => string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const CustomDatePicker = memo<CustomDatePickerProps>(function CustomDatePicker({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder,
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  formatString,
  style,
  inputStyle,
}) {
  const theme = useTheme();
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [showIosDialog, setShowIosDialog] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const formattedValue = useMemo(() => {
    if (!value) return '';
    if (formatString) return formatString(value);

    if (mode === 'date') {
      return value.toLocaleDateString();
    } else if (mode === 'time') {
      return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return `${value.toLocaleDateString()} ${value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }, [value, mode, formatString]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (Platform.OS === 'android') {
      setShowAndroidPicker(true);
    } else {
      setTempDate(value || new Date());
      setShowIosDialog(true);
    }
  }, [disabled, value]);

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowAndroidPicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange?.(selectedDate);
      }
    },
    [onChange]
  );

  const handleIosChange = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  }, []);

  const handleIosConfirm = useCallback(() => {
    if (tempDate) {
      onChange?.(tempDate);
    }
    setShowIosDialog(false);
  }, [tempDate, onChange]);

  const handleIosCancel = useCallback(() => {
    setShowIosDialog(false);
  }, []);

  const rightIconName = mode === 'time' ? 'clock-outline' : 'calendar';

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={handlePress} disabled={disabled}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={formattedValue}
            placeholder={placeholder}
            mode="outlined"
            error={!!error}
            disabled={disabled}
            right={<TextInput.Icon icon={rightIconName} />}
            style={[styles.input, inputStyle]}
          />
        </View>
      </Pressable>

      <HelperText type="error" visible={!!error} style={styles.errorText}>
        {error}
      </HelperText>

      {/* Android Picker */}
      {Platform.OS === 'android' && showAndroidPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={handleAndroidChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Picker Dialog */}
      {Platform.OS === 'ios' && (
        <Portal>
          <Dialog visible={showIosDialog} onDismiss={handleIosCancel} style={[styles.dialog, { backgroundColor: theme.colors?.elevation?.level3 || theme.colors?.surface }]}>
            <Dialog.Title style={styles.dialogTitle}>{label}</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <DateTimePicker
                value={tempDate || new Date()}
                mode={mode}
                display="spinner"
                onChange={handleIosChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                textColor={theme.colors?.onSurface}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleIosCancel}>Cancel</Button>
              <Button onPress={handleIosConfirm}>Confirm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  input: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
  },
  dialog: {
    borderRadius: 8,
  },
  dialogTitle: {
    fontFamily: fontFamilies.semibold,
    textAlign: 'center',
    fontSize: 18,
  },
  dialogContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomDatePicker;
