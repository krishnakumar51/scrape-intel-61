import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Sparkles,
  BarChart3,
  Bot,
  History,
  BookOpen,
  HelpCircle,
  Settings,
  User,
  Plus,
  Home,
  MessageSquare,
  LayoutDashboard
} from "lucide-react"

const mainItems = [
  { title: "New Project", url: "/create-agent", icon: Plus },
  { title: "Projects", url: "/projects", icon: Bot },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Metrics", url: "/metrics", icon: BarChart3 },
]

const supportItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  // Filter sidebar items based on authentication
  const visibleMainItems = isAuthenticated 
    ? mainItems 
    : mainItems.filter(item => item.url === '/create-agent')

  const visibleSupportItems = isAuthenticated 
    ? supportItems 
    : supportItems.filter(item => item.url === '/settings')

  return (
    <Sidebar
      className={`border-r border-sidebar-border bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/95 transition-all duration-300 ${
        collapsed ? "w-24" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2">
            <SidebarTrigger 
              className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity p-0"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </SidebarTrigger>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-sidebar-foreground truncate hover:text-primary transition-colors cursor-pointer">ScrapeMaster</h2>
              </div>
            )}
          </NavLink>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {visibleMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full p-0">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        collapsed 
                          ? `flex items-center justify-center w-full h-14 rounded-lg border-2 transition-all ${
                              isActive 
                                ? "bg-primary border-primary text-primary-foreground shadow-md" 
                                : "bg-sidebar-accent/30 border-sidebar-border text-sidebar-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                            }`
                           : `flex items-center gap-4 w-full rounded-lg py-3 px-4 transition-all hover:bg-sidebar-accent text-left ${
                             isActive 
                               ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                               : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                           }`
                      }
                      end
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`shrink-0 ${collapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {visibleSupportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full p-0">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          collapsed 
                            ? `flex items-center justify-center w-full h-14 rounded-lg border-2 transition-all ${
                                isActive 
                                  ? "bg-primary border-primary text-primary-foreground shadow-md" 
                                  : "bg-sidebar-accent/30 border-sidebar-border text-sidebar-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                              }`
                             : `flex items-center gap-4 w-full rounded-lg py-3 px-4 transition-all hover:bg-sidebar-accent text-left ${
                               isActive 
                                 ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                 : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                             }`
                        }
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`shrink-0 ${collapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                        {!collapsed && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-accent-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-sidebar-foreground truncate">Krishna</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">Pro Plan</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground truncate">Guest User</p>
                <p className="text-xs text-muted-foreground/60 truncate">Sign in to continue</p>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}