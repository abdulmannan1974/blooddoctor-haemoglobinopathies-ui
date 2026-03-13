"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenText,
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
  { href: "/variants", label: "Variant Explorer", icon: Search },
  { href: "/cases", label: "Case Atlas", icon: TableProperties },
  { href: "/compare", label: "Compare", icon: Scale },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <BookOpenText className="size-5" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-tight tracking-tight">
              Blood🩸Doctor Haemoglobinopathy Intelligence Hub
            </p>
            <p className="text-xs text-sidebar-foreground/70">
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
      <SidebarFooter className="border-t border-sidebar-border/70 p-4 text-xs leading-5 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
        Dr Abdul Mannan FRCPath FCPS - Blood🩸Doctor - blooddoctor.co@gmail.com
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
