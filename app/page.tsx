"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { UserManagement } from "@/components/user-management"
import { DomainManagement } from "@/components/domain-management"
import { HostingServices } from "@/components/hosting-services"
import { EmailManagement } from "@/components/email-management"
import { AnalyticsReports } from "@/components/analytics"
import { VMSManagement } from "@/components/vms-management"
import { useState } from "react"
import {RegistrarManagement} from "@/components/registrars-management"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />
      case "domains":
        return <DomainManagement />
      case "hosting":
        return <HostingServices />
      case "vns":
        return <VMSManagement />
      case "registrars":
        return <RegistrarManagement />
      case "email":
        return <EmailManagement />
      case "analytics":
        return <AnalyticsReports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:inset-0
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-hidden">
        <Header activeSection={activeSection} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}


