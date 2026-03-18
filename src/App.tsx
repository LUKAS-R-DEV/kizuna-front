import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/auth/Login"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import Dashboard from "@/pages/dashboard/Dashboard"
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/production-orders" element={<ProductionOrders />} />
        <Route path="/production-queue" element={<ProductionQueue />} />
        <Route path="/production-panel" element={<ProductionPanel />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/inventory/movements" element={<StockMovements />} />
        <Route path="/quality" element={<QualityInspection />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit" element={<AuditLogsPage />} />

      </Routes>
    </BrowserRouter>
  )
}