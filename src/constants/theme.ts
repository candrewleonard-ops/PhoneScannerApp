export const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  success: '#059669',
  warning: '#f59e0b',
  danger: '#dc2626',
  background: '#ffffff',
  surface: '#f9fafb',
  surfaceAlt: '#f3f4f6',
  border: '#e5e7eb',
  borderDark: '#d1d5db',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textOnPrimary: '#ffffff',
  errorBg: '#fee2e2',
  errorText: '#991b1b',
  warningBg: '#fef3c7',
  warningText: '#92400e',
  successBg: '#d1fae5',
  successText: '#065f46',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 28,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  shadow,
} as const;

export type Theme = typeof theme;
