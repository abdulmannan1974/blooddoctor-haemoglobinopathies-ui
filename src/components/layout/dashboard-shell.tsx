import type { ReactNode } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { GlobalSearchEntry } from "@/components/search/global-search-entry"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-sm">
        <div className="flex min-h-svh flex-col">
          <header className="border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold leading-tight tracking-tight">
                    Blood🩸Doctor
                  </p>
                  <p className="text-xs font-medium leading-snug text-foreground/80">
                    Haemoglobinopathy Intelligence Hub
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr Abdul Mannan FRCPath FCPS
                  </p>
                </div>
              </div>
              <GlobalSearchEntry />
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
          <footer className="border-t border-border/70 bg-background/80 px-4 py-3 text-center text-xs text-muted-foreground md:px-6">
            <div className="space-y-1 leading-snug">
              <p>Dr Abdul Mannan FRCPath FCPS</p>
              <p>Blood🩸Doctor</p>
              <p>blooddoctor.co@gmail.com</p>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
