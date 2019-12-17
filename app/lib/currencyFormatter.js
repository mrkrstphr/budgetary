export function currencyFormatter(amount, opts = {}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    ...opts,
  });

  return formatter.format(amount);
}
