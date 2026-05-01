import React from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/constants/theme';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : undefined, multiline ? styles.multiline : undefined]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? (keyboardType === 'email-address' ? 'none' : 'sentences')}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.textMuted}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.background,
  },
  multiline: {
    minHeight: 100,
    paddingTop: spacing.sm + 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});

export default TextInput;
