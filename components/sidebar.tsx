"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard,Users, Globe, Server, Mail, BarChart3, Settings, Menu, X, ChevronLeft, MonitorSpeaker, Database, PackageSearch, BookA, WebhookIcon, DollarSign } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "Users", href: "users", icon: Users },
  { name: "Domains", href: "domains", icon: Globe },
  { name: "Hosting", href: "hosting", icon: Server },
  { name: "VMS", href: "vms", icon: MonitorSpeaker },
  { name: "Servers", href: "serverManagement", icon: Database },
  { name: "Tld", href: "tldManagement", icon: WebhookIcon },
  { name: "Hosting packages", href: "hostingPackages", icon: PackageSearch },
  { name: "Registrars", href: "registrars", icon: BookA },
  { name: "Email", href: "email", icon: Mail },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Billings", href: "billings", icon: DollarSign },
  { name: "Settings", href: "settings", icon: Settings },
]

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  setSidebarOpen?: (open: boolean) => void
}

export function Sidebar({ activeSection, setActiveSection, setSidebarOpen }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleNavClick = (section: string) => {
    setActiveSection(section)
    setSidebarOpen?.(false) 
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-full shadow-lg",
        collapsed ? "w-16 sm:w-20" : "w-64 sm:w-72 lg:w-80",
      )}
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 border-b border-gray-200 bg-white">
        {!collapsed && (
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Server className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">HostPanel</h1>
          </div>
        )}

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen?.(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-gray-500 hover:text-gray-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            {collapsed ? <Menu className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              "flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 group relative",
              activeSection === item.href
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-200",
                activeSection === item.href ? "scale-110" : "group-hover:scale-105",
              )}
            />
            {!collapsed && <span className="ml-2 sm:ml-4 font-medium truncate">{item.name}</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-2 sm:p-4 bg-gray-50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-white">AD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@hostpanel.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
