"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Server {
  id: string
  serverName: string
  hostName: string
  ipAddress: string
  location: string
  controlPanel: "CPANEL" | "PLESK" | "DIRECTADMIN" | "CYBERPANEL"
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE"
  maxAmount?: string
}

interface ServerSelectProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  showRefresh?: boolean
  filterOnline?: boolean
  servers?: Server[]
}

export function ServerSelect({
  value,
  onValueChange,
  label = "Server",
  placeholder = "Select server",
  required = false,
  showRefresh = false,
  filterOnline = false,
  servers: initialServers = [],
}: ServerSelectProps) {
  const [servers, setServers] = useState<Server[]>(initialServers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServers = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `/api/servers/get-all-servers`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Failed to fetch servers")
      }
      const data = await res.json()


      setServers(data.data || [])
    } catch (err) {
      console.error(err)
      setError("Failed to fetch servers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialServers.length === 0) {
      fetchServers()
    }
  }, [filterOnline])

  const handleRefresh = () => {
    fetchServers()
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Label htmlFor="server">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {showRefresh && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
      </div>

      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger id="server">
          <SelectValue placeholder={loading ? "Loading servers..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {servers.map((server) => (
            <SelectItem key={server.id} value={server.id}>
              <div className="flex items-center justify-between w-full">
                <span>{server.serverName} ({server.location})</span>
                <span
                  className={`ml-2 h-2 w-2 rounded-full ${
                    server.status === "ONLINE" 
                      ? "bg-green-500" 
                      : server.status === "MAINTENANCE" 
                      ? "bg-yellow-500" 
                      : "bg-gray-400"
                  }`}
                />
              </div>
            </SelectItem>
          ))}
          {servers.length === 0 && !loading && (
            <SelectItem value="none" disabled>
              No servers found
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}