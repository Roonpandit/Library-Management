import React, { ReactNode, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useAuth } from "../contexts/AuthContext"

interface LayoutProps {
  children?: ReactNode;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, onLogout }) => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // If there are children, render them directly
  // Otherwise, use the Outlet from react-router
  const content = children || <Outlet />

  return (
    <div className="flex h-screen bg-gray-50">
      {user && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {content}
        </main>
      </div>
    </div>
  )
}

export default Layout
