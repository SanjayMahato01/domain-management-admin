"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, MessageSquare, CheckCircle2, AlertCircle, Send, X, User, Shield, Loader2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"

type TicketCategory = "DOMAIN" | "BILLING" | "TECHNICAL" | "OTHER"
type TicketStatus = "OPEN" | "RESOLVED"
type SenderType = "USER" | "ADMIN"

interface Message {
  id: string
  sender: SenderType
  content: string
  timestamp: Date
}

interface Ticket {
  id: string
  ticketId: string
  subject: string
  category: TicketCategory
  status: TicketStatus
  date: Date
  userName: string
  userEmail: string
  messages: Message[]
}

export function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | "ALL">("ALL")
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "ALL">("ALL")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [sendingReply, setSendingReply] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const categories: Array<TicketCategory | "ALL"> = ["ALL", "DOMAIN", "BILLING", "TECHNICAL", "OTHER"]
  const statuses: Array<TicketStatus | "ALL"> = ["ALL", "OPEN", "RESOLVED"]

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory)
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus)

      const response = await axios.get(`/api/support/get-all-tickets?${params.toString()}`)
      const ticketsData = response.data.map((ticket: any) => ({
        ...ticket,
        date: new Date(ticket.date),
        messages: ticket.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setTickets(ticketsData)
    } catch (error: any) {
      console.error("Error fetching tickets:", error)
      toast.error(error.response?.data?.error || "Failed to fetch tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [searchQuery, selectedCategory, selectedStatus])

  const getCategoryColor = (category: TicketCategory) => {
    switch (category) {
      case "DOMAIN":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "BILLING":
        return "bg-green-100 text-green-700 border-green-200"
      case "TECHNICAL":
        return "bg-red-100 text-red-700 border-red-200"
      case "OTHER":
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "RESOLVED":
        return "bg-green-100 text-green-700 border-green-200"
    }
  }

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="h-3 w-3" />
      case "RESOLVED":
        return <CheckCircle2 className="h-3 w-3" />
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return

    try {
      setSendingReply(true)
      await axios.post(`/api/support/reply/${selectedTicket.ticketId}`, {
        content: replyMessage
      })

      // Refresh tickets to get updated messages
      await fetchTickets()
      
      // Update selected ticket with new message
      const updatedTicket = tickets.find(t => t.id === selectedTicket.id)
      if (updatedTicket) {
        setSelectedTicket(updatedTicket)
      }

      setReplyMessage("")
      toast.success("Reply sent successfully")
    } catch (error: any) {
      console.error("Error sending reply:", error)
      toast.error(error.response?.data?.error || "Failed to send reply")
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      setUpdatingStatus(true)
      await axios.patch(`/api/support/update-status/${ticketId}`, {
        status: newStatus
      })

      // Refresh tickets to get updated status
      await fetchTickets()
      
      // Update selected ticket status
      if (selectedTicket && selectedTicket.ticketId === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus })
      }

      toast.success(`Ticket ${newStatus.toLowerCase()} successfully`)
    } catch (error: any) {
      console.error("Error updating status:", error)
      toast.error(error.response?.data?.error || "Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and respond to customer support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs sm:text-sm">
            {tickets.length} Tickets
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTickets}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets by ID, subject, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 lg:flex-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TicketCategory | "ALL")}
                  className="w-full lg:w-auto h-10 px-3 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 lg:flex-none">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as TicketStatus | "ALL")}
                  className="w-full lg:w-auto h-10 px-3 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "ALL" ? "All Status" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List and Detail View */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 h-[calc(100vh-200px)]">
            {/* Tickets List - Scrollable */}
            <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No tickets found</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={cn(
                      "p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md border-2",
                      selectedTicket?.id === ticket.id ? "border-blue-500 bg-blue-50" : "border-transparent",
                    )}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500">{ticket.ticketId}</span>
                            <Badge className={cn("text-xs border", getCategoryColor(ticket.category))}>
                              {ticket.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {ticket.subject}
                          </h3>
                        </div>
                        <Badge className={cn("text-xs border flex items-center gap-1", getStatusColor(ticket.status))}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate">{ticket.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{ticket.messages.length}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{ticket.userEmail}</span>
                        </div>
                        <span>
                          {ticket.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Ticket Detail View - Sticky */}
            <div className="lg:sticky lg:top-0 lg:h-full">
              {selectedTicket ? (
                <Card className="p-3 sm:p-4 lg:p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-500">{selectedTicket.ticketId}</span>
                        <Badge className={cn("text-xs border", getCategoryColor(selectedTicket.category))}>
                          {selectedTicket.category}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs border flex items-center gap-1",
                            getStatusColor(selectedTicket.status),
                          )}
                        >
                          {getStatusIcon(selectedTicket.status)}
                          {selectedTicket.status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{selectedTicket.subject}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{selectedTicket.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="break-all">{selectedTicket.userEmail}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="lg:hidden">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages Thread with Fixed Height and Scroll */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-450px)] min-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                      <div className="space-y-3">
                        {selectedTicket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2 sm:gap-3",
                              message.sender === "ADMIN" ? "flex-row-reverse" : "flex-row",
                            )}
                          >
                            <div
                              className={cn(
                                "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                message.sender === "ADMIN"
                                  ? "bg-gradient-to-br from-blue-600 to-purple-600"
                                  : "bg-gray-200",
                              )}
                            >
                              {message.sender === "ADMIN" ? (
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              ) : (
                                <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex-1 min-w-0 rounded-lg p-3 text-sm",
                                message.sender === "ADMIN"
                                  ? "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
                                  : "bg-gray-50 border border-gray-200",
                              )}
                            >
                              <p className="text-gray-900 text-xs sm:text-sm break-words">{message.content}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {message.timestamp.toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="space-y-3 pt-4 border-t mt-4">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="min-h-[80px] text-sm resize-none"
                      disabled={sendingReply}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button 
                        onClick={handleSendReply} 
                        className="flex-1 sm:flex-none text-sm" 
                        size="sm"
                        disabled={sendingReply || !replyMessage.trim()}
                      >
                        {sendingReply ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        )}
                        {sendingReply ? "Sending..." : "Send Reply"}
                      </Button>
                      {selectedTicket.status === "RESOLVED" ? (
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedTicket.ticketId, "OPEN")}
                          className="flex-1 sm:flex-none text-sm"
                          size="sm"
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                          ) : (
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          )}
                          {updatingStatus ? "Reopening..." : "Reopen Ticket"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedTicket.ticketId, "RESOLVED")}
                          className="flex-1 sm:flex-none text-sm"
                          size="sm"
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          )}
                          {updatingStatus ? "Resolving..." : "Mark as Resolved"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 sm:p-12 h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">Select a ticket to view details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}