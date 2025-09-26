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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"

// Mock data for billing cycles
const mockBillingCycles = [
  {
    id: "monthly",
    name: "Monthly",
    description: "Billed every month",
    duration: 1,
    unit: "month",
    discountPercent: 0,
    setupFee: 0,
    status: "active",
    isDefault: false,
    sortOrder: 1,
    usageCount: 1247,
    revenue: 24580.0,
    conversionRate: 45.2,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    description: "Billed every 3 months",
    duration: 3,
    unit: "month",
    discountPercent: 5,
    setupFee: 0,
    status: "active",
    isDefault: false,
    sortOrder: 2,
    usageCount: 432,
    revenue: 18720.0,
    conversionRate: 28.7,
  },
  {
    id: "semi-annually",
    name: "Semi-Annually",
    description: "Billed every 6 months",
    duration: 6,
    unit: "month",
    discountPercent: 10,
    setupFee: 0,
    status: "active",
    isDefault: false,
    sortOrder: 3,
    usageCount: 298,
    revenue: 15640.0,
    conversionRate: 18.9,
  },
  {
    id: "annually",
    name: "Annually",
    description: "Billed every year",
    duration: 1,
    unit: "year",
    discountPercent: 15,
    setupFee: 0,
    status: "active",
    isDefault: true,
    sortOrder: 4,
    usageCount: 567,
    revenue: 42350.0,
    conversionRate: 35.8,
  },
  {
    id: "biennially",
    name: "Biennially",
    description: "Billed every 2 years",
    duration: 2,
    unit: "year",
    discountPercent: 20,
    setupFee: 0,
    status: "active",
    isDefault: false,
    sortOrder: 5,
    usageCount: 156,
    revenue: 18720.0,
    conversionRate: 12.4,
  },
  {
    id: "triennially",
    name: "Triennially",
    description: "Billed every 3 years",
    duration: 3,
    unit: "year",
    discountPercent: 25,
    setupFee: 0,
    status: "inactive",
    isDefault: false,
    sortOrder: 6,
    usageCount: 23,
    revenue: 2840.0,
    conversionRate: 3.2,
  },
]

const billingUnits = [
  { value: "day", label: "Day(s)" },
  { value: "week", label: "Week(s)" },
  { value: "month", label: "Month(s)" },
  { value: "year", label: "Year(s)" },
]

export default function Billing() {
  const [billingCycles, setBillingCycles] = useState(mockBillingCycles)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCycle, setEditingCycle] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    unit: "month",
    discountPercent: "",
    setupFee: "",
    status: "active",
    isDefault: false,
    sortOrder: "",
  })

  const handleCreateCycle = () => {
    const newCycle = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      ...formData,
      duration: Number.parseInt(formData.duration),
      discountPercent: Number.parseFloat(formData.discountPercent),
      setupFee: Number.parseFloat(formData.setupFee),
      sortOrder: Number.parseInt(formData.sortOrder),
      usageCount: 0,
      revenue: 0,
      conversionRate: 0,
    }
    setBillingCycles([...billingCycles, newCycle])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditCycle = (cycle: any) => {
    setEditingCycle(cycle)
    setFormData({
      name: cycle.name,
      description: cycle.description,
      duration: cycle.duration.toString(),
      unit: cycle.unit,
      discountPercent: cycle.discountPercent.toString(),
      setupFee: cycle.setupFee.toString(),
      status: cycle.status,
      isDefault: cycle.isDefault,
      sortOrder: cycle.sortOrder.toString(),
    })
  }

  const handleUpdateCycle = () => {
    const updatedCycles = billingCycles.map((cycle) =>
      cycle.id === editingCycle.id
        ? {
            ...cycle,
            ...formData,
            duration: Number.parseInt(formData.duration),
            discountPercent: Number.parseFloat(formData.discountPercent),
            setupFee: Number.parseFloat(formData.setupFee),
            sortOrder: Number.parseInt(formData.sortOrder),
          }
        : cycle,
    )
    setBillingCycles(updatedCycles)
    setEditingCycle(null)
    resetForm()
  }

  const handleDeleteCycle = (id: string) => {
    setBillingCycles(billingCycles.filter((cycle) => cycle.id !== id))
  }

  const handleSetDefault = (id: string) => {
    const updatedCycles = billingCycles.map((cycle) => ({
      ...cycle,
      isDefault: cycle.id === id,
    }))
    setBillingCycles(updatedCycles)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      unit: "month",
      discountPercent: "",
      setupFee: "",
      status: "active",
      isDefault: false,
      sortOrder: "",
    })
  }

  const totalRevenue = billingCycles.reduce((sum, cycle) => sum + cycle.revenue, 0)
  const totalUsage = billingCycles.reduce((sum, cycle) => sum + cycle.usageCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing Cycles</h1>
          <p className="text-muted-foreground">Manage subscription billing periods and pricing strategies</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Cycle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Billing Cycle</DialogTitle>
              <DialogDescription>Configure a new billing period with pricing and discount options</DialogDescription>
            </DialogHeader>
            <BillingCycleForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCycle}>Create Cycle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all billing cycles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingCycles.reduce((max, cycle) => (cycle.usageCount > max.usageCount ? cycle : max)).name}
            </div>
            <p className="text-xs text-muted-foreground">Highest usage count</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(billingCycles.reduce((sum, cycle) => sum + cycle.conversionRate, 0) / billingCycles.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Average conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {billingCycles
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((cycle) => (
                <Card key={cycle.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{cycle.name}</CardTitle>
                        {cycle.isDefault && (
                          <Badge variant="default" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <Badge variant={cycle.status === "active" ? "default" : "secondary"}>{cycle.status}</Badge>
                    </div>
                    <CardDescription>{cycle.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Clock className="mr-2 h-3 w-3" />
                          Duration
                        </span>
                        <span className="font-medium">
                          {cycle.duration} {cycle.unit}
                          {cycle.duration > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Percent className="mr-2 h-3 w-3" />
                          Discount
                        </span>
                        <span className="font-medium">
                          {cycle.discountPercent > 0 ? `${cycle.discountPercent}%` : "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <DollarSign className="mr-2 h-3 w-3" />
                          Setup Fee
                        </span>
                        <span className="font-medium">{cycle.setupFee > 0 ? `$${cycle.setupFee}` : "Free"}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Usage Count</p>
                          <p className="font-medium">{cycle.usageCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium">${cycle.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium flex items-center">
                          {cycle.conversionRate > 20 ? (
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                          )}
                          {cycle.conversionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(cycle.conversionRate, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {!cycle.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(cycle.id)}
                          className="flex-1"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEditCycle(cycle)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCycle(cycle.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={cycle.isDefault}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Cycle Performance</CardTitle>
              <CardDescription>Detailed analytics for all billing cycles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Avg Revenue per User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingCycles
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">
                          {cycle.name}
                          {cycle.isDefault && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {cycle.duration} {cycle.unit}
                          {cycle.duration > 1 ? "s" : ""}
                        </TableCell>
                        <TableCell>{cycle.discountPercent > 0 ? `${cycle.discountPercent}%` : "—"}</TableCell>
                        <TableCell>{cycle.usageCount.toLocaleString()}</TableCell>
                        <TableCell>${cycle.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {cycle.conversionRate > 20 ? (
                              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                            )}
                            {cycle.conversionRate}%
                          </div>
                        </TableCell>
                        <TableCell>
                          ${cycle.usageCount > 0 ? (cycle.revenue / cycle.usageCount).toFixed(2) : "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={cycle.status === "active" ? "default" : "secondary"}>{cycle.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Billing Cycle Dialog */}
      <Dialog open={!!editingCycle} onOpenChange={() => setEditingCycle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Billing Cycle</DialogTitle>
            <DialogDescription>Update billing cycle configuration and pricing</DialogDescription>
          </DialogHeader>
          <BillingCycleForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCycle(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCycle}>Update Cycle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BillingCycleForm({ formData, setFormData }: any) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Cycle Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Monthly"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the billing cycle"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {billingUnits.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountPercent">Discount Percentage</Label>
          <Input
            id="discountPercent"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.discountPercent}
            onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="setupFee">Setup Fee ($)</Label>
          <Input
            id="setupFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.setupFee}
            onChange={(e) => setFormData({ ...formData, setupFee: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status === "active"}
            onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
          />
          <Label htmlFor="status">Active Billing Cycle</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
          />
          <Label htmlFor="isDefault">Default Billing Cycle</Label>
        </div>
      </div>
    </div>
  )
}
