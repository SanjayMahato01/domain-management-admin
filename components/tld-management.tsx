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
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Globe, DollarSign, Calendar, Building } from "lucide-react"

// Mock data for TLDs
const mockTLDs = [
  {
    id: 1,
    extension: ".com",
    registrarId: "namecheap",
    registrarName: "Namecheap",
    registrationPrice: 12.99,
    renewalPrice: 14.99,
    transferPrice: 12.99,
    redemptionPrice: 89.99,
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minYears: 1,
    maxYears: 10,
    autoRenew: true,
    whoisPrivacy: true,
    dnssec: true,
  },
  {
    id: 2,
    extension: ".net",
    registrarId: "godaddy",
    registrarName: "GoDaddy",
    registrationPrice: 15.99,
    renewalPrice: 17.99,
    transferPrice: 15.99,
    redemptionPrice: 99.99,
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minYears: 1,
    maxYears: 10,
    autoRenew: true,
    whoisPrivacy: true,
    dnssec: true,
  },
  {
    id: 3,
    extension: ".org",
    registrarId: "namecheap",
    registrarName: "Namecheap",
    registrationPrice: 14.99,
    renewalPrice: 16.99,
    transferPrice: 14.99,
    redemptionPrice: 89.99,
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minYears: 1,
    maxYears: 10,
    autoRenew: false,
    whoisPrivacy: true,
    dnssec: false,
  },
  {
    id: 4,
    extension: ".io",
    registrarId: "cloudflare",
    registrarName: "Cloudflare",
    registrationPrice: 39.99,
    renewalPrice: 39.99,
    transferPrice: 39.99,
    redemptionPrice: 149.99,
    billingCycle: "annually",
    status: "active",
    category: "country-code",
    minYears: 1,
    maxYears: 5,
    autoRenew: true,
    whoisPrivacy: false,
    dnssec: true,
  },
  {
    id: 5,
    extension: ".dev",
    registrarId: "google",
    registrarName: "Google Domains",
    registrationPrice: 12.0,
    renewalPrice: 12.0,
    transferPrice: 12.0,
    redemptionPrice: 80.0,
    billingCycle: "annually",
    status: "inactive",
    category: "new-gtld",
    minYears: 1,
    maxYears: 10,
    autoRenew: true,
    whoisPrivacy: true,
    dnssec: true,
  },
]

// Mock registrars data
const mockRegistrars = [
  { id: "namecheap", name: "Namecheap", status: "active", apiStatus: "connected" },
  { id: "godaddy", name: "GoDaddy", status: "active", apiStatus: "connected" },
  { id: "cloudflare", name: "Cloudflare", status: "active", apiStatus: "connected" },
  { id: "google", name: "Google Domains", status: "active", apiStatus: "connected" },
  { id: "enom", name: "eNom", status: "active", apiStatus: "disconnected" },
]

const tldCategories = [
  { value: "generic", label: "Generic TLD" },
  { value: "country-code", label: "Country Code TLD" },
  { value: "new-gtld", label: "New gTLD" },
  { value: "sponsored", label: "Sponsored TLD" },
]

export default function TLDManagement() {
  const [tlds, setTlds] = useState(mockTLDs)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTLD, setEditingTLD] = useState<any>(null)
  const [formData, setFormData] = useState({
    extension: "",
    registrarId: "",
    registrationPrice: "",
    renewalPrice: "",
    transferPrice: "",
    redemptionPrice: "",
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minYears: "1",
    maxYears: "10",
    autoRenew: true,
    whoisPrivacy: true,
    dnssec: true,
  })

  const handleCreateTLD = () => {
    const newTLD = {
      id: tlds.length + 1,
      ...formData,
      registrationPrice: Number.parseFloat(formData.registrationPrice),
      renewalPrice: Number.parseFloat(formData.renewalPrice),
      transferPrice: Number.parseFloat(formData.transferPrice),
      redemptionPrice: Number.parseFloat(formData.redemptionPrice),
      minYears: Number.parseInt(formData.minYears),
      maxYears: Number.parseInt(formData.maxYears),
      registrarName: mockRegistrars.find((r) => r.id === formData.registrarId)?.name || "",
    }
    setTlds([...tlds, newTLD])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditTLD = (tld: any) => {
    setEditingTLD(tld)
    setFormData({
      extension: tld.extension,
      registrarId: tld.registrarId,
      registrationPrice: tld.registrationPrice.toString(),
      renewalPrice: tld.renewalPrice.toString(),
      transferPrice: tld.transferPrice.toString(),
      redemptionPrice: tld.redemptionPrice.toString(),
      billingCycle: tld.billingCycle,
      status: tld.status,
      category: tld.category,
      minYears: tld.minYears.toString(),
      maxYears: tld.maxYears.toString(),
      autoRenew: tld.autoRenew,
      whoisPrivacy: tld.whoisPrivacy,
      dnssec: tld.dnssec,
    })
  }

  const handleUpdateTLD = () => {
    const updatedTLDs = tlds.map((tld) =>
      tld.id === editingTLD.id
        ? {
            ...tld,
            ...formData,
            registrationPrice: Number.parseFloat(formData.registrationPrice),
            renewalPrice: Number.parseFloat(formData.renewalPrice),
            transferPrice: Number.parseFloat(formData.transferPrice),
            redemptionPrice: Number.parseFloat(formData.redemptionPrice),
            minYears: Number.parseInt(formData.minYears),
            maxYears: Number.parseInt(formData.maxYears),
            registrarName: mockRegistrars.find((r) => r.id === formData.registrarId)?.name || "",
          }
        : tld,
    )
    setTlds(updatedTLDs)
    setEditingTLD(null)
    resetForm()
  }

  const handleDeleteTLD = (id: number) => {
    setTlds(tlds.filter((tld) => tld.id !== id))
  }

  const resetForm = () => {
    setFormData({
      extension: "",
      registrarId: "",
      registrationPrice: "",
      renewalPrice: "",
      transferPrice: "",
      redemptionPrice: "",
      billingCycle: "annually",
      status: "active",
      category: "generic",
      minYears: "1",
      maxYears: "10",
      autoRenew: true,
      whoisPrivacy: true,
      dnssec: true,
    })
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "generic":
        return "default"
      case "country-code":
        return "secondary"
      case "new-gtld":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TLD Management</h1>
          <p className="text-muted-foreground">Manage domain extensions and registrar pricing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add TLD
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New TLD</DialogTitle>
              <DialogDescription>Configure a new top-level domain with registrar and pricing</DialogDescription>
            </DialogHeader>
            <TLDForm formData={formData} setFormData={setFormData} registrars={mockRegistrars} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTLD}>Add TLD</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tlds.map((tld) => (
              <Card key={tld.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{tld.extension}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={tld.status === "active" ? "default" : "secondary"}>{tld.status}</Badge>
                      <Badge variant={getCategoryBadgeVariant(tld.category)} className="text-xs">
                        {tldCategories.find((c) => c.value === tld.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building className="h-3 w-3" />
                    <span>{tld.registrarName}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" />
                          Registration
                        </span>
                        <span className="font-medium">${tld.registrationPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Renewal</span>
                        <span className="font-medium">${tld.renewalPrice}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Transfer</span>
                        <span className="font-medium">${tld.transferPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Redemption</span>
                        <span className="font-medium">${tld.redemptionPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Term
                      </span>
                      <span className="font-medium">
                        {tld.minYears}-{tld.maxYears} years
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tld.autoRenew && (
                      <Badge variant="outline" className="text-xs">
                        Auto-Renew
                      </Badge>
                    )}
                    {tld.whoisPrivacy && (
                      <Badge variant="outline" className="text-xs">
                        WHOIS Privacy
                      </Badge>
                    )}
                    {tld.dnssec && (
                      <Badge variant="outline" className="text-xs">
                        DNSSEC
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTLD(tld)} className="flex-1">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTLD(tld.id)}
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

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TLD Pricing Table</CardTitle>
              <CardDescription>Complete overview of all managed TLDs and their pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Extension</TableHead>
                    <TableHead>Registrar</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Transfer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tlds.map((tld) => (
                    <TableRow key={tld.id}>
                      <TableCell className="font-medium">{tld.extension}</TableCell>
                      <TableCell>{tld.registrarName}</TableCell>
                      <TableCell>
                        <Badge variant={getCategoryBadgeVariant(tld.category)} className="text-xs">
                          {tldCategories.find((c) => c.value === tld.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>${tld.registrationPrice}</TableCell>
                      <TableCell>${tld.renewalPrice}</TableCell>
                      <TableCell>${tld.transferPrice}</TableCell>
                      <TableCell>
                        <Badge variant={tld.status === "active" ? "default" : "secondary"}>{tld.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditTLD(tld)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTLD(tld.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit TLD Dialog */}
      <Dialog open={!!editingTLD} onOpenChange={() => setEditingTLD(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit TLD</DialogTitle>
            <DialogDescription>Update TLD configuration and pricing</DialogDescription>
          </DialogHeader>
          <TLDForm formData={formData} setFormData={setFormData} registrars={mockRegistrars} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTLD(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTLD}>Update TLD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TLDForm({ formData, setFormData, registrars }: any) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="extension">TLD Extension</Label>
          <Input
            id="extension"
            value={formData.extension}
            onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
            placeholder="e.g., .com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrarId">Registrar</Label>
          <Select
            value={formData.registrarId}
            onValueChange={(value) => setFormData({ ...formData, registrarId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select registrar" />
            </SelectTrigger>
            <SelectContent>
              {registrars
                .filter((registrar: any) => registrar.apiStatus === "connected")
                .map((registrar: any) => (
                  <SelectItem key={registrar.id} value={registrar.id}>
                    {registrar.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tldCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <Select
            value={formData.billingCycle}
            onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annually">Annually</SelectItem>
              <SelectItem value="biennially">Biennially</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registrationPrice">Registration Price ($)</Label>
          <Input
            id="registrationPrice"
            type="number"
            step="0.01"
            value={formData.registrationPrice}
            onChange={(e) => setFormData({ ...formData, registrationPrice: e.target.value })}
            placeholder="12.99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="renewalPrice">Renewal Price ($)</Label>
          <Input
            id="renewalPrice"
            type="number"
            step="0.01"
            value={formData.renewalPrice}
            onChange={(e) => setFormData({ ...formData, renewalPrice: e.target.value })}
            placeholder="14.99"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transferPrice">Transfer Price ($)</Label>
          <Input
            id="transferPrice"
            type="number"
            step="0.01"
            value={formData.transferPrice}
            onChange={(e) => setFormData({ ...formData, transferPrice: e.target.value })}
            placeholder="12.99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="redemptionPrice">Redemption Price ($)</Label>
          <Input
            id="redemptionPrice"
            type="number"
            step="0.01"
            value={formData.redemptionPrice}
            onChange={(e) => setFormData({ ...formData, redemptionPrice: e.target.value })}
            placeholder="89.99"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minYears">Minimum Years</Label>
          <Select value={formData.minYears} onValueChange={(value) => setFormData({ ...formData, minYears: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year} year{year > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxYears">Maximum Years</Label>
          <Select value={formData.maxYears} onValueChange={(value) => setFormData({ ...formData, maxYears: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year} year{year > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status === "active"}
            onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
          />
          <Label htmlFor="status">Active TLD</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoRenew"
            checked={formData.autoRenew}
            onCheckedChange={(checked) => setFormData({ ...formData, autoRenew: checked })}
          />
          <Label htmlFor="autoRenew">Auto-Renewal Available</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="whoisPrivacy"
            checked={formData.whoisPrivacy}
            onCheckedChange={(checked) => setFormData({ ...formData, whoisPrivacy: checked })}
          />
          <Label htmlFor="whoisPrivacy">WHOIS Privacy Protection</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="dnssec"
            checked={formData.dnssec}
            onCheckedChange={(checked) => setFormData({ ...formData, dnssec: checked })}
          />
          <Label htmlFor="dnssec">DNSSEC Support</Label>
        </div>
      </div>
    </div>
  )
}
