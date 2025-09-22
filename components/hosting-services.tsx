"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  MoreHorizontal,
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  Pause,
  RotateCcw,
  Settings,
  ExternalLink,
} from "lucide-react"

// Mock hosting data
const hostingAccounts = [
  {
    id: 1,
    domain: "example.com",
    owner: "John Doe",
    plan: "Premium",
    server: "Server-01",
    status: "active",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    bandwidth: "125.5 GB",
    uptime: "99.9%",
    lastBackup: "2024-03-21 02:00",
  },
  {
    id: 2,
    domain: "mystore.net",
    owner: "Sarah Wilson",
    plan: "Business",
    server: "Server-02",
    status: "active",
    cpuUsage: 23,
    memoryUsage: 34,
    diskUsage: 45,
    bandwidth: "89.2 GB",
    uptime: "99.8%",
    lastBackup: "2024-03-21 02:15",
  },
  {
    id: 3,
    domain: "techblog.org",
    owner: "Mike Johnson",
    plan: "Starter",
    server: "Server-01",
    status: "suspended",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 23,
    bandwidth: "12.1 GB",
    uptime: "0%",
    lastBackup: "2024-03-15 02:00",
  },
  {
    id: 4,
    domain: "startup.io",
    owner: "Emily Chen",
    plan: "Enterprise",
    server: "Server-03",
    status: "active",
    cpuUsage: 67,
    memoryUsage: 89,
    diskUsage: 34,
    bandwidth: "456.8 GB",
    uptime: "100%",
    lastBackup: "2024-03-21 02:30",
  },
]

const servers = [
  {
    id: 1,
    name: "Server-01",
    location: "New York, US",
    status: "online",
    accounts: 156,
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 34,
    uptime: "99.9%",
    load: "2.34",
  },
  {
    id: 2,
    name: "Server-02",
    location: "London, UK",
    status: "online",
    accounts: 89,
    cpuUsage: 23,
    memoryUsage: 45,
    diskUsage: 56,
    uptime: "99.8%",
    load: "1.67",
  },
  {
    id: 3,
    name: "Server-03",
    location: "Singapore, SG",
    status: "maintenance",
    accounts: 234,
    cpuUsage: 12,
    memoryUsage: 23,
    diskUsage: 78,
    uptime: "98.5%",
    load: "0.89",
  },
]

export function HostingServices() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getServerStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlanBadge = (plan: string) => {
    const colors = {
      Starter: "bg-blue-500",
      Premium: "bg-purple-500",
      Business: "bg-orange-500",
      Enterprise: "bg-green-600",
    }
    return <Badge className={colors[plan as keyof typeof colors] || "bg-gray-500"}>{plan}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Hosting Services</h2>
          <p className="text-muted-foreground">Monitor servers, hosting accounts, and cPanel access</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Hosting Account
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">479</div>
            <p className="text-xs text-muted-foreground">+12 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 online, 1 maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 TB</div>
            <p className="text-xs text-muted-foreground">68% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.7%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Hosting Management Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Hosting Accounts</TabsTrigger>
          <TabsTrigger value="servers">Server Status</TabsTrigger>
          <TabsTrigger value="cpanel">cPanel Access</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hosting Accounts</CardTitle>
              <CardDescription>Monitor all hosting accounts and their resource usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search hosting accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Server</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Resource Usage</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostingAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="font-medium">{account.domain}</div>
                        </TableCell>
                        <TableCell>{account.owner}</TableCell>
                        <TableCell>{getPlanBadge(account.plan)}</TableCell>
                        <TableCell>{account.server}</TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Cpu className="h-3 w-3" />
                              <Progress value={account.cpuUsage} className="w-16 h-2" />
                              <span className="text-xs">{account.cpuUsage}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MemoryStick className="h-3 w-3" />
                              <Progress value={account.memoryUsage} className="w-16 h-2" />
                              <span className="text-xs">{account.memoryUsage}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <HardDrive className="h-3 w-3" />
                              <Progress value={account.diskUsage} className="w-16 h-2" />
                              <span className="text-xs">{account.diskUsage}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{account.uptime}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open cPanel
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restart Services
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Suspend Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Card key={server.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{server.name}</CardTitle>
                    {getServerStatusIcon(server.status)}
                  </div>
                  <CardDescription>{server.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    {getStatusBadge(server.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accounts</span>
                    <span className="font-medium">{server.accounts}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center">
                        <Cpu className="h-4 w-4 mr-1" />
                        CPU Usage
                      </span>
                      <span className="text-sm">{server.cpuUsage}%</span>
                    </div>
                    <Progress value={server.cpuUsage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center">
                        <MemoryStick className="h-4 w-4 mr-1" />
                        Memory
                      </span>
                      <span className="text-sm">{server.memoryUsage}%</span>
                    </div>
                    <Progress value={server.memoryUsage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center">
                        <HardDrive className="h-4 w-4 mr-1" />
                        Disk Usage
                      </span>
                      <span className="text-sm">{server.diskUsage}%</span>
                    </div>
                    <Progress value={server.diskUsage} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm">Uptime</span>
                    <span className="font-medium text-green-600">{server.uptime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Load Average</span>
                    <span className="font-medium">{server.load}</span>
                  </div>

                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Server
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cpanel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>cPanel Access Management</CardTitle>
              <CardDescription>Manage cPanel access for hosting accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">cPanel Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Direct access to cPanel for each hosting account with single sign-on
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open cPanel
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
