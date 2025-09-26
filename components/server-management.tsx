"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"

// Mock data for servers
const mockServers = [
  {
    id: "server-01",
    name: "Web Server 01",
    hostname: "web01.hostpanel.com",
    ipAddress: "192.168.1.10",
    location: "US East (Virginia)",
    provider: "AWS",
    status: "online",
    uptime: "99.9%",
    cpu: {
      cores: 4,
      usage: 45,
      model: "Intel Xeon E5-2686 v4",
    },
    memory: {
      total: 16,
      used: 8.2,
      usage: 51,
    },
    storage: {
      total: 500,
      used: 180,
      usage: 36,
      type: "SSD",
    },
    network: {
      bandwidth: "1 Gbps",
      usage: 23,
    },
    os: "Ubuntu 22.04 LTS",
    controlPanel: "cPanel",
    activeAccounts: 45,
    maxAccounts: 100,
    lastUpdate: "2024-01-15T10:30:00Z",
  },
  {
    id: "server-02",
    name: "Web Server 02",
    hostname: "web02.hostpanel.com",
    ipAddress: "192.168.1.11",
    location: "US West (Oregon)",
    provider: "DigitalOcean",
    status: "online",
    uptime: "99.8%",
    cpu: {
      cores: 8,
      usage: 32,
      model: "Intel Xeon Gold 6140",
    },
    memory: {
      total: 32,
      used: 12.8,
      usage: 40,
    },
    storage: {
      total: 1000,
      used: 420,
      usage: 42,
      type: "NVMe SSD",
    },
    network: {
      bandwidth: "1 Gbps",
      usage: 18,
    },
    os: "CentOS 8",
    controlPanel: "Plesk",
    activeAccounts: 78,
    maxAccounts: 150,
    lastUpdate: "2024-01-15T10:25:00Z",
  },
  {
    id: "server-03",
    name: "Enterprise Server 01",
    hostname: "ent01.hostpanel.com",
    ipAddress: "192.168.1.12",
    location: "EU Central (Frankfurt)",
    provider: "Hetzner",
    status: "maintenance",
    uptime: "99.7%",
    cpu: {
      cores: 16,
      usage: 0,
      model: "AMD EPYC 7543",
    },
    memory: {
      total: 64,
      used: 0,
      usage: 0,
    },
    storage: {
      total: 2000,
      used: 850,
      usage: 43,
      type: "NVMe SSD",
    },
    network: {
      bandwidth: "10 Gbps",
      usage: 0,
    },
    os: "Ubuntu 22.04 LTS",
    controlPanel: "DirectAdmin",
    activeAccounts: 0,
    maxAccounts: 200,
    lastUpdate: "2024-01-15T08:00:00Z",
  },
]

const serverProviders = [
  { value: "aws", label: "Amazon Web Services" },
  { value: "digitalocean", label: "DigitalOcean" },
  { value: "linode", label: "Linode" },
  { value: "vultr", label: "Vultr" },
  { value: "hetzner", label: "Hetzner" },
  { value: "ovh", label: "OVH" },
]

const operatingSystems = [
  { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
  { value: "centos-8", label: "CentOS 8" },
  { value: "debian-11", label: "Debian 11" },
  { value: "rocky-8", label: "Rocky Linux 8" },
]

const controlPanels = [
  { value: "cpanel", label: "cPanel/WHM" },
  { value: "plesk", label: "Plesk" },
  { value: "directadmin", label: "DirectAdmin" },
  { value: "cyberpanel", label: "CyberPanel" },
  { value: "none", label: "None" },
]

export default function ServerManagement() {
  const [servers, setServers] = useState(mockServers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    hostname: "",
    ipAddress: "",
    location: "",
    provider: "",
    os: "",
    controlPanel: "",
    maxAccounts: "",
    status: "online",
  })

  const handleCreateServer = () => {
    const newServer = {
      id: `server-${servers.length + 1}`.padStart(2, "0"),
      ...formData,
      maxAccounts: Number.parseInt(formData.maxAccounts),
      uptime: "100%",
      cpu: { cores: 4, usage: 0, model: "Intel Xeon" },
      memory: { total: 16, used: 0, usage: 0 },
      storage: { total: 500, used: 0, usage: 0, type: "SSD" },
      network: { bandwidth: "1 Gbps", usage: 0 },
      activeAccounts: 0,
      lastUpdate: new Date().toISOString(),
    }
    setServers([...servers, newServer])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditServer = (server: any) => {
    setEditingServer(server)
    setFormData({
      name: server.name,
      hostname: server.hostname,
      ipAddress: server.ipAddress,
      location: server.location,
      provider: server.provider,
      os: server.os,
      controlPanel: server.controlPanel,
      maxAccounts: server.maxAccounts.toString(),
      status: server.status,
    })
  }

  const handleUpdateServer = () => {
    const updatedServers = servers.map((server) =>
      server.id === editingServer.id
        ? {
            ...server,
            ...formData,
            maxAccounts: Number.parseInt(formData.maxAccounts),
            lastUpdate: new Date().toISOString(),
          }
        : server,
    )
    setServers(updatedServers)
    setEditingServer(null)
    resetForm()
  }

  const handleDeleteServer = (id: string) => {
    setServers(servers.filter((server) => server.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      hostname: "",
      ipAddress: "",
      location: "",
      provider: "",
      os: "",
      controlPanel: "",
      maxAccounts: "",
      status: "online",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "maintenance":
        return "secondary"
      case "offline":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Management</h1>
          <p className="text-muted-foreground">Monitor and manage your hosting infrastructure</p>
        </div>
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
            <ServerForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateServer}>Add Server</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card key={server.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(server.status)}
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(server.status)}>{server.status}</Badge>
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
                      <span className="font-mono text-xs">{server.hostname}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>IP Address</span>
                      <span className="font-mono text-xs">{server.ipAddress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Provider</span>
                      <span className="font-medium">{server.provider}</span>
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
                          {server.activeAccounts}/{server.maxAccounts}
                        </span>
                      </div>
                      <Progress value={(server.activeAccounts / server.maxAccounts) * 100} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Activity className="mr-1 h-3 w-3" />
                        Uptime
                      </span>
                      <span className="font-medium text-green-600">{server.uptime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditServer(server)} className="flex-1">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteServer(server.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            {servers
              .filter((server) => server.status === "online")
              .map((server) => (
                <Card key={server.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <Server className="h-5 w-5" />
                        <span>{server.name}</span>
                      </CardTitle>
                      <Badge variant="outline">{server.location}</Badge>
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
                          <span className="font-medium">{server.cpu.usage}%</span>
                        </div>
                        <Progress value={server.cpu.usage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {server.cpu.cores} cores - {server.cpu.model}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <MemoryStick className="mr-2 h-4 w-4" />
                            Memory
                          </span>
                          <span className="font-medium">{server.memory.usage}%</span>
                        </div>
                        <Progress value={server.memory.usage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {server.memory.used}GB / {server.memory.total}GB
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <HardDrive className="mr-2 h-4 w-4" />
                            Storage
                          </span>
                          <span className="font-medium">{server.storage.usage}%</span>
                        </div>
                        <Progress value={server.storage.usage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {server.storage.used}GB / {server.storage.total}GB {server.storage.type}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <Network className="mr-2 h-4 w-4" />
                            Network
                          </span>
                          <span className="font-medium">{server.network.usage}%</span>
                        </div>
                        <Progress value={server.network.usage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{server.network.bandwidth}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Server Dialog */}
      <Dialog open={!!editingServer} onOpenChange={() => setEditingServer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Server</DialogTitle>
            <DialogDescription>Update server configuration and settings</DialogDescription>
          </DialogHeader>
          <ServerForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingServer(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateServer}>Update Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ServerForm({ formData, setFormData }: any) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Server Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Web Server 01"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hostname">Hostname</Label>
          <Input
            id="hostname"
            value={formData.hostname}
            onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
            placeholder="web01.hostpanel.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ipAddress">IP Address</Label>
          <Input
            id="ipAddress"
            value={formData.ipAddress}
            onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
            placeholder="192.168.1.10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="US East (Virginia)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {serverProviders.map((provider) => (
                <SelectItem key={provider.value} value={provider.label}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="os">Operating System</Label>
          <Select value={formData.os} onValueChange={(value) => setFormData({ ...formData, os: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select OS" />
            </SelectTrigger>
            <SelectContent>
              {operatingSystems.map((os) => (
                <SelectItem key={os.value} value={os.label}>
                  {os.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="controlPanel">Control Panel</Label>
          <Select
            value={formData.controlPanel}
            onValueChange={(value) => setFormData({ ...formData, controlPanel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select control panel" />
            </SelectTrigger>
            <SelectContent>
              {controlPanels.map((panel) => (
                <SelectItem key={panel.value} value={panel.label}>
                  {panel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxAccounts">Max Accounts</Label>
          <Input
            id="maxAccounts"
            type="number"
            value={formData.maxAccounts}
            onChange={(e) => setFormData({ ...formData, maxAccounts: e.target.value })}
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
