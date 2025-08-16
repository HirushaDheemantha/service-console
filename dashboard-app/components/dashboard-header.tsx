"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LogOut, User } from "lucide-react";

export function DashboardHeader() {
  const { logout } = useAuth();
  // const router = useRouter()

  const handleLogout = () => {
    logout();
    // Use window.location for immediate redirect
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-900">ENORED CRM</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
