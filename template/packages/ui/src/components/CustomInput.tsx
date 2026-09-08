import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { fontFamilies } from '../theme/typography';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const CustomInput = memo<CustomInputProps>(function CustomInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  disabled = false,
}) {
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = useCallback(
    () => setPasswordVisible(prev => !prev),
    [],
  );

  const rightAdornment = useCallback(() => {
    if (secureTextEntry) {
      return (
        <TextInput.Icon
          icon={passwordVisible ? 'eye-off' : 'eye'}
          onPress={togglePasswordVisibility}
        />
      );
    }
    if (rightIcon) {
      return <TextInput.Icon icon={rightIcon} onPress={onRightIconPress} />;
    }
    return null;
  }, [secureTextEntry, passwordVisible, rightIcon, onRightIconPress, togglePasswordVisibility]);

  const leftAdornment = useCallback(
    () => (leftIcon ? <TextInput.Icon icon={leftIcon} /> : null),
    [leftIcon],
  );

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !passwordVisible}
        keyboardType={keyboardType}
        disabled={disabled}
        mode="outlined"
        error={!!error}
        left={leftIcon ? leftAdornment() : null}
        right={rightAdornment()}
        style={[styles.input, inputStyle]}
      />
      <HelperText type="error" visible={!!error} style={styles.errorText}>
        {error}
      </HelperText>
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
});
