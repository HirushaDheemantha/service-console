"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <DataProvider>
        <Dashboard />
      </DataProvider>
    )
  }

  return <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
