import { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Bell, Menu } from "lucide-react"

interface MainLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function MainLayout({ children, title, description, actions, breadcrumbs }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Main Content */}
        <main className="flex-1 p-6">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground text-lg">{description}</p>
              )}
              {actions && (
                <div className="mt-4 flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}