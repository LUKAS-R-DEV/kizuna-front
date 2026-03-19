import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Plus,
  Box,
} from "lucide-react";

import { INVENTORY_MOCK } from "@/mocks/inventory";

export default function InventoryManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER INDUSTRIAL COM SUBMENU */}
        <div className="flex flex-col gap-6 border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
                Material Logistics
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  Inventory
                </h1>
                <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                  Management
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-[10px] font-black text-white uppercase tracking-widest h-11 px-6 gap-2 shadow-lg shadow-red-900/20">
                    <Plus size={16} /> Add New Part
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white border-t-[6px] border-red-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 flex items-center gap-2">
                      <Box className="text-red-600" size={24} />
                      Register <span className="text-red-600">New Part</span>
                    </DialogTitle>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Master Data Input // Kizuna Industrial</p>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Part Number" className="font-bold italic uppercase" />
                      <Input placeholder="Part Name" className="font-bold italic" />
                    </div>
                    <Select>
                      <SelectTrigger className="font-bold italic text-[11px] uppercase">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw" className="font-bold uppercase text-[10px]">Raw Material</SelectItem>
                        <SelectItem value="component" className="font-bold uppercase text-[10px]">Component</SelectItem>
                        <SelectItem value="consumable" className="font-bold uppercase text-[10px]">Consumable</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Supplier Name" className="font-bold italic" />
                    <div className="grid grid-cols-3 gap-3">
                      <Input type="number" placeholder="Initial Qty" className="font-bold" />
                      <Input type="number" placeholder="Min Stock" className="font-bold" />
                      <Input placeholder="Location" className="font-bold italic uppercase" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-[10px] font-black uppercase">Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest" onClick={() => setIsAddModalOpen(false)}>Save to Catalog</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => navigate("/inventory")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all
              ${location.pathname === "/inventory" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-700"}`}
            >
              <Package size={14} /> Stock Levels
            </button>
            <button
              onClick={() => navigate("/inventory/movements")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all
              ${location.pathname === "/inventory/movements" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-700"}`}
            >
              <ArrowRightLeft size={14} /> Stock Movements
            </button>
          </div>
        </div>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Total Materials", val: "06", icon: <Package />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Low Stock Items", val: "03", icon: <AlertTriangle />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Healthy Stock", val: "03", icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((card, i) => (
            <Card key={i} className="p-6 flex-row items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>{card.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black text-slate-900">{card.val}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* TABELA PADRÃO KIZUNA */}
        <Card className="p-0 border-slate-200/60 overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
              <Input placeholder="Search materials..." className="pl-10 text-[11px] font-bold italic h-9 border-slate-200" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material ID</TableHead>
                <TableHead>Material Specification</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Stock Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Location</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {INVENTORY_MOCK.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-black text-slate-800 italic text-[10px]">{item.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{item.supplier}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50 text-slate-700">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-sm tracking-tighter text-slate-700">{item.quantity}</span>
                      <span className="text-[8px] font-bold text-slate-700 uppercase">Min: {item.minStock}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-[8px] font-black uppercase px-2 py-0.5 border shadow-none ${
                        item.status === "Critical"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold italic text-[10px] text-slate-700 uppercase">{item.location}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}