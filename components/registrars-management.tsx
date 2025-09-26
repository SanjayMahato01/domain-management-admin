"use client"

import { useState, useEffect } from "react"
import { useForm, UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Building,
  Key,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react"

// Types
export type Status = "ACTIVE" | "INACTIVE"

export interface Registrar {
  id: number
  name: string
  website: string
  apiEndpoint: string
  sandboxApiEndpoint: string
  commissionPercentage: number | null
  status: Status
  sandboxMode: boolean
  lastSyncDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface TestConnectionResponse {
  success: boolean
  status: 'connected' | 'disconnected' | 'timeout' | 'error'
  message: string
  details?: {
    statusCode?: number
    responseTime?: string
    error?: string
    code?: string
  }
}

export interface ApiError {
  response?: {
    data?: {
      error?: string
    }
    status: number
  }
  message: string
}

// Zod validation schema
const registrarSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  website: z.string()
    .url("Please enter a valid URL")
    .min(1, "Website is required"),
  apiEndpoint: z.string()
    .url("Please enter a valid API endpoint URL")
    .min(1, "API endpoint is required"),
  sandboxApiEndpoint: z.string()
    .url("Please enter a valid sandbox API endpoint URL")
    .optional()
    .or(z.literal("")),
  commissionPercentage: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
      message: "Commission must be between 0 and 100"
    }),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sandboxMode: z.boolean().default(false)
})

export type RegistrarFormData = z.infer<typeof registrarSchema>

interface RegistrarFormProps {
  register: UseFormRegister<RegistrarFormData>
  errors: FieldErrors<RegistrarFormData>
  setValue: UseFormSetValue<RegistrarFormData>
  watchedStatus: Status
  watchedSandboxMode: boolean
}

export  function RegistrarManagement() {
  const [registrars, setRegistrars] = useState<Registrar[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [editingRegistrar, setEditingRegistrar] = useState<Registrar | null>(null)
  const [testingConnections, setTestingConnections] = useState<Set<number>>(new Set())

  // Form for create/edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegistrarFormData>({
    resolver: zodResolver(registrarSchema),
    defaultValues: {
      status: "ACTIVE",
      sandboxMode: false
    }
  })

  // Watch form values for controlled components
  const watchedStatus = watch("status")
  const watchedSandboxMode = watch("sandboxMode")

  // Fetch registrars on component mount
  useEffect(() => {
    fetchRegistrars()
  }, [])

  const fetchRegistrars = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse<Registrar[]>>('/api/registrar/fetch-all-registrar')
      if (response.data.success && response.data.data) {
        setRegistrars(response.data.data)
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error("Failed to fetch registrars")
      console.error("Error fetching registrars:", apiError)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitCreate = async (data: RegistrarFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        sandboxApiEndpoint: data.sandboxApiEndpoint || data.apiEndpoint,
        commissionPercentage: data.commissionPercentage ? Number(data.commissionPercentage) : null
      }

      const response = await axios.post<ApiResponse<Registrar>>('/api/registrar/create-new-registrar', payload)
      
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || "Registrar created successfully")
        setRegistrars(prev => [...prev, response.data.data!])
        setIsCreateDialogOpen(false)
        reset()
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to create registrar")
    }
  }

  const onSubmitEdit = async (data: RegistrarFormData): Promise<void> => {
    if (!editingRegistrar) return

    try {
      const payload = {
        ...data,
        sandboxApiEndpoint: data.sandboxApiEndpoint || data.apiEndpoint,
        commissionPercentage: data.commissionPercentage ? Number(data.commissionPercentage) : null
      }

      const response = await axios.put<ApiResponse<Registrar>>(`/api/registrars/update-registrar/${editingRegistrar.id}`, payload)
      
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || "Registrar updated successfully")
        setRegistrars(prev => prev.map(r => 
          r.id === editingRegistrar.id ? response.data.data! : r
        ))
        setEditingRegistrar(null)
        reset()
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to update registrar")
    }
  }

  const handleEdit = (registrar: Registrar): void => {
    setEditingRegistrar(registrar)
    reset({
      name: registrar.name,
      website: registrar.website,
      apiEndpoint: registrar.apiEndpoint,
      sandboxApiEndpoint: registrar.sandboxApiEndpoint || "",
      commissionPercentage: registrar.commissionPercentage?.toString() || "",
      status: registrar.status,
      sandboxMode: registrar.sandboxMode
    })
  }

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Are you sure you want to delete this registrar?")) return

    try {
      const response = await axios.delete<ApiResponse>(`/api/registrars/delete-registrar/${id}`)
      
      if (response.data.success) {
        toast.success(response.data.message || "Registrar deleted successfully")
        setRegistrars(prev => prev.filter(r => r.id !== id))
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to delete registrar")
    }
  }

  const handleTestConnection = async (id: number): Promise<void> => {
    try {
      setTestingConnections(prev => new Set([...prev, id]))
      
      const response = await axios.post<TestConnectionResponse>(`/api/registrars/test-registrar-connection/${id}/`)
      
      if (response.data.success) {
        toast.success(response.data.message)
        // Update registrar with last sync date if successful
        fetchRegistrars()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to test connection")
    } finally {
      setTestingConnections(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleManualSync = async (id: number): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse<Registrar>>(`/api/registrars/manual-sync/${id}`)
      
      if (response.data.success) {
        toast.success(response.data.message || "Manual sync completed")
        fetchRegistrars()
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to sync registrar")
    }
  }

  const getStatusBadge = (status: Status): JSX.Element => {
    return (
      <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
        {status.toLowerCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registrar Management</h1>
          <p className="text-muted-foreground">Manage domain registrar integrations and API connections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRegistrars}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Registrar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Registrar</DialogTitle>
                <DialogDescription>Configure a new domain registrar integration</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitCreate)}>
                <RegistrarForm 
                  register={register} 
                  errors={errors} 
                  setValue={setValue}
                  watchedStatus={watchedStatus}
                  watchedSandboxMode={watchedSandboxMode}
                />
                <DialogFooter className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Registrar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-status">API Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registrars.map((registrar) => (
              <Card key={registrar.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{registrar.name}</CardTitle>
                    </div>
                    {getStatusBadge(registrar.status)}
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <Globe className="h-3 w-3" />
                    <a href={registrar.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {new URL(registrar.website).hostname}
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {registrar.commissionPercentage && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" />
                          Commission
                        </span>
                        <span className="font-medium">{registrar.commissionPercentage}%</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Mode</span>
                      <Badge variant={registrar.sandboxMode ? "secondary" : "outline"} className="text-xs">
                        {registrar.sandboxMode ? "Sandbox" : "Live"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Last Sync
                      </span>
                      <span className="font-medium text-xs">{formatDate(registrar.lastSyncDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(registrar.id)}
                      disabled={testingConnections.has(registrar.id)}
                      className="flex-1"
                    >
                      {testingConnections.has(registrar.id) ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-3 w-3" />
                      )}
                      Test API
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(registrar)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(registrar.id)}
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

        <TabsContent value="api-status" className="space-y-4">
          <div className="grid gap-4">
            {registrars.map((registrar) => (
              <Card key={registrar.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>{registrar.name}</span>
                    </CardTitle>
                    {getStatusBadge(registrar.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">API Endpoint</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                        {registrar.sandboxMode ? registrar.sandboxApiEndpoint : registrar.apiEndpoint}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mode</Label>
                      <p className="text-sm bg-muted p-2 rounded">
                        {registrar.sandboxMode ? "Sandbox" : "Live"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Commission</Label>
                      <p className="text-sm bg-muted p-2 rounded">
                        {registrar.commissionPercentage ? `${registrar.commissionPercentage}%` : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Last Sync</Label>
                      <p className="text-sm bg-muted p-2 rounded">{formatDate(registrar.lastSyncDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleTestConnection(registrar.id)}
                      disabled={testingConnections.has(registrar.id)}
                    >
                      {testingConnections.has(registrar.id) ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-3 w-3" />
                      )}
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleManualSync(registrar.id)}>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Manual Sync
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(registrar)}>
                      <Settings className="mr-2 h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Registrar Dialog */}
      <Dialog open={!!editingRegistrar} onOpenChange={() => {
        setEditingRegistrar(null)
        reset()
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Registrar</DialogTitle>
            <DialogDescription>Update registrar configuration and API settings</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <RegistrarForm 
              register={register} 
              errors={errors} 
              setValue={setValue}
              watchedStatus={watchedStatus}
              watchedSandboxMode={watchedSandboxMode}
            />
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingRegistrar(null)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Registrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RegistrarForm({ register, errors, setValue, watchedStatus, watchedSandboxMode }: RegistrarFormProps): JSX.Element {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Registrar Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Namecheap"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website *</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="https://www.namecheap.com"
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiEndpoint">API Endpoint *</Label>
        <Input
          id="apiEndpoint"
          {...register("apiEndpoint")}
          placeholder="https://api.namecheap.com/xml.response"
        />
        {errors.apiEndpoint && (
          <p className="text-sm text-destructive">{errors.apiEndpoint.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sandboxApiEndpoint">Sandbox API Endpoint</Label>
        <Input
          id="sandboxApiEndpoint"
          {...register("sandboxApiEndpoint")}
          placeholder="https://api.sandbox.namecheap.com/xml.response"
        />
        {errors.sandboxApiEndpoint && (
          <p className="text-sm text-destructive">{errors.sandboxApiEndpoint.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="commissionPercentage">Commission (%)</Label>
        <Input
          id="commissionPercentage"
          type="number"
          step="0.01"
          {...register("commissionPercentage")}
          placeholder="15.50"
        />
        {errors.commissionPercentage && (
          <p className="text-sm text-destructive">{errors.commissionPercentage.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={watchedStatus === "ACTIVE"}
            onCheckedChange={(checked: boolean) => setValue("status", checked ? "ACTIVE" : "INACTIVE")}
          />
          <Label htmlFor="status">Active Registrar</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sandboxMode"
            checked={watchedSandboxMode}
            onCheckedChange={(checked: boolean) => setValue("sandboxMode", checked)}
          />
          <Label htmlFor="sandboxMode">Sandbox Mode</Label>
        </div>
      </div>
    </div>
  )
}