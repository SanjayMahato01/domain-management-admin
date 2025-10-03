"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import axios from "axios"
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
import { Plus, Edit, Trash2, Globe, DollarSign, Calendar, Building, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { RegistrarSelect } from "@/components/reuseable-inputs/registrar-select"

interface TLD {
  id: string
  tldExtension: string
  registrarId: number
  registrar: {
    id: number
    name: string
    status: "ACTIVE" | "INACTIVE"
  }
  category: string
  billingCycle: string
  registrationPrice: string
  renewalPrice: string
  transferPrice: string
  redemptionPrice: string
  minimumYears: number
  maximumYears: number
  status: boolean
  autoRenewal: boolean
  whoisPrivacy: boolean
  dnssecPrivacy: boolean
}

interface Registrar {
  id: number
  name: string
  status: "ACTIVE" | "INACTIVE"
  website: string
  apiEndpoint: string
  sandboxMode: boolean
}

const tldCategories = [
  { value: "generic", label: "Generic TLD" },
  { value: "country-code", label: "Country Code TLD" },
  { value: "new-gtld", label: "New gTLD" },
  { value: "sponsored", label: "Sponsored TLD" },
]

interface TLDManagementProps {
  initialTLDs?: TLD[]
  initialRegistrars?: Registrar[]
  initialError?: string | null
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL || "/api",
  timeout: 10000,
})

// Move TLDForm outside the main component to prevent re-renders
const TLDForm = React.memo(({ formData, onFormDataChange, registrars }: {
  formData: any
  onFormDataChange: (field: string, value: any) => void
  registrars: Registrar[]
}) => {
  const handleInputChange = (field: string, value: string) => {
    onFormDataChange(field, value)
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    onFormDataChange(field, checked)
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="extension">TLD Extension</Label>
          <Input
            id="extension"
            value={formData.tldExtension}
            onChange={(e) => handleInputChange('tldExtension', e.target.value)}
            placeholder="e.g., .com"
          />
        </div>
        <RegistrarSelect
          value={formData.registrarId}
          onValueChange={(value) => handleInputChange('registrarId', value)}
          label="Registrar"
          placeholder="Select registrar"
          required={true}
          showRefresh={true}
          filterActive={true}
          registrars={registrars}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
            onValueChange={(value) => handleInputChange('billingCycle', value)}
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
            onChange={(e) => handleInputChange('registrationPrice', e.target.value)}
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
            onChange={(e) => handleInputChange('renewalPrice', e.target.value)}
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
            onChange={(e) => handleInputChange('transferPrice', e.target.value)}
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
            onChange={(e) => handleInputChange('redemptionPrice', e.target.value)}
            placeholder="89.99"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minYears">Minimum Years</Label>
          <Select
            value={formData.minimumYears}
            onValueChange={(value) => handleInputChange('minimumYears', value)}
          >
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
          <Select
            value={formData.maximumYears}
            onValueChange={(value) => handleInputChange('maximumYears', value)}
          >
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
            onCheckedChange={(checked) => handleInputChange('status', checked ? "active" : "inactive")}
          />
          <Label htmlFor="status">Active TLD</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoRenew"
            checked={formData.autoRenewal}
            onCheckedChange={(checked) => handleSwitchChange('autoRenewal', checked)}
          />
          <Label htmlFor="autoRenew">Auto-Renewal Available</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="whoisPrivacy"
            checked={formData.whoisPrivacy}
            onCheckedChange={(checked) => handleSwitchChange('whoisPrivacy', checked)}
          />
          <Label htmlFor="whoisPrivacy">WHOIS Privacy Protection</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="dnssec"
            checked={formData.dnssecPrivacy}
            onCheckedChange={(checked) => handleSwitchChange('dnssecPrivacy', checked)}
          />
          <Label htmlFor="dnssec">DNSSEC Support</Label>
        </div>
      </div>
    </div>
  )
})

TLDForm.displayName = 'TLDForm'

export default function TLDManagement({ initialTLDs = [], initialRegistrars = [], initialError }: TLDManagementProps) {
  const [tlds, setTlds] = useState<TLD[]>(initialTLDs)
  const [registrars, setRegistrars] = useState<Registrar[]>(initialRegistrars)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTLD, setEditingTLD] = useState<TLD | null>(null)

  // Separate form states for create and edit
  const [createFormData, setCreateFormData] = useState({
    tldExtension: "",
    registrarId: "",
    registrationPrice: "",
    renewalPrice: "",
    transferPrice: "",
    redemptionPrice: "",
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minimumYears: "1",
    maximumYears: "10",
    autoRenewal: true,
    whoisPrivacy: true,
    dnssecPrivacy: true,
  })

  const [editFormData, setEditFormData] = useState({
    tldExtension: "",
    registrarId: "",
    registrationPrice: "",
    renewalPrice: "",
    transferPrice: "",
    redemptionPrice: "",
    billingCycle: "annually",
    status: "active",
    category: "generic",
    minimumYears: "1",
    maximumYears: "10",
    autoRenewal: true,
    whoisPrivacy: true,
    dnssecPrivacy: true,
  })

  // Memoized form data handlers to prevent re-renders
  const handleCreateFormDataChange = useCallback((field: string, value: any) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleEditFormDataChange = useCallback((field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // API functions using Axios
  const fetchTLDs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get("/tlds/get-all-tlds")
      const result = response.data

      if (result.success) {
        setTlds(result.data)
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch TLDs"
      setError(errorMessage)
      toast.error("error")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRegistrars = async (filterActive = false) => {
    try {
      const response = await api.get(`/registrar/fetch-active-registrar?filterActive=${filterActive}`)
      const result = response.data

      if (result.success) {
        setRegistrars(result.data)
      }
    } catch (err: any) {
      console.error("Failed to fetch registrars:", err)
      toast.error("Failed to fetch registrars")
    }
  }

  const createTLD = async (data: any) => {
    try {
      const response = await api.post("/tlds/add-tld", data)
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to create TLD")
    }
  }

  const updateTLD = async (id: string, data: any) => {
    try {
      const response = await api.put(`/tlds/${id}`, data)
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update TLD")
    }
  }

  const deleteTLD = async (id: string) => {
    try {
      const response = await api.delete(`/tlds/${id}`)
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to delete TLD")
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    if (initialTLDs.length === 0) {
      fetchTLDs()
    }
    if (initialRegistrars.length === 0) {
      fetchRegistrars(true)
    }
  }, [initialTLDs.length, initialRegistrars.length, fetchTLDs])

  const handleCreateTLD = async () => {
    try {
      setLoading(true)

      if (!createFormData.registrarId) {
        toast.error("Please select a registrar")
        return
      }

      const result = await createTLD({
        tldExtension: createFormData.tldExtension,
        registrarId: Number.parseInt(createFormData.registrarId),
        category: createFormData.category,
        billingCycle: createFormData.billingCycle,
        registrationPrice: createFormData.registrationPrice,
        renewalPrice: createFormData.renewalPrice,
        transferPrice: createFormData.transferPrice,
        redemptionPrice: createFormData.redemptionPrice,
        minimumYears: Number.parseInt(createFormData.minimumYears),
        maximumYears: Number.parseInt(createFormData.maximumYears),
        status: createFormData.status === "active",
        autoRenewal: createFormData.autoRenewal,
        whoisPrivacy: createFormData.whoisPrivacy,
        dnssecPrivacy: createFormData.dnssecPrivacy,
      })

      if (result.success) {
        setTlds([result.data, ...tlds])
        setIsCreateDialogOpen(false)
        resetCreateForm()
        toast.success("TLD created successfully")
      } else {
        toast.error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTLD = async () => {
    if (!editingTLD) return

    try {
      setLoading(true)

      if (!editFormData.registrarId) {
        toast.error("Please select a registrar")
        return
      }

      const result = await updateTLD(editingTLD.id, {
        tldExtension: editFormData.tldExtension,
        registrarId: Number.parseInt(editFormData.registrarId),
        category: editFormData.category,
        billingCycle: editFormData.billingCycle,
        registrationPrice: editFormData.registrationPrice,
        renewalPrice: editFormData.renewalPrice,
        transferPrice: editFormData.transferPrice,
        redemptionPrice: editFormData.redemptionPrice,
        minimumYears: Number.parseInt(editFormData.minimumYears),
        maximumYears: Number.parseInt(editFormData.maximumYears),
        status: editFormData.status === "active",
        autoRenewal: editFormData.autoRenewal,
        whoisPrivacy: editFormData.whoisPrivacy,
        dnssecPrivacy: editFormData.dnssecPrivacy,
      })

      if (result.success) {
        setTlds(tlds.map((tld) => (tld.id === editingTLD.id ? result.data : tld)))
        setEditingTLD(null)
        resetEditForm()
        toast.success("TLD updated successfully")
      } else {
        toast.error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTLD = async (id: string) => {
    if (!confirm("Are you sure you want to delete this TLD?")) return

    try {
      setLoading(true)

      const result = await deleteTLD(id)

      if (result.success) {
        setTlds(tlds.filter((tld) => tld.id !== id))
        toast.success("TLD deleted successfully")
      } else {
        toast.error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTLD = (tld: TLD) => {
    setEditingTLD(tld)
    setEditFormData({
      tldExtension: tld.tldExtension,
      registrarId: tld.registrarId.toString(),
      registrationPrice: tld.registrationPrice,
      renewalPrice: tld.renewalPrice,
      transferPrice: tld.transferPrice,
      redemptionPrice: tld.redemptionPrice,
      billingCycle: tld.billingCycle,
      status: tld.status ? "active" : "inactive",
      category: tld.category,
      minimumYears: tld.minimumYears.toString(),
      maximumYears: tld.maximumYears.toString(),
      autoRenewal: tld.autoRenewal,
      whoisPrivacy: tld.whoisPrivacy,
      dnssecPrivacy: tld.dnssecPrivacy,
    })
  }

  const resetCreateForm = () => {
    setCreateFormData({
      tldExtension: "",
      registrarId: "",
      registrationPrice: "",
      renewalPrice: "",
      transferPrice: "",
      redemptionPrice: "",
      billingCycle: "annually",
      status: "active",
      category: "generic",
      minimumYears: "1",
      maximumYears: "10",
      autoRenewal: true,
      whoisPrivacy: true,
      dnssecPrivacy: true,
    })
  }

  const resetEditForm = () => {
    setEditFormData({
      tldExtension: "",
      registrarId: "",
      registrationPrice: "",
      renewalPrice: "",
      transferPrice: "",
      redemptionPrice: "",
      billingCycle: "annually",
      status: "active",
      category: "generic",
      minimumYears: "1",
      maximumYears: "10",
      autoRenewal: true,
      whoisPrivacy: true,
      dnssecPrivacy: true,
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

  // Memoized form components to prevent unnecessary re-renders
  const createForm = useMemo(() => (
    <TLDForm 
      formData={createFormData} 
      onFormDataChange={handleCreateFormDataChange}
      registrars={registrars} 
    />
  ), [createFormData, handleCreateFormDataChange, registrars])

  const editForm = useMemo(() => (
    <TLDForm 
      formData={editFormData} 
      onFormDataChange={handleEditFormDataChange}
      registrars={registrars} 
    />
  ), [editFormData, handleEditFormDataChange, registrars])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TLD Management</h1>
          <p className="text-muted-foreground">Manage domain extensions and registrar pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTLDs} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
              {createForm}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTLD} disabled={loading}>
                  {loading ? "Adding..." : "Add TLD"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && tlds.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading TLDs...</span>
        </div>
      ) : (
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
                        <CardTitle className="text-xl">{tld.tldExtension}</CardTitle>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={tld.status ? "default" : "secondary"}>
                          {tld.status ? "active" : "inactive"}
                        </Badge>
                        <Badge variant={getCategoryBadgeVariant(tld.category)} className="text-xs">
                          {tldCategories.find((c) => c.value === tld.category)?.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>{tld.registrar.name}</span>
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
                          {tld.minimumYears}-{tld.maximumYears} years
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {tld.autoRenewal && (
                        <Badge variant="outline" className="text-xs">
                          Auto-Renew
                        </Badge>
                      )}
                      {tld.whoisPrivacy && (
                        <Badge variant="outline" className="text-xs">
                          WHOIS Privacy
                        </Badge>
                      )}
                      {tld.dnssecPrivacy && (
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
                        <TableCell className="font-medium">{tld.tldExtension}</TableCell>
                        <TableCell>{tld.registrar.name}</TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(tld.category)} className="text-xs">
                            {tldCategories.find((c) => c.value === tld.category)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>${tld.registrationPrice}</TableCell>
                        <TableCell>${tld.renewalPrice}</TableCell>
                        <TableCell>${tld.transferPrice}</TableCell>
                        <TableCell>
                          <Badge variant={tld.status ? "default" : "secondary"}>
                            {tld.status ? "active" : "inactive"}
                          </Badge>
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
      )}

      {/* Edit TLD Dialog */}
      <Dialog open={!!editingTLD} onOpenChange={() => setEditingTLD(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit TLD</DialogTitle>
            <DialogDescription>Update TLD configuration and pricing</DialogDescription>
          </DialogHeader>
          {editForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTLD(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTLD} disabled={loading}>
              {loading ? "Updating..." : "Update TLD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}