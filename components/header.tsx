"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User, Settings, Menu } from "lucide-react"

interface AdminHeaderProps {
  activeSection: string
  setSidebarOpen?: (open: boolean) => void
}

const sectionTitles = {
  dashboard: "Dashboard Overview",
  users: "User Management",
  domains: "Domain Management",
  hosting: "Hosting Services",
  email: "Email Management",
  analytics: "Analytics & Reports",
  settings: "Settings",
}

export function Header({ activeSection, setSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen?.(true)}
          className="lg:hidden text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            {sectionTitles[activeSection as keyof typeof sectionTitles] || "Dashboard"}
          </h1>
          <p className="text-sm text-gray-600 hidden sm:block">Manage your hosting platform</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users, domains, services..."
            className="pl-10 w-64 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Mobile search button */}
        <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-gray-900 h-8 w-8 p-0">
          <Search className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-gray-100 rounded-full h-8 w-8 lg:h-10 lg:w-10 p-0"
          >
            <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 lg:h-3 lg:w-3 bg-red-500 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 rounded-full h-8 w-8 lg:h-10 lg:w-10 p-0 hidden sm:flex"
          >
            <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>

          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center ml-2 shadow-sm">
            <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
