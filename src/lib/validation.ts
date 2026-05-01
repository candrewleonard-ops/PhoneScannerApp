export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isNonEmpty(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
