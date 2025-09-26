"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Server, HardDrive, Cpu, Loader2 } from "lucide-react"
import { toast } from "sonner"

// WHM API Configuration
const WHM_CONFIG = {
  token: "Z0J86GTF2FCECSW2TNCU7OKMIGYYH4UV",
  url: "https://server420.liteserverdns.in:2087"
}

// Types for WHM API responses
interface WHMPackage {
  name: string;
  featurelist: string;
  maxsql: string;
  maxpop: string;
  maxsub: string;
  maxpark: string;
  maxaddon: string;
  disklimit: string;
  bwlimit: string;
  max_email_per_hour?: string;
  max_defer_fail_percentage?: string;
  MAX_EMAIL_PER_HOUR?: string;
  MAX_DEFER_FAIL_PERCENTAGE?: string;
}

interface WHMAccount {
  domain: string;
  user: string;
  ip: string;
  diskused: string;
  disklimit: string;
  startdate: string;
  suspendreason: string;
  suspended: number;
  plan: string;
}

interface Server {
  id: string;
  name: string;
  location: string;
  status: string;
}

export default function HostingPackages() {
  const [packages, setPackages] = useState<any[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [accounts, setAccounts] = useState<WHMAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    diskSpace: "",
    bandwidth: "",
    domains: "",
    emails: "",
    databases: "",
    price: "",
    serverId: "",
    billingCycle: "monthly",
    status: "active",
    features: "",
  })

  // Fetch data from WHM API
  const fetchWHMData = async () => {
    setIsLoading(true)
    try {
      const headers = {
        'Authorization': `whm root:${WHM_CONFIG.token}`,
        'Content-Type': 'application/json'
      }

      // Fetch packages
      const packagesResponse = await fetch(`${WHM_CONFIG.url}/json-api/listpkgs`, { headers })
      const packagesData = await packagesResponse.json()
    console.log(packagesData,"package")
      // Fetch accounts to get usage statistics
      const accountsResponse = await fetch(`${WHM_CONFIG.url}/json-api/listaccts`, { headers })
      const accountsData = await accountsResponse.json()

      if (packagesData.data && packagesData.data.pkg) {
        const formattedPackages = packagesData.data.pkg.map((pkg: WHMPackage, index: number) => {
          // Count how many accounts use this package
          const accountCount = accountsData.data?.acct?.filter((acc: WHMAccount) => acc.plan === pkg.name).length || 0

          return {
            id: index + 1,
            name: pkg.name,
            description: `WHM Package - ${pkg.featurelist}`,
            diskSpace: pkg.disklimit === "unlimited" ? "Unlimited" : `${pkg.disklimit} MB`,
            bandwidth: pkg.bwlimit === "unlimited" ? "Unlimited" : `${pkg.bwlimit} MB`,
            domains: pkg.maxaddon === "unlimited" ? "Unlimited" : pkg.maxaddon,
            emails: pkg.maxpop === "unlimited" ? "Unlimited" : pkg.maxpop,
            databases: pkg.maxsql === "unlimited" ? "Unlimited" : pkg.maxsql,
            price: 0, // WHM doesn't store pricing
            serverId: "server-01",
            serverName: "WHM Server",
            billingCycle: "monthly",
            status: "active",
            features: [pkg.featurelist],
            accountCount: accountCount,
            maxEmailPerHour: pkg.max_email_per_hour || pkg.MAX_EMAIL_PER_HOUR || "Unlimited",
            maxDeferFailPercentage: pkg.max_defer_fail_percentage || pkg.MAX_DEFER_FAIL_PERCENTAGE || "Unlimited"
          }
        })
        setPackages(formattedPackages)
      }

      // Set mock servers (you can extend this to fetch real server info)
      setServers([
        { id: "server-01", name: "WHM Server", location: "Primary", status: "online" }
      ])

      if (accountsData.data && accountsData.data.acct) {
        setAccounts(accountsData.data.acct)
      }

    } catch (error) {
      console.error('Error fetching WHM data:', error)
      toast.error("Failed to fetch data from WHM")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWHMData()
  }, [])

  const handleCreatePackage = async () => {
    try {
      const headers = {
        'Authorization': `whm root:${WHM_CONFIG.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const formDataObj = new URLSearchParams()
      formDataObj.append('name', formData.name)
      formDataObj.append('featurelist', 'default')
      formDataObj.append('quota', formData.diskSpace.replace(' MB', '').replace(' GB', '000'))
      formDataObj.append('bwlimit', formData.bandwidth.replace(' MB', '').replace(' GB', '000'))
      formDataObj.append('maxpop', formData.emails === "unlimited" ? "unlimited" : formData.emails)
      formDataObj.append('maxsql', formData.databases === "unlimited" ? "unlimited" : formData.databases)
      formDataObj.append('maxsub', formData.domains === "unlimited" ? "unlimited" : formData.domains)
      formDataObj.append('maxaddon', formData.domains === "unlimited" ? "unlimited" : formData.domains)

      const response = await fetch(`${WHM_CONFIG.url}/json-api/addpkg`, {
        method: 'POST',
        headers,
        body: formDataObj
      })

      const result = await response.json()

      if (result.metadata.result === 1) {
        toast.success("Package created successfully")
        fetchWHMData() // Refresh data
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        toast.error(`Failed to create package: ${result.metadata.reason}`)
      }
    } catch (error) {
      console.error('Error creating package:', error)
      toast.error("Failed to create package")
    }
  }

  const handleEditPackage = (pkg: any) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description,
      diskSpace: pkg.diskSpace.replace(' MB', '').replace(' GB', ''),
      bandwidth: pkg.bandwidth.replace(' MB', '').replace(' GB', ''),
      domains: pkg.domains.toString(),
      emails: pkg.emails.toString(),
      databases: pkg.databases.toString(),
      price: pkg.price.toString(),
      serverId: pkg.serverId,
      billingCycle: pkg.billingCycle,
      status: pkg.status,
      features: pkg.features.join(", "),
    })
  }

  const handleUpdatePackage = async () => {
    try {
      const headers = {
        'Authorization': `whm root:${WHM_CONFIG.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const formDataObj = new URLSearchParams()
      formDataObj.append('name', editingPackage.name)
      formDataObj.append('newName', formData.name)
      formDataObj.append('quota', formData.diskSpace)
      formDataObj.append('bwlimit', formData.bandwidth)
      formDataObj.append('maxpop', formData.emails === "unlimited" ? "unlimited" : formData.emails)
      formDataObj.append('maxsql', formData.databases === "unlimited" ? "unlimited" : formData.databases)
      formDataObj.append('maxsub', formData.domains === "unlimited" ? "unlimited" : formData.domains)
      formDataObj.append('maxaddon', formData.domains === "unlimited" ? "unlimited" : formData.domains)

      const response = await fetch(`${WHM_CONFIG.url}/json-api/editpkg`, {
        method: 'POST',
        headers,
        body: formDataObj
      })

      const result = await response.json()

      if (result.metadata.result === 1) {
        toast.success("Package updated successfully")
        fetchWHMData() // Refresh data
        setEditingPackage(null)
        resetForm()
      } else {
        toast.error(`Failed to update package: ${result.metadata.reason}`)
      }
    } catch (error) {
      console.error('Error updating package:', error)
      toast.error("Failed to update package")
    }
  }

  const handleDeletePackage = async (pkgName: string) => {
    if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return
    }

    try {
      const headers = {
        'Authorization': `whm root:${WHM_CONFIG.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const formDataObj = new URLSearchParams()
      formDataObj.append('name', pkgName)

      const response = await fetch(`${WHM_CONFIG.url}/json-api/killpkg`, {
        method: 'POST',
        headers,
        body: formDataObj
      })

      const result = await response.json()

      if (result.metadata.result === 1) {
        toast.success("Package deleted successfully")
        fetchWHMData() // Refresh data
      } else {
        toast.error(`Failed to delete package: ${result.metadata.reason}`)
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error("Failed to delete package")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      diskSpace: "",
      bandwidth: "",
      domains: "",
      emails: "",
      databases: "",
      price: "",
      serverId: "",
      billingCycle: "monthly",
      status: "active",
      features: "",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading packages from WHM...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WHM Hosting Packages</h1>
          <p className="text-muted-foreground">Manage your WHM/cPanel hosting packages</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New WHM Package</DialogTitle>
              <DialogDescription>
                Create a new hosting package in WHM/cPanel
              </DialogDescription>
            </DialogHeader>
            <PackageForm formData={formData} setFormData={setFormData} servers={servers} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePackage}>Create Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.name} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </div>
                <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
                  {pkg.accountCount} accounts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <HardDrive className="mr-2 h-3 w-3" />
                    Disk Space
                  </span>
                  <span className="font-medium">{pkg.diskSpace}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Cpu className="mr-2 h-3 w-3" />
                    Bandwidth
                  </span>
                  <span className="font-medium">{pkg.bandwidth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Domains</span>
                  <span className="font-medium">{pkg.domains}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Accounts</span>
                  <span className="font-medium">{pkg.emails}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Databases</span>
                  <span className="font-medium">{pkg.databases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email/hr Limit</span>
                  <span className="font-medium">{pkg.maxEmailPerHour}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Server className="mr-2 h-3 w-3" />
                    Server
                  </span>
                  <span className="font-medium">{pkg.serverName}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {pkg.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg)} className="flex-1">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePackage(pkg.name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Package Dialog */}
      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit WHM Package</DialogTitle>
            <DialogDescription>Update package configuration in WHM</DialogDescription>
          </DialogHeader>
          <PackageForm formData={formData} setFormData={setFormData} servers={servers} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPackage(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePackage}>Update Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PackageForm({ formData, setFormData, servers }: any) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Package Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., starter_package"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) - Optional</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="9.99"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the hosting package"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diskSpace">Disk Space (MB)</Label>
          <Input
            id="diskSpace"
            type="number"
            value={formData.diskSpace}
            onChange={(e) => setFormData({ ...formData, diskSpace: e.target.value })}
            placeholder="e.g., 10240 (for 10GB)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bandwidth">Bandwidth (MB)</Label>
          <Input
            id="bandwidth"
            type="number"
            value={formData.bandwidth}
            onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
            placeholder="e.g., 102400 (for 100GB)"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="domains">Domains</Label>
          <Input
            id="domains"
            value={formData.domains}
            onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
            placeholder="0 for unlimited"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emails">Email Accounts</Label>
          <Input
            id="emails"
            value={formData.emails}
            onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
            placeholder="0 for unlimited"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="databases">Databases</Label>
          <Input
            id="databases"
            value={formData.databases}
            onChange={(e) => setFormData({ ...formData, databases: e.target.value })}
            placeholder="0 for unlimited"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Feature List</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Package features (comma separated)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status === "active"}
          onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
        />
        <Label htmlFor="status">Active Package</Label>
      </div>
    </div>
  )
}