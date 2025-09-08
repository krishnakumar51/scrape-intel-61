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
      className="border-r border-sidebar-border bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/95 transition-all duration-300"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger 
            className={`bg-gradient-primary rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-all p-0 ${
              collapsed ? "w-10 h-10" : "w-10 h-10"
            }`}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Sparkles className={`text-white transition-all ${
              collapsed ? "w-5 h-5" : "w-5 h-5"
            }`} />
          </SidebarTrigger>
          {!collapsed && (
            <NavLink to="/" className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-sidebar-foreground truncate hover:text-primary transition-colors cursor-pointer tracking-wide">ScrapeMaster</h2>
            </NavLink>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`${collapsed ? 'space-y-4' : 'space-y-2'}`}>
              {visibleMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full p-0">
                    {/* <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        collapsed 
                            ? `flex items-center justify-center w-full h-25 rounded-xl border-2 transition-all shadow-sm ${
                                isActive 
                                  ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                                  : "bg-sidebar-accent/40 border-sidebar-border text-sidebar-foreground hover:bg-primary/15 hover:border-primary/40 hover:text-primary hover:shadow-md"
                              }`
                             : `flex items-center gap-3 w-full rounded-xl py-4 px-5 transition-colors hover:bg-sidebar-accent justify-start text-left shadow-sm ${
                               isActive 
                                 ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                 : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                             }`
                      }
                      end
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`shrink-0 transition-all ${collapsed ? 'h-6 w-6' : 'h-7 w-7'}`} />
                      {!collapsed && (
                        <span className="text-lg font-semibold tracking-wide">{item.title}</span>
                      )}
                    </NavLink> */}
                    <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          collapsed
                            ? `flex items-center justify-center w-16 h-16 rounded-xl border-2 transition-all shadow-sm ${
                                isActive 
                                  ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                                  : "bg-sidebar-accent/40 border-sidebar-border text-sidebar-foreground hover:bg-primary/15 hover:border-primary/40 hover:text-primary hover:shadow-md"
                              }`
                            : `flex items-center gap-3 w-full rounded-xl py-5 px-5 transition-colors hover:bg-sidebar-accent justify-start text-left shadow-sm ${
                                isActive 
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                              }`
                        }
                        end
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`shrink-0 transition-all ${collapsed ? 'h-6 w-6' : 'h-6 w-6'}`} />
                        {!collapsed && (
                          <span className="text-base font-medium tracking-wide">{item.title}</span>
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
              <SidebarMenu className={`${collapsed ? 'space-y-4' : 'space-y-2'}`}>
                {visibleSupportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full p-0">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          collapsed 
                            ? `flex items-center justify-center w-full h-20 rounded-xl border-2 transition-all shadow-sm ${
                                isActive 
                                  ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                                  : "bg-sidebar-accent/40 border-sidebar-border text-sidebar-foreground hover:bg-primary/15 hover:border-primary/40 hover:text-primary hover:shadow-md"
                              }`
                             : `flex items-center gap-3 w-full rounded-xl py-4 px-5 transition-colors hover:bg-sidebar-accent justify-start text-left shadow-sm ${
                               isActive 
                                 ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                 : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                             }`
                        }
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`shrink-0 transition-all ${collapsed ? 'h-6 w-6' : 'h-6 w-6'}`} />
                        {!collapsed && (
                          <span className="text-base font-medium tracking-wide">{item.title}</span>
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

      <SidebarFooter className={`border-t border-sidebar-border ${collapsed ? 'p-4 flex justify-center' : 'p-2'}`}>
        {isAuthenticated ? (
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
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
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
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