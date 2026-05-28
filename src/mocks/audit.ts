export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: 'Authentication' | 'Quality Inspection' | 'Production' | 'User Management' | 'Production Orders' | 'Inventory';
  details: string;
  ip: string;
  status: 'Success' | 'Warning' | 'Failure';
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "LOG-101", timestamp: "2026-03-11 14:32:15", user: "John Doe", action: "User Login", module: "Authentication", details: "Successful login from web interface", ip: "192.168.1.100", status: "Success" },
  { id: "LOG-102", timestamp: "2026-03-11 14:25:43", user: "Sarah Williams", action: "Batch Approved", module: "Quality Inspection", details: "Batch B-2024-045 approved - 75 units", ip: "192.168.1.105", status: "Success" },
  { id: "LOG-103", timestamp: "2026-03-11 14:18:22", user: "Mike Johnson", action: "Production Started", module: "Production", details: "Started production for order PO-1045", ip: "192.168.1.108", status: "Success" },
  { id: "LOG-104", timestamp: "2026-03-11 13:55:10", user: "John Doe", action: "User Created", module: "User Management", details: "New user created: Tom Brown (Operator)", ip: "192.168.1.100", status: "Success" },
  { id: "LOG-105", timestamp: "2026-03-11 13:42:33", user: "Jane Smith", action: "Production Order Created", module: "Production Orders", details: "Created order PO-1048 for Motor Assembly - 75 units", ip: "192.168.1.102", status: "Success" }
];