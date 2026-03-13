"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenText,
  Calculator,
  LayoutDashboard,
  Scale,
  Search,
  TableProperties,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const primaryNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/risk-calculator", label: "Risk Calculator", icon: Calculator },
  { href: "/variants", label: "Variant Explorer", icon: Search },
  { href: "/cases", label: "Case Atlas", icon: TableProperties },
  { href: "/compare", label: "Compare", icon: Scale },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <div className="flex items-start gap-3 px-2 py-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[1.5rem] bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <BookOpenText className="size-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-tight tracking-tight">
              Blood🩸Doctor
            </p>
            <p className="text-sm leading-snug text-sidebar-foreground/85">
              Haemoglobinopathy Intelligence Hub
            </p>
            <p className="text-xs leading-snug text-sidebar-foreground/70">
              Dr Abdul Mannan FRCPath FCPS
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/70 p-4 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
        <div className="space-y-1.5 leading-snug">
          <p>Dr Abdul Mannan FRCPath FCPS</p>
          <p>Blood🩸Doctor</p>
          <p>blooddoctor.co@gmail.com</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
