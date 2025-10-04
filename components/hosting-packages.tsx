"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Server, HardDrive, Cpu, RefreshCw, Loader2 } from "lucide-react"
import { ServerSelect } from "@/components/reuseable-inputs/server-select"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminCurrency } from "@/hooks/useAdminCurrency"
import { convertPrice } from "@/lib/currencyUtils"

interface Package {
  id: string
  name: string
  description: string
  diskSpace: number
  bandwidth: bigint | number
  domains: number
  emailAccounts: number
  databases: number
  features: string
  billingCycle: string
  price: number
  status: string
  serverId: string
  server: {
    id: string
    serverName: string
    location: string
  }
}

interface GroupedPackage {
  name: string
  description: string
  diskSpace: number
  bandwidth: bigint | number
  domains: number
  emailAccounts: number
  databases: number
  features: string
  status: string
  serverId: string
  serverName: string
  serverLocation: string
  monthly?: { id: string; price: number }
  quarterly?: { id: string; price: number }
  yearly?: { id: string; price: number }
}

interface WHMPackage {
  name: string
  QUOTA: string
  BWLIMIT: string
  MAXSUB: string
  MAXPOP: string
  MAXSQL: string
  MAXADDON: string
  MAXPARK: string
}

export default function HostingPackagesPage() {

  const [packages, setPackages] = useState<Package[]>([])
  const [groupedPackages, setGroupedPackages] = useState<GroupedPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<GroupedPackage | null>(null)

  const [whmPackages, setWhmPackages] = useState<WHMPackage[]>([])
  const [fetchingWHMPackages, setFetchingWHMPackages] = useState(false)
  const [selectedWHMPackage, setSelectedWHMPackage] = useState<string>("")
  const currency = useAdminCurrency()

  const [formData, setFormData] = useState({
    name: "",
    providerPackageName: "",
    description: "",
    diskSpace: "",
    bandwidth: "",
    domains: "",
    emailAccounts: "",
    databases: "",
    monthlyPrice: "",
    quarterlyPrice: "",
    yearlyPrice: "",
    serverId: "",
    status: "active",
    features: "",
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  useEffect(() => {
    const grouped = packages.reduce(
      (acc, pkg) => {
        const key = `${pkg.serverId}-${pkg.name}`

        if (!acc[key]) {
          acc[key] = {
            name: pkg.name,
            description: pkg.description,
            diskSpace: pkg.diskSpace,
            bandwidth: pkg.bandwidth,
            domains: pkg.domains,
            emailAccounts: pkg.emailAccounts,
            databases: pkg.databases,
            features: pkg.features,
            status: pkg.status,
            serverId: pkg.serverId,
            serverName: pkg.server.serverName,
            serverLocation: pkg.server.location,
          }
        }

        if (pkg.billingCycle === "MONTHLY") {
          acc[key].monthly = { id: pkg.id, price: pkg.price }
        } else if (pkg.billingCycle === "QUARTERLY") {
          acc[key].quarterly = { id: pkg.id, price: pkg.price }
        } else if (pkg.billingCycle === "YEARLY") {
          acc[key].yearly = { id: pkg.id, price: pkg.price }
        }

        return acc
      },
      {} as Record<string, GroupedPackage>,
    )

    setGroupedPackages(Object.values(grouped))
  }, [packages])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/packages")
      const data = await response.json()

      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast.error("Failed to fetch packages")
    } finally {
      setLoading(false)
    }
  }

  const fetchWHMPackages = async () => {
    if (!formData.serverId) {
      toast.error("Please select a server first")
      return
    }

    try {
      setFetchingWHMPackages(true)
      const response = await fetch(`/api/packages/fetch-provider-packages/${formData.serverId}`)
      const data = await response.json()

      if (data.success) {
        setWhmPackages(data.packages)
        toast.success(`Fetched ${data.packages.length} packages from server`)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Error fetching WHM packages:", error)
      toast.error(error.message || "Failed to fetch packages from server")
    } finally {
      setFetchingWHMPackages(false)
    }
  }

  const handleWHMPackageSelect = (packageName: string) => {
    setSelectedWHMPackage(packageName)
    const pkg = whmPackages.find((p) => p.name === packageName)

    if (pkg) {
      setFormData({
        ...formData,
        providerPackageName: pkg.name, // Save provider package name in background
        diskSpace: pkg.QUOTA === "unlimited" ? "999999" : pkg.QUOTA,
        bandwidth: pkg.BWLIMIT === "unlimited" ? "unlimited" : pkg.BWLIMIT,
        domains: pkg.MAXADDON || "0",
        emailAccounts: pkg.MAXPOP || "0",
        databases: pkg.MAXSQL || "0",
      })
      toast.success(`Loaded package details for ${pkg.name}`)
    }
  }

  const handleCreatePackage = async () => {
    if (!formData.monthlyPrice && !formData.quarterlyPrice && !formData.yearlyPrice) {
      toast.error("Please provide at least one price")
      return
    }

    if (!formData.name || !formData.serverId) {
      toast.error("Package name and server are required")
      return
    }

    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || "Package created successfully")
        setIsCreateDialogOpen(false)
        resetForm()
        fetchPackages()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create package")
    }
  }

  const handleEditPackage = (pkg: GroupedPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      providerPackageName: pkg.name,
      description: pkg.description,
      diskSpace: pkg.diskSpace.toString(),
      bandwidth: pkg.bandwidth.toString(),
      domains: pkg.domains.toString(),
      emailAccounts: pkg.emailAccounts.toString(),
      databases: pkg.databases.toString(),
      monthlyPrice: pkg.monthly?.price.toString() || "",
      quarterlyPrice: pkg.quarterly?.price.toString() || "",
      yearlyPrice: pkg.yearly?.price.toString() || "",
      serverId: pkg.serverId,
      status: pkg.status.toLowerCase(),
      features: pkg.features,
    })
  }

  const handleUpdatePackage = async () => {
    if (!editingPackage) return

    const packageId = editingPackage.monthly?.id || editingPackage.quarterly?.id || editingPackage.yearly?.id

    if (!packageId) {
      toast.error("No package ID found")
      return
    }

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Package updated successfully")
        setEditingPackage(null)
        resetForm()
        fetchPackages()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update package")
    }
  }

  const handleDeletePackage = async (pkg: GroupedPackage) => {
    if (!confirm(`Are you sure you want to delete "${pkg.name}" and all its billing cycles?`)) return

    const packageId = pkg.monthly?.id || pkg.quarterly?.id || pkg.yearly?.id

    if (!packageId) {
      toast.error("No package ID found")
      return
    }

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || "Package deleted successfully")
        fetchPackages()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete package")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      providerPackageName: "",
      description: "",
      diskSpace: "",
      bandwidth: "",
      domains: "",
      emailAccounts: "",
      databases: "",
      monthlyPrice: "",
      quarterlyPrice: "",
      yearlyPrice: "",
      serverId: "",
      status: "active",
      features: "",
    })
    setWhmPackages([])
    setSelectedWHMPackage("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hosting Packages</h1>
          <p className="text-muted-foreground">Manage your web hosting service packages</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Hosting Package</DialogTitle>
              <DialogDescription>Enter package details and pricing for all billing cycles</DialogDescription>
            </DialogHeader>
            <PackageForm
              formData={formData}
              setFormData={setFormData}
              whmPackages={whmPackages}
              fetchingWHMPackages={fetchingWHMPackages}
              selectedWHMPackage={selectedWHMPackage}
              onFetchWHMPackages={fetchWHMPackages}
              onSelectWHMPackage={handleWHMPackageSelect}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePackage}>Create Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupedPackages.map((pkg, index) => (
          <Card key={`${pkg.serverId}-${pkg.name}-${index}`} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="mt-1">{pkg.description}</CardDescription>
                </div>
                <Badge variant={pkg.status === "ACTIVE" ? "default" : "secondary"}>{pkg.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Monthly</div>
                  <div className="text-lg font-bold text-primary">
                   {currency === "INR" ? "₹" : "$"}{Math.ceil(convertPrice(pkg.monthly?.price || 0, currency))}
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Quarterly</div>
                  <div className="text-lg font-bold text-primary">
                    {currency === "INR" ? "₹" : "$"}{Math.ceil(convertPrice(pkg.quarterly?.price || 0, currency))}
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Yearly</div>
                  <div className="text-lg font-bold text-primary">
                   {currency === "INR" ? "₹" : "$"}{Math.ceil(convertPrice(pkg.yearly?.price || 0, currency))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-muted-foreground">
                    <HardDrive className="mr-2 h-4 w-4" />
                    Disk Space
                  </span>
                  <span className="font-medium">{pkg.diskSpace} GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-muted-foreground">
                    <Cpu className="mr-2 h-4 w-4" />
                    Bandwidth
                  </span>
                  <span className="font-medium">
                    {pkg.bandwidth === -1 ? "Unlimited" : `${pkg.bandwidth} GB`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Domains</span>
                  <span className="font-medium">{pkg.domains}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email Accounts</span>
                  <span className="font-medium">{pkg.emailAccounts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Databases</span>
                  <span className="font-medium">{pkg.databases}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Server className="mr-2 h-4 w-4" />
                    Server
                  </span>
                  <span className="font-medium">{pkg.serverName}</span>
                </div>
              </div>

              {pkg.features && (
                <div className="flex flex-wrap gap-1">
                  {pkg.features.split(",").map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg)} className="flex-1">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePackage(pkg)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groupedPackages.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">No packages found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Package
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Package Dialog */}
      <Dialog
        open={!!editingPackage}
        onOpenChange={() => {
          setEditingPackage(null)
          resetForm()
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hosting Package</DialogTitle>
            <DialogDescription>Update package details and pricing for all billing cycles</DialogDescription>
          </DialogHeader>
          <PackageForm
            formData={formData}
            setFormData={setFormData}
            whmPackages={whmPackages}
            fetchingWHMPackages={fetchingWHMPackages}
            selectedWHMPackage={selectedWHMPackage}
            onFetchWHMPackages={fetchWHMPackages}
            onSelectWHMPackage={handleWHMPackageSelect}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingPackage(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePackage}>Update Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PackageForm({
  formData,
  setFormData,
  whmPackages,
  fetchingWHMPackages,
  selectedWHMPackage,
  onFetchWHMPackages,
  onSelectWHMPackage,
}: any) {
  return (
    <div className="grid gap-6 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Package Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Basic, Pro, Enterprise"
            required
          />
          {formData.providerPackageName && (
            <p className="text-xs text-muted-foreground">
              Linked to provider package: <span className="font-medium">{formData.providerPackageName}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serverId">Server *</Label>
          <ServerSelect
            value={formData.serverId}
            onValueChange={(value) => setFormData({ ...formData, serverId: value })}
            filterOnline={true}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Load Server Packages</Label>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={onFetchWHMPackages}
          disabled={!formData.serverId || fetchingWHMPackages}
        >
          {fetchingWHMPackages ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Loader2 className="mr-2 h-4 w-4" />
              Fetch Packages
            </>
          )}
        </Button>
      </div>

      {whmPackages.length > 0 && (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
          <Label htmlFor="whmPackage">Select Server Package (Optional)</Label>
          <Select value={selectedWHMPackage} onValueChange={onSelectWHMPackage}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a package to auto-fill details" />
            </SelectTrigger>
            <SelectContent>
              {whmPackages.map((pkg: any) => (
                <SelectItem key={pkg.name} value={pkg.name}>
                  {pkg.name} - {pkg.QUOTA === "unlimited" ? "Unlimited" : `${pkg.QUOTA}MB`} Disk,{" "}
                  {pkg.BWLIMIT === "unlimited" ? "Unlimited" : `${pkg.BWLIMIT}MB`} Bandwidth
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Selecting a package will auto-fill resource details and link to the provider package
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the hosting package"
          rows={2}
        />
      </div>

      <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold text-sm">Pricing (enter at least one)</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
            <Input
              id="monthlyPrice"
              type="number"
              step="0.01"
              value={formData.monthlyPrice}
              onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
              placeholder="9.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quarterlyPrice">Quarterly Price ($)</Label>
            <Input
              id="quarterlyPrice"
              type="number"
              step="0.01"
              value={formData.quarterlyPrice}
              onChange={(e) => setFormData({ ...formData, quarterlyPrice: e.target.value })}
              placeholder="27.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
            <Input
              id="yearlyPrice"
              type="number"
              step="0.01"
              value={formData.yearlyPrice}
              onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
              placeholder="99.99"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diskSpace">Disk Space (GB)</Label>
          <Input
            id="diskSpace"
            type="number"
            value={formData.diskSpace}
            onChange={(e) => setFormData({ ...formData, diskSpace: e.target.value })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bandwidth">Bandwidth (GB or "unlimited")</Label>
          <Input
            id="bandwidth"
            value={formData.bandwidth}
            onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
            placeholder="100 or unlimited"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="domains">Domains</Label>
          <Input
            id="domains"
            type="number"
            value={formData.domains}
            onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailAccounts">Email Accounts</Label>
          <Input
            id="emailAccounts"
            type="number"
            value={formData.emailAccounts}
            onChange={(e) => setFormData({ ...formData, emailAccounts: e.target.value })}
            placeholder="5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="databases">Databases</Label>
          <Input
            id="databases"
            type="number"
            value={formData.databases}
            onChange={(e) => setFormData({ ...formData, databases: e.target.value })}
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Free SSL, Daily Backups, 24/7 Support"
          rows={2}
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
