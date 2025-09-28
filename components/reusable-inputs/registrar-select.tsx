"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Registrar {
  id: number
  name: string
  status: "ACTIVE" | "INACTIVE"
  website: string
  apiEndpoint: string
  sandboxMode: boolean
}

interface RegistrarSelectProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  showRefresh?: boolean
  filterActive?: boolean
  registrars?: Registrar[]
}

export function RegistrarSelect({
  value,
  onValueChange,
  label = "Registrar",
  placeholder = "Select registrar",
  required = false,
  showRefresh = false,
  filterActive = false,
  registrars: initialRegistrars = [],
}: RegistrarSelectProps) {
  const [registrars, setRegistrars] = useState<Registrar[]>(initialRegistrars)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRegistrars = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `/api/registrar/fetch-active-registrar?filterActive=${filterActive}`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Failed to fetch registrars")
      }
      const data = await res.json()
      setRegistrars(data.data || [])
    } catch (err) {
      console.error(err)
      setError("Failed to fetch registrars")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialRegistrars.length === 0) {
      fetchRegistrars()
    }
  }, [filterActive])

  const handleRefresh = () => {
    fetchRegistrars()
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Label htmlFor="registrar">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

        </div>
      </div>


      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger id="registrar">
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {registrars.map((registrar) => (
            <SelectItem key={registrar.id} value={registrar.id.toString()}>
              <div className="flex items-center justify-between">
                <span>{registrar.name}</span>
                <span
                  className={`ml-2 h-2 w-2 rounded-full ${registrar.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
              </div>
            </SelectItem>
          ))}
          {registrars.length === 0 && !loading && (
            <SelectItem value="none" disabled>
              No registrars found
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
