"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Server,
  Play,
  Square,
  RotateCcw,
  Trash2,
  Plus,
  Search,
  Filter,
  Monitor,
  Cpu,
  HardDrive,
  Activity,
  Settings,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const vmData = [
  {
    id: "vm-001",
    name: "Web Server 01",
    status: "running",
    os: "Ubuntu 22.04 LTS",
    cpu: "4 vCPUs",
    memory: "8 GB",
    storage: "100 GB SSD",
    ip: "192.168.1.10",
    uptime: "15 days",
    usage: { cpu: 45, memory: 62, disk: 38 },
  },
  {
    id: "vm-002",
    name: "Database Server",
    status: "running",
    os: "CentOS 8",
    cpu: "8 vCPUs",
    memory: "16 GB",
    storage: "500 GB SSD",
    ip: "192.168.1.11",
    uptime: "32 days",
    usage: { cpu: 78, memory: 84, disk: 65 },
  },
  {
    id: "vm-003",
    name: "Dev Environment",
    status: "stopped",
    os: "Windows Server 2022",
    cpu: "2 vCPUs",
    memory: "4 GB",
    storage: "80 GB SSD",
    ip: "192.168.1.12",
    uptime: "0 days",
    usage: { cpu: 0, memory: 0, disk: 25 },
  },
  {
    id: "vm-004",
    name: "Load Balancer",
    status: "running",
    os: "Ubuntu 20.04 LTS",
    cpu: "2 vCPUs",
    memory: "4 GB",
    storage: "40 GB SSD",
    ip: "192.168.1.13",
    uptime: "8 days",
    usage: { cpu: 23, memory: 35, disk: 18 },
  },
  {
    id: "vm-005",
    name: "Backup Server",
    status: "maintenance",
    os: "Debian 11",
    cpu: "4 vCPUs",
    memory: "8 GB",
    storage: "1 TB HDD",
    ip: "192.168.1.14",
    uptime: "0 days",
    usage: { cpu: 0, memory: 0, disk: 92 },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-green-100 text-green-800 border-green-200"
    case "stopped":
      return "bg-red-100 text-red-800 border-red-200"
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getUsageColor = (usage: number) => {
  if (usage >= 80) return "bg-red-500"
  if (usage >= 60) return "bg-yellow-500"
  return "bg-green-500"
}

export function VMSManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVMs, setSelectedVMs] = useState<string[]>([])

  const filteredVMs = vmData.filter(
    (vm) =>
      vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.ip.includes(searchTerm),
  )

  const runningVMs = vmData.filter((vm) => vm.status === "running").length
  const totalVMs = vmData.length
  const totalCPUs = vmData.reduce((sum, vm) => sum + Number.parseInt(vm.cpu), 0)
  const totalMemory = vmData.reduce((sum, vm) => sum + Number.parseInt(vm.memory), 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Virtual Machines</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and monitor your virtual machine infrastructure
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create VM
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total VMs</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{totalVMs}</p>
              </div>
              <Server className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600">Running</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{runningVMs}</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Total vCPUs</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">{totalCPUs}</p>
              </div>
              <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-orange-600">Total Memory</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-900">{totalMemory} GB</p>
              </div>
              <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search VMs by name, OS, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* VM List */}
      <div className="grid gap-4 sm:gap-6">
        {filteredVMs.map((vm) => (
          <Card key={vm.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* VM Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">{vm.name}</h3>
                    <Badge className={`${getStatusColor(vm.status)} text-xs font-medium w-fit`}>{vm.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">OS:</span>
                      <span className="ml-2 font-medium text-gray-900">{vm.os}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">IP:</span>
                      <span className="ml-2 font-medium text-gray-900">{vm.ip}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Uptime:</span>
                      <span className="ml-2 font-medium text-gray-900">{vm.uptime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ID:</span>
                      <span className="ml-2 font-medium text-gray-900">{vm.id}</span>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Cpu className="h-3 w-3 mr-1" />
                          CPU ({vm.cpu})
                        </span>
                        <span className="font-medium">{vm.usage.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(vm.usage.cpu)}`}
                          style={{ width: `${vm.usage.cpu}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Monitor className="h-3 w-3 mr-1" />
                          Memory ({vm.memory})
                        </span>
                        <span className="font-medium">{vm.usage.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(vm.usage.memory)}`}
                          style={{ width: `${vm.usage.memory}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <HardDrive className="h-3 w-3 mr-1" />
                          Disk ({vm.storage})
                        </span>
                        <span className="font-medium">{vm.usage.disk}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(vm.usage.disk)}`}
                          style={{ width: `${vm.usage.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
                  {vm.status === "running" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 lg:flex-none border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restart
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 lg:flex-none border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-3 w-3 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Monitor className="h-3 w-3 mr-2" />
                        Console
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
