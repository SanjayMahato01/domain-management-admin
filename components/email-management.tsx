"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Send,
  Archive,
  Trash2,
  Edit,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  Forward,
} from "lucide-react"

// Mock email data
const emailAccounts = [
  {
    id: 1,
    email: "admin@example.com",
    domain: "example.com",
    owner: "John Doe",
    status: "active",
    storage: "2.4 GB",
    quota: "5 GB",
    lastLogin: "2024-03-21 09:15",
    forwarders: 2,
    autoresponder: true,
  },
  {
    id: 2,
    email: "support@mystore.net",
    domain: "mystore.net",
    owner: "Sarah Wilson",
    status: "active",
    storage: "1.8 GB",
    quota: "10 GB",
    lastLogin: "2024-03-21 08:30",
    forwarders: 0,
    autoresponder: false,
  },
  {
    id: 3,
    email: "info@techblog.org",
    domain: "techblog.org",
    owner: "Mike Johnson",
    status: "suspended",
    storage: "0.5 GB",
    quota: "2 GB",
    lastLogin: "2024-03-10 14:22",
    forwarders: 1,
    autoresponder: false,
  },
  {
    id: 4,
    email: "contact@startup.io",
    domain: "startup.io",
    owner: "Emily Chen",
    status: "active",
    storage: "4.2 GB",
    quota: "25 GB",
    lastLogin: "2024-03-21 10:45",
    forwarders: 3,
    autoresponder: true,
  },
]

const mailQueues = [
  {
    id: 1,
    from: "system@hostpanel.com",
    to: "user@example.com",
    subject: "Welcome to your hosting account",
    status: "delivered",
    attempts: 1,
    timestamp: "2024-03-21 10:30",
  },
  {
    id: 2,
    from: "billing@hostpanel.com",
    to: "admin@mystore.net",
    subject: "Invoice #12345 - Payment Due",
    status: "pending",
    attempts: 2,
    timestamp: "2024-03-21 10:15",
  },
  {
    id: 3,
    from: "support@hostpanel.com",
    to: "contact@startup.io",
    subject: "Ticket #789 - Server Maintenance Notice",
    status: "failed",
    attempts: 3,
    timestamp: "2024-03-21 09:45",
  },
]

export function EmailManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateEmailOpen, setIsCreateEmailOpen] = useState(false)
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false)

  const filteredEmails = emailAccounts.filter((email) => {
    const matchesSearch =
      email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || email.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getQueueStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStoragePercentage = (used: string, quota: string) => {
    const usedGB = Number.parseFloat(used.replace(" GB", ""))
    const quotaGB = Number.parseFloat(quota.replace(" GB", ""))
    return Math.round((usedGB / quotaGB) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Email Management</h2>
          <p className="text-muted-foreground">Manage email accounts, forwarders, and mail queues</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Send Email</DialogTitle>
                <DialogDescription>Send an email to users or customers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="from" className="text-right">
                    From
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">admin@hostpanel.com</SelectItem>
                      <SelectItem value="support">support@hostpanel.com</SelectItem>
                      <SelectItem value="billing">billing@hostpanel.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="to" className="text-right">
                    To
                  </Label>
                  <Input id="to" placeholder="recipient@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Input id="subject" placeholder="Email subject" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="message" className="text-right pt-2">
                    Message
                  </Label>
                  <Textarea id="message" placeholder="Type your message here..." className="col-span-3 min-h-[120px]" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateEmailOpen} onOpenChange={setIsCreateEmailOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Email Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Email Account</DialogTitle>
                <DialogDescription>Create a new email account for a domain</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input id="username" placeholder="username" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="example.com">example.com</SelectItem>
                      <SelectItem value="mystore.net">mystore.net</SelectItem>
                      <SelectItem value="startup.io">startup.io</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input id="password" type="password" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quota" className="text-right">
                    Quota (GB)
                  </Label>
                  <Input id="quota" placeholder="5" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Email Accounts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,234</div>
            <p className="text-xs text-muted-foreground">92.2% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Management Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
          <TabsTrigger value="queue">Mail Queue</TabsTrigger>
          <TabsTrigger value="forwarders">Forwarders</TabsTrigger>
          <TabsTrigger value="settings">Email Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Accounts</CardTitle>
              <CardDescription>Manage all email accounts across domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search email accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Storage Usage</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{email.email}</div>
                            <div className="text-sm text-muted-foreground">{email.domain}</div>
                          </div>
                        </TableCell>
                        <TableCell>{email.owner}</TableCell>
                        <TableCell>{getStatusBadge(email.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {email.storage} / {email.quota}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${getStoragePercentage(email.storage, email.quota)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{email.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {email.forwarders > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {email.forwarders} Forwarders
                              </Badge>
                            )}
                            {email.autoresponder && (
                              <Badge variant="outline" className="text-xs">
                                Auto-reply
                              </Badge>
                            )}
                          </div>
                        </TableCell>
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
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Change Password
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="mr-2 h-4 w-4" />
                                Manage Forwarders
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Auto-responder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
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

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mail Queue</CardTitle>
              <CardDescription>Monitor outgoing email delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mailQueues.map((mail) => (
                      <TableRow key={mail.id}>
                        <TableCell className="font-medium">{mail.from}</TableCell>
                        <TableCell>{mail.to}</TableCell>
                        <TableCell className="max-w-xs truncate">{mail.subject}</TableCell>
                        <TableCell>{getQueueStatusBadge(mail.status)}</TableCell>
                        <TableCell>{mail.attempts}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{mail.timestamp}</TableCell>
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
                                <Send className="mr-2 h-4 w-4" />
                                Retry Send
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove from Queue
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

        <TabsContent value="forwarders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Forwarders</CardTitle>
              <CardDescription>Manage email forwarding rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Forward className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Forwarders</h3>
                <p className="text-muted-foreground mb-4">Set up email forwarding rules and aliases</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Forwarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Server Settings</CardTitle>
              <CardDescription>Configure global email server settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Server Configuration</h3>
                <p className="text-muted-foreground mb-4">Configure SMTP, IMAP, spam filters, and security settings</p>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
