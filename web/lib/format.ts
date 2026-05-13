export function formatMoroccanPrice(value: number) {
  const amount = Number.isInteger(value)
    ? value.toLocaleString('fr-MA', { maximumFractionDigits: 0 })
    : value.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return `${amount} DH`
}
