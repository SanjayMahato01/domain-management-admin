'use client'

import { useEffect, useState } from 'react'

export function useAdminCurrency() {
  const [currency, setCurrency] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrency = async () => {
      const res = await fetch('/api/admin/fetch-admin-currency')
      const data = await res.json()

     
      if (res.ok) {
        setCurrency(data.currency)
      }
    }

    fetchCurrency()
  }, [])

  return currency
}
