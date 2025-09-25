"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Shield, ShieldCheck, Mail, Calendar } from "lucide-react"
import { UserDirectory } from "./users/users-directory"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  phone: string
  status: string
  plan: string
  domains: number
  totalVMs: number
  totalHosting: number
  joined: string
}

export function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await axios.get('/api/users/fetch-users-data')
      setUsers(response.data)
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (userData: { name: string; email: string; phone: string; plan: string }) => {
    try {
      const response = await axios.post('/api/admin/users', userData)
      // Add new user to the state immediately
      setUsers(prevUsers => [response.data, ...prevUsers])
      setIsAddUserOpen(false)
      // Optional: Show success message
    } catch (err: any) {
      console.error('Error adding user:', err)
      alert(err.response?.data?.error || 'Failed to add user')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage all verified user accounts</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new verified user account.</DialogDescription>
            </DialogHeader>
            <AddUserForm onSubmit={handleAddUser} onCancel={() => setIsAddUserOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Verified users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((users.filter(user => user.status === 'active').length / users.length) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((total, user) => total + user.domains, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((total, user) => total + user.totalVMs, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Hosting instances</p>
          </CardContent>
        </Card>
      </div>

      {/* User Directory Component */}
      <UserDirectory users={users} onUsersUpdate={setUsers} />
    </div>
  )
}

// Add User Form Component
interface AddUserFormProps {
  onSubmit: (userData: { name: string; email: string; phone: string; plan: string }) => void
  onCancel: () => void
}

function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Basic'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input 
            id="name" 
            placeholder="Full name" 
            className="col-span-3" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="user@example.com" 
            className="col-span-3" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone
          </Label>
          <Input 
            id="phone" 
            placeholder="+1 (555) 123-4567" 
            className="col-span-3" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="plan" className="text-right">
            Plan
          </Label>
          <Select value={formData.plan} onValueChange={(value) => setFormData({...formData, plan: value})}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create User</Button>
      </DialogFooter>
    </form>
  )
}