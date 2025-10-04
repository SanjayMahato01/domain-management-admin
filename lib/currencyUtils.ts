const exchangeRatesFromINR: Record<string, number> = {
  DOLLAR: 83.2, // 1 USD = 83.2 INR (correct rate for conversion)
  EURO: 90.1, // Example: 1 EUR = 90.1 INR
  POUND: 105.5, // Example: 1 GBP = 105.5 INR
  // Add more currencies as needed
}

/**
 * Convert price stored in INR to admin currency
 * @param amount Price stored in INR
 * @param currency Admin's currency
 */
export function convertPrice(amount: number, currency: string | null): number {
  if (!currency || currency === 'INR') return amount // Already in INR

  const rate = exchangeRatesFromINR[currency.toUpperCase()]
  if (!rate) return amount 

  // Convert INR to target currency: amount (INR) / rate (INR per target currency)
  return amount / rate
}

