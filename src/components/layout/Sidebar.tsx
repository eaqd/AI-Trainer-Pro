"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  BarChart3,
  Trophy,
  Calendar,
  Settings,
  GraduationCap,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/exam", label: "Exam Mode", icon: GraduationCap },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/daily", label: "Daily Challenge", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-lg font-bold">AI Trainer Pro</h1>
          <p className="text-xs text-muted-foreground">Training Platform</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Prepare for AI Training Platforms
        </p>
      </div>
    </aside>
  )
}
