"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, DollarSign, Percent } from "lucide-react"
import { toast } from "sonner"

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "DOLLAR", symbol: "$", name: "US Dollar" },
]

export function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR")
  const [taxName, setTaxName] = useState("VAT")
  const [taxValue, setTaxValue] = useState("20")
  const [taxType, setTaxType] = useState<"percentage" | "fixed">("percentage")
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      
      // Load tax settings
      const taxResponse = await fetch('/api/settings/tax/get-tax')
      if (taxResponse.ok) {
        const taxData = await taxResponse.json()
        setTaxName(taxData.name)
        setTaxValue(taxData.value)
      }

      // Load currency settings
      const currencyResponse = await fetch('/api/settings/currency/get-currency')
    
      if (currencyResponse.ok) {
        const currencyData = await currencyResponse.json()
        console.log(currencyData)
        setSelectedCurrency(currencyData.currency)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Save tax settings
      await fetch('/api/settings/tax/update-tax', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taxName,
          value: taxValue,
        }),
      })

      // Save currency settings
      await fetch('/api/settings/currency/update-currency', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: selectedCurrency,
        }),
      })

      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert("Failed to save settings!")
    } finally {
      setLoading(false)
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Currency Settings Skeleton */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Configuration Skeleton */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="space-y-1">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button Skeleton */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Manage your platform configuration and preferences
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Currency Settings */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Currency Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Select your default currency for billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium">
                Default Currency
              </Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-gray-500 text-xs">({currency.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tax Configuration */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Percent className="h-5 w-5 text-purple-600" />
              Tax Configuration
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure your default tax settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxName" className="text-sm font-medium">
                Tax Name
              </Label>
              <Input
                id="taxName"
                placeholder="e.g., VAT, GST, Sales Tax"
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxValue" className="text-sm font-medium">
                Tax Value ({taxType === 'percentage' ? '%' : 'Fixed Amount'})
              </Label>
              <Input
                id="taxValue"
                type="number"
                placeholder="e.g., 20"
                value={taxValue}
                onChange={(e) => setTaxValue(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxType" className="text-sm font-medium">
                Tax Type
              </Label>
              <Select value={taxType} onValueChange={(value: "percentage" | "fixed") => setTaxType(value)}>
                <SelectTrigger id="taxType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}