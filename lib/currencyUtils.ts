const exchangeRatesFromINR: Record<string, number> = {
  DOLLER: 1 / 83.2, // 1 INR = 0.012 USD
  // Add more currencies if needed
}


/**
 * Convert price stored in INR to admin currency
 * @param amount Price stored in INR
 * @param currency Admin's currency
 */
export function convertPrice(amount: number, currency: string | null): number {
  if (!currency || currency === 'INR') return amount // Already in INR

  const rate = exchangeRatesFromINR[currency]
  if (!rate) return amount 

  return amount * rate
}
