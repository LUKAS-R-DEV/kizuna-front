import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ToastProvider } from "@/contexts/ToastContext"
import { HealthProvider } from "@/contexts/HealthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import RoleProtectedRoute from "@/components/RoleProtectedRoute"
import Dashboard from "@/pages/dashboard/Dashboard"
import Home from "@/pages/home/Home"
import Users from "@/pages/users/Users"
import ProductionOrders from "@/pages/orders/ProductionOrder"
import ProductionQueue from "@/pages/orders/ProductionQueue"
import ProductionPanel from "@/pages/production/ProductionPanel"
import InventoryManagement from "@/pages/inventory/InventoryManagement"
import StockMovements from "@/pages/inventory/StockMovements"
import QualityInspection from "@/pages/qualityInspection/QualityInspection"
import NotificationsPage from "@/pages/notifications/Notifications"
import Reports from "@/pages/reports/Reports"
import AuditLogsPage from "@/pages/audit/AuditLogs"
import Recipes from "@/pages/recipes/Recipes"
import AIPage from "@/pages/ai/AI"
import SystemHealth from "@/pages/admin/SystemHealth"
import IntegrationApiKeys from "@/pages/admin/IntegrationApiKeys"
import SplashScreen from "@/pages/splash/SplashScreen"
import AccessDenied from "@/pages/error/AccessDenied"
import { isAuthenticated } from "@/lib/auth"

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen only if user is logged in and hasn't seen it this session
    return isAuthenticated() && !sessionStorage.getItem("kizuna_splash_shown");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("kizuna_splash_shown", "true");
    setShowSplash(false);
  };

  return (
    <ToastProvider>
      <HealthProvider>
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
        </AnimatePresence>

        {!showSplash && (
          <BrowserRouter>
            <Routes>
              {/* Root redirects to home; Auth handles unauthenticated users */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<RoleProtectedRoute roles={["EXECUTIVE"]}><Dashboard /></RoleProtectedRoute>} />
          <Route path="/users" element={<RoleProtectedRoute roles={["MANAGE-USERS", "manage-users"]}><Users /></RoleProtectedRoute>} />
          <Route path="/production-orders" element={<RoleProtectedRoute roles={["PLANNER", "OPERATOR"]}><ProductionOrders /></RoleProtectedRoute>} />
          <Route path="/production-queue" element={<RoleProtectedRoute roles={["PLANNER"]}><ProductionQueue /></RoleProtectedRoute>} />
          <Route path="/production-panel" element={<RoleProtectedRoute roles={["OPERATOR"]}><ProductionPanel /></RoleProtectedRoute>} />
          <Route path="/recipes" element={<RoleProtectedRoute roles={["PLANNER"]}><Recipes /></RoleProtectedRoute>} />
          <Route path="/inventory" element={<RoleProtectedRoute roles={["INVENTORY_MANAGER"]}><InventoryManagement /></RoleProtectedRoute>} />
          <Route path="/inventory/movements" element={<RoleProtectedRoute roles={["INVENTORY_MANAGER"]}><StockMovements /></RoleProtectedRoute>} />
          <Route path="/quality" element={<RoleProtectedRoute roles={["INSPECTOR"]}><QualityInspection /></RoleProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<RoleProtectedRoute roles={["EXECUTIVE"]}><Reports /></RoleProtectedRoute>} />
          <Route path="/audit" element={<RoleProtectedRoute roles={["AUDITOR"]}><AuditLogsPage /></RoleProtectedRoute>} />
          <Route path="/ai" element={<RoleProtectedRoute roles={["EXECUTIVE"]}><AIPage /></RoleProtectedRoute>} />
          <Route path="/admin/health" element={<RoleProtectedRoute roles={["ADMIN"]}><SystemHealth /></RoleProtectedRoute>} />
          <Route path="/admin/integration-keys" element={<RoleProtectedRoute roles={["ADMIN"]}><IntegrationApiKeys /></RoleProtectedRoute>} />
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </BrowserRouter>
        )}
      </HealthProvider>
    </ToastProvider>
  )
}