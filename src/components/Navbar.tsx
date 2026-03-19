import { User } from "lucide-react"

export default function Navbar() {
  return (
    <header className="flex justify-end items-center bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-700 dark:text-slate-800">Admin</span>
        <User size={24} />
      </div>
    </header>
  )
}