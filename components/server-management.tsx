import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Plus,
  Edit,
  Trash2,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Activity,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react"
import * as z from "zod"
import { toast } from "sonner"

// Validation Schema
const serverSchema = z.object({
  serverName: z.string()
    .min(1, "Server name is required")
    .min(3, "Server name must be at least 3 characters")
    .max(50, "Server name must be less than 50 characters"),

  hostName: z.string()
    .min(1, "Hostname is required")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Invalid hostname format"),

  ipAddress: z.string()
  .min(1, "IP address is required")
  .regex(
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
    "Invalid IP address format"
  ),

  apiKey: z.string()
    .min(1, "API key is required")
    .min(10, "API key must be at least 10 characters")
    .max(255, "API key is too long"),

  location: z.string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),

  controlPanel: z.enum(['CPANEL', 'PLESK', 'DIRECTADMIN', 'CYBERPANEL'], {
    message: "Please select a control panel"
  }),

  maxAmount: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Max amount must be a positive number"),

  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE'])
})

type PerformanceData = {
  [id: string]: number;
};

type ServerFormData = z.infer<typeof serverSchema>

const controlPanels = [
  { value: "CPANEL", label: "cPanel/WHM" },
  { value: "PLESK", label: "Plesk" },
  { value: "DIRECTADMIN", label: "DirectAdmin" },
  { value: "CYBERPANEL", label: "CyberPanel" },
]

const statusOptions = [
  { value: "ONLINE", label: "Online" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OFFLINE", label: "Offline" },
]

// Server Form Component
function ServerForm({
  isEdit = false,
  defaultValues,
  onSubmit,
  isLoading
}: {
  isEdit?: boolean
  defaultValues?: Partial<ServerFormData>
  onSubmit: (data: ServerFormData) => void
  isLoading: boolean
}) {
  const [showApiKey, setShowApiKey] = useState(false)

  const form = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      serverName: defaultValues?.serverName ?? "",
      hostName: defaultValues?.hostName ?? "",
      ipAddress: defaultValues?.ipAddress ?? "",
      apiKey: defaultValues?.apiKey ?? "",
      location: defaultValues?.location ?? "",
      controlPanel: defaultValues?.controlPanel ?? "CPANEL",
      maxAmount: defaultValues?.maxAmount ?? "",
      status: defaultValues?.status ?? "ONLINE",
    }
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serverName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Name</FormLabel>
                <FormControl>
                  <Input placeholder="Web Server 01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostname</FormLabel>
                <FormControl>
                  <Input placeholder="web01.hostpanel.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="US East (Virginia)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter API key for server monitoring"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="controlPanel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Panel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control panel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {controlPanels.map((panel) => (
                      <SelectItem key={panel.value} value={panel.value}>
                        {panel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Accounts</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Server' : 'Add Server'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Server Overview Component
function ServerOverview({
  servers,
  onEditServer,
  onDeleteServer,
  onRefreshPerformance,
  performanceData,
  isLoadingPerformance
}: {
  servers: any[]
  onEditServer: (server: any) => void
  onDeleteServer: (id: string) => void
  onRefreshPerformance: (serverId: string) => void
  performanceData: Record<string, any>
  isLoadingPerformance: Record<string, boolean>
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ONLINE":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "MAINTENANCE":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "OFFLINE":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: "ONLINE" | "MAINTENANCE"  | "OFFLINE") => {
    switch (status) {
      case "ONLINE":
        return "default"
      case "MAINTENANCE":
        return "secondary"
      case "OFFLINE":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => {
        const performance = performanceData[server.id]
        const maxAccounts = server.maxAmount ? parseInt(server.maxAmount) : 100
        const activeAccounts = performance?.activeAccounts || 0

        return (
          <Card key={server.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(server.status)}
                  <CardTitle className="text-lg">{server.serverName}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRefreshPerformance(server.id)}
                    disabled={isLoadingPerformance[server.id]}
                  >
                    {isLoadingPerformance[server.id] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                  <Badge variant={getStatusBadgeVariant(server.status)}>{server.status}</Badge>
                </div>
              </div>
              <CardDescription className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>{server.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Hostname</span>
                  <span className="font-mono text-xs">{server.hostName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>IP Address</span>
                  <span className="font-mono text-xs">{server.ipAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Control Panel</span>
                  <span className="font-medium">{server.controlPanel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Accounts</span>
                    <span className="font-medium">
                      {activeAccounts}/{maxAccounts}
                    </span>
                  </div>
                  <Progress value={(activeAccounts / maxAccounts) * 100} className="h-2" />
                </div>
              </div>

              {performance && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Activity className="mr-1 h-3 w-3" />
                      Uptime
                    </span>
                    <span className="font-medium text-green-600">{performance.uptime}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => onEditServer(server)} className="flex-1">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteServer(server.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Server Performance Component
function ServerPerformance({
  servers,
  performanceData,
  onRefreshPerformance,
  isLoadingPerformance
}: {
  servers: any[]
  performanceData: Record<string, any>
  onRefreshPerformance: (serverId: string) => void
  isLoadingPerformance: Record<string, boolean>
}) {
  return (
    <div className="grid gap-4">
      {servers
        .filter((server) => server.status === "ONLINE")
        .map((server) => {
          const performance = performanceData[server.id]

          if (!performance && !isLoadingPerformance[server.id]) {
            return (
              <Card key={server.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="h-5 w-5" />
                      <span>{server.serverName}</span>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRefreshPerformance(server.id)}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Load Performance
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No performance data available. Click "Load Performance" to fetch data.
                  </div>
                </CardContent>
              </Card>
            )
          }

          if (isLoadingPerformance[server.id]) {
            return (
              <Card key={server.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5" />
                    <span>{server.serverName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Loading performance data...</p>
                  </div>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={server.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5" />
                    <span>{server.serverName}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{server.location}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRefreshPerformance(server.id)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Cpu className="mr-2 h-4 w-4" />
                        CPU Usage
                      </span>
                      <span className="font-medium">{performance.cpu.usage}%</span>
                    </div>
                    <Progress value={performance.cpu.usage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {performance.cpu.cores} cores - {performance.cpu.model}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <MemoryStick className="mr-2 h-4 w-4" />
                        Memory
                      </span>
                      <span className="font-medium">{performance.memory.usage}%</span>
                    </div>
                    <Progress value={performance.memory.usage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {performance.memory.used.toFixed(1)}GB / {performance.memory.total}GB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <HardDrive className="mr-2 h-4 w-4" />
                        Storage
                      </span>
                      <span className="font-medium">{performance.storage.usage}%</span>
                    </div>
                    <Progress value={performance.storage.usage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {performance.storage.used.toFixed(0)}GB / {performance.storage.total}GB {performance.storage.type}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Network className="mr-2 h-4 w-4" />
                        Network
                      </span>
                      <span className="font-medium">{performance.network.usage}%</span>
                    </div>
                    <Progress value={performance.network.usage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{performance.network.bandwidth}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  Last updated: {new Date(performance.lastUpdate).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}

// Main Component
export default function ServerManagement() {
  const [servers, setServers] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData>({})
  const [isLoadingPerformance, setIsLoadingPerformance] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<any>(null)

  // Fetch servers on mount
  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/servers/get-all-servers')
      const data = await response.json()

      if (data.success) {
        setServers(data.data)
      } else {
        toast.error(data.error || "Failed to fetch servers")
      }
    } catch (error) {
      toast.error("Failed to fetch servers")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServerPerformance = async (serverId: string) => {
    try {
      setIsLoadingPerformance(prev => ({ ...prev, [serverId]: true }))

      const response = await fetch(`/api/servers/performance/${serverId}`)
      const data = await response.json()

      if (data.success) {
        setPerformanceData(prev => ({ ...prev, [serverId]: data.data.performance }))
      } else {
        toast.error(data.error || "Failed to fetch performance data")
      }
    } catch (error) {
      toast.error("Failed to fetch performance data")
    } finally {
      setIsLoadingPerformance(prev => ({ ...prev, [serverId]: false }))
    }
  }

  const handleCreateServer = async (data: ServerFormData) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/servers/add-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setServers(prev => [result.data, ...prev])
        setIsCreateDialogOpen(false)
        toast("Server created successfully")
      } else {
        toast.error( result.error || "Failed to create server")
      }
    } catch (error) {
      toast.error("Failed to create server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditServer = (server: any) => {
    setEditingServer(server)
  }

  const handleUpdateServer = async (data: ServerFormData) => {
    if (!editingServer) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/servers/update-server/${editingServer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setServers(prev => prev.map(s => s.id === editingServer.id ? result.data : s))
        setEditingServer(null)
        toast("Server updated successfully")
      } else {
        toast.error(
          result.error || "Failed to update server",
        )
      }
    } catch (error) {
      toast.error( "Failed to update server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteServer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this server?')) return

    try {
      const response = await fetch(`/api/servers/delete-server/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setServers(prev => prev.filter(s => s.id !== id))
        setPerformanceData(prev => {
          const newData = { ...prev }
          delete newData[id]
          return newData
        })


        toast.success( "Server deleted successfully")
      } else {
        toast.error( result.error || "Failed to delete server",
        )
      }
    } catch (error) {
      toast.error( "Failed to delete server")
    }
  }

  if (isLoading && servers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading servers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Management</h1>
          <p className="text-muted-foreground">Monitor and manage your hosting infrastructure</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchServers}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Server
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Server</DialogTitle>
                <DialogDescription>Configure a new server for your hosting infrastructure</DialogDescription>
              </DialogHeader>
              <ServerForm
                onSubmit={handleCreateServer}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {servers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Server className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No servers found</h3>
            <p className="text-muted-foreground">Get started by adding your first server</p>
            <Button
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Server
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ServerOverview
              servers={servers}
              onEditServer={handleEditServer}
              onDeleteServer={handleDeleteServer}
              onRefreshPerformance={fetchServerPerformance}
              performanceData={performanceData}
              isLoadingPerformance={isLoadingPerformance}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <ServerPerformance
              servers={servers}
              performanceData={performanceData}
              onRefreshPerformance={fetchServerPerformance}
              isLoadingPerformance={isLoadingPerformance}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Server Dialog */}
      <Dialog open={!!editingServer} onOpenChange={() => setEditingServer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Server</DialogTitle>
            <DialogDescription>Update server configuration and settings</DialogDescription>
          </DialogHeader>
          <ServerForm
            isEdit
            defaultValues={editingServer ? {
              serverName: editingServer.serverName,
              hostName: editingServer.hostName,
              ipAddress: editingServer.ipAddress,
              apiKey: editingServer.apiKey,
              location: editingServer.location,
              controlPanel: editingServer.controlPanel,
              maxAmount: editingServer.maxAmount || "",
              status: editingServer.status
            } : undefined}
            onSubmit={handleUpdateServer}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}