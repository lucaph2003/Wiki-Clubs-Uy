const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: 'UYU' | 'USD'): Intl.NumberFormat {
  const cached = currencyFormatters.get(currency);
  if (cached) return cached;
  const formatter = new Intl.NumberFormat('es-UY', { style: 'currency', currency, maximumFractionDigits: 0 });
  currencyFormatters.set(currency, formatter);
  return formatter;
}

export function formatCurrency(value: number, currency: 'UYU' | 'USD'): string {
  return currencyFormatter(currency).format(value);
}

/** `0` es el sentinel de "año desconocido" en los mocks (§8.9): nunca se muestra como fecha real. */
export function formatYear(year: number): string {
  return year > 0 ? String(year) : 'año sin confirmar';
}
