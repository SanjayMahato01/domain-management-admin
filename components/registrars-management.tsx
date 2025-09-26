"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, type UseFormRegister, type FieldErrors, type UseFormSetValue } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { AxiosError } from "axios"
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
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  EyeOff,
  Eye,
} from "lucide-react"
import axios from "axios"

function formatDate(value: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString();
}

export type Status = "ACTIVE" | "INACTIVE"

export interface Registrar {
  id: number
  name: string
  website: string
  apiEndpoint: string
  sandboxApiEndpoint: string
  apiKey: string
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

export interface ApiError {
  response?: {
    data?: {
      error?: string
    }
    status: number
  }
  message: string
}

const registrarSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  website: z.string().url("Please enter a valid URL").min(1, "Website is required"),
  apiEndpoint: z.string().url("Please enter a valid API endpoint URL").min(1, "API endpoint is required"),
  sandboxApiEndpoint: z.string().url("Please enter a valid sandbox API endpoint URL").optional().or(z.literal("")),
  apiKey: z.string().min(1, "API key is required").max(500, "API key must be less than 500 characters"),
  commissionPercentage: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), {
      message: "Commission must be between 0 and 100",
    }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  sandboxMode: z.boolean(),
})

export type RegistrarFormData = z.infer<typeof registrarSchema>

interface RegistrarFormProps {
  register: UseFormRegister<RegistrarFormData>
  errors: FieldErrors<RegistrarFormData>
  setValue: UseFormSetValue<RegistrarFormData>
  watchedStatus: Status
  watchedSandboxMode: boolean
}

export function RegistrarManagement() {
  const [registrars, setRegistrars] = useState<Registrar[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [editingRegistrar, setEditingRegistrar] = useState<Registrar | null>(null)

  // Form for create/edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarFormData>({
    resolver: zodResolver(registrarSchema),
    defaultValues: {
      status: "ACTIVE",
      sandboxMode: false,
    },
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
      const response = await axios.get<ApiResponse<Registrar[]>>("/api/registrar/fetch-all-registrar")
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
        commissionPercentage: data.commissionPercentage ? Number(data.commissionPercentage) : null,
        apiKey: data.apiKey,
      }

      const response = await axios.post<ApiResponse<Registrar>>("/api/registrar/create-new-registrar", payload)

      if (response.data.success) {
        toast.success("Registrar created successfully")
        fetchRegistrars()
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
        commissionPercentage: data.commissionPercentage ? Number(data.commissionPercentage) : null,
        apiKey: data.apiKey,
      }

      const response = await axios.put<ApiResponse<Registrar>>(`/api/registrar/update-registrar/${editingRegistrar.id}`, payload)

      if (response.data.success) {
        toast.success("Registrar updated successfully")
        fetchRegistrars()
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
      apiKey: registrar.apiKey,
      commissionPercentage: registrar.commissionPercentage?.toString() || "",
      status: registrar.status,
      sandboxMode: registrar.sandboxMode,
    })
  }

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Are you sure you want to delete this registrar?")) return

    try {
      const response = await axios.delete<ApiResponse>(`/api/registrar/delete-registrar/${id}`)

      if (response.data.success) {
        toast.success("Registrar deleted successfully")
        fetchRegistrars()
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to delete registrar")
    }
  }

  const handleManualSync = async (id: number): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse>(`/api/registrar/manual-sync/${id}`)

      if (response.data.success) {
        toast.success("Manual sync completed")
        fetchRegistrars()
      }
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>
      toast.error(apiError.response?.data?.error || "Failed to sync registrar")
    }
  }

  const getStatusBadge = (status: Status): React.JSX.Element => {
    return <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>{status.toLowerCase()}</Badge>
  }

  const getApiStatusIcon = (registrar: Registrar): React.JSX.Element => {
    const status = registrar.status === "ACTIVE" ? "connected" : "disconnected"
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getApiStatusBadgeVariant = (registrar: Registrar): "default" | "destructive" | "secondary" | "outline" => {
    const status = registrar.status === "ACTIVE" ? "connected" : "disconnected"
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "destructive"
      default:
        return "outline"
    }
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
          <div className="grid gap-4 md:grid-cols-2">
            {registrars.map((registrar) => (
              <Card key={registrar.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{registrar.name}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getStatusBadge(registrar.status)}
                      <Badge variant={getApiStatusBadgeVariant(registrar)} className="text-xs">
                        {getApiStatusIcon(registrar)}
                        <span className="ml-1">{registrar.status === "ACTIVE" ? "connected" : "disconnected"}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <Globe className="h-3 w-3" />
                    <a href={registrar.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {registrar.website}
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" />
                          Commission
                        </span>
                        <span className="font-medium">{registrar.commissionPercentage || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sandbox</span>
                        <Badge variant={registrar.sandboxMode ? "secondary" : "outline"} className="text-xs">
                          {registrar.sandboxMode ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Last Sync
                        </span>
                        <span className="font-medium text-xs">{formatDate(registrar.lastSyncDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
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
                      {getApiStatusIcon(registrar)}
                    </CardTitle>
                    <Badge variant={getApiStatusBadgeVariant(registrar)}>
                      {registrar.status === "ACTIVE" ? "connected" : "disconnected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">API Endpoint</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                        {registrar.sandboxMode ? registrar.sandboxApiEndpoint : registrar.apiEndpoint}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Last Sync</Label>
                      <p className="text-sm bg-muted p-2 rounded">{formatDate(registrar.lastSyncDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
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
      <Dialog
        open={!!editingRegistrar}
        onOpenChange={() => {
          setEditingRegistrar(null)
          reset()
        }}
      >
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

function RegistrarForm({
  register,
  errors,
  setValue,
  watchedStatus,
  watchedSandboxMode,
}: RegistrarFormProps): React.JSX.Element {

  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Registrar Name *</Label>
          <Input id="name" {...register("name")} placeholder="Namecheap" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website *</Label>
          <Input id="website" {...register("website")} placeholder="https://www.namecheap.com" />
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiEndpoint">API Endpoint *</Label>
        <Input id="apiEndpoint" {...register("apiEndpoint")} placeholder="https://api.namecheap.com/xml.response" />
        {errors.apiEndpoint && <p className="text-sm text-destructive">{errors.apiEndpoint.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sandboxApiEndpoint">Sandbox API Endpoint</Label>
        <Input
          id="sandboxApiEndpoint"
          {...register("sandboxApiEndpoint")}
          placeholder="https://api.sandbox.namecheap.com/xml.response"
        />
        {errors.sandboxApiEndpoint && <p className="text-sm text-destructive">{errors.sandboxApiEndpoint.message}</p>}
      </div>

       <div className="space-y-2 relative">
        <Label htmlFor="apiKey">API Key *</Label>
        <div className="relative">
          <Input
            id="apiKey"
            type={showApiKey ? "text" : "password"}
            {...register("apiKey")}
            placeholder="Enter your API key"
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(prev => !prev)}
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
          >
            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.apiKey && <p className="text-sm text-destructive">{errors.apiKey.message}</p>}
        <p className="text-xs text-muted-foreground">
          Your API key will be stored securely and used for registrar API calls
        </p>
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
