import { MainLayout } from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useProgressSync } from "@/hooks/useProgressSync"
import { useUserData } from "@/hooks/useUserData"
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  BarChart3,
  Activity,
  Plus,
  Database
} from "lucide-react"

export default function Dashboard() {
  const { progressData } = useProgressSync()
  const { recentProjects, recentActivity, userStats } = useUserData()
  
  // Use dynamic data for metrics
  const metrics = [
    {
      title: "Active Agents",
      value: recentProjects.filter(p => p.status === 'running').length.toString(),
      change: "+2 this week",
      icon: Bot,
      color: "text-primary"
    },
    {
      title: "Success Rate",
      value: `${userStats.averageAccuracy.toFixed(1)}%`,
      change: "+0.5% vs last month",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Total Spent",
      value: `$${userStats.totalSpent.toFixed(2)}`,
      change: "This month",
      icon: DollarSign,
      color: "text-accent"
    },
    {
      title: "Time Saved",
      value: userStats.totalTimeSaved,
      change: "vs manual work",
      icon: Clock,
      color: "text-info"
    }
  ]
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-success/20 text-success border-success/30">Running</Badge>
      case "paused":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Paused</Badge>
      case "completed":
        return <Badge className="bg-info/20 text-info border-info/30">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "paused":
        return <Pause className="w-4 h-4 text-warning" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-info" />
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <MainLayout
      title="Dashboard"
      description="Monitor your AI scraping agents and track performance metrics"
      actions={
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button variant="default" size="sm" onClick={() => window.location.href = '/'}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="bg-gradient-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                      <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${metric.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Active Agents */}
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Active Agents</span>
                </CardTitle>
                <CardDescription>Monitor your currently running scraping agents</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.length > 0 ? recentProjects.slice(0, 3).map((agent, index) => (
              <div key={agent.id || index} className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(agent.status)}
                    <div>
                      <h3 className="font-medium text-foreground">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.totalRecords.toLocaleString()} records processed
                      </p>
                      {agent.targetUrl && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{agent.targetUrl}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(agent.status)}
                    {agent.status === "running" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = '/scraping-status'}
                        className="text-xs"
                      >
                        View Progress
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="text-foreground font-medium">{agent.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.accuracy} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-sm font-medium text-foreground">{agent.accuracy.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="text-sm font-medium text-foreground">${agent.totalCost?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium text-foreground capitalize">{agent.status}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No agents created yet</p>
                <p className="text-sm text-muted-foreground">Create your first AI scraping agent to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your scraping agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                  <div className={`w-4 h-4 rounded-full ${
                    activity.type === 'success' ? 'bg-success' : 
                    activity.type === 'warning' ? 'bg-warning' : 
                    'bg-info'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4 text-white" /> :
                     activity.type === 'warning' ? <Pause className="w-4 h-4 text-white" /> :
                     <Database className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.project} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Insights</CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Excellent Performance</span>
                </div>
                <p className="text-sm text-foreground">
                  Your agents are performing above average with 98.3% success rate this month.
                </p>
              </div>
              <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-info">Cost Optimization</span>
                </div>
                <p className="text-sm text-foreground">
                  Consider batching smaller jobs to reduce per-record costs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}