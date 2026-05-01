export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(squareFeet: number | undefined | null): string {
  if (squareFeet === undefined || squareFeet === null) return '—';
  return `${squareFeet.toFixed(0)} sq ft`;
}

export function formatHeight(feet: number | undefined | null): string {
  if (feet === undefined || feet === null) return '—';
  return `${feet.toFixed(1)} ft`;
}

export function formatLength(feet: number | undefined | null): string {
  if (feet === undefined || feet === null) return '—';
  return `${feet.toFixed(1)} ft`;
}

export function formatDate(input: string | Date | undefined | null): string {
  if (!input) return '—';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
