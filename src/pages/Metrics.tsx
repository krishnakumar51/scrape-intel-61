import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { useUserData } from "@/hooks/useUserData"
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  Shield,
  Database,
  Search,
  Download,
  Calendar as CalendarIcon
} from "lucide-react"

const qualityMetrics = [
  {
    name: "Data Accuracy",
    description: "Match rate of extracted vs requested data",
    value: 98.5,
    trend: "+2.1%",
    status: "excellent",
    icon: Target
  },
  {
    name: "Data Completeness",
    description: "Percentage of required fields filled",
    value: 94.2,
    trend: "+1.8%",
    status: "good",
    icon: CheckCircle
  },
  {
    name: "Data Validity",
    description: "Format compliance and rule adherence",
    value: 96.7,
    trend: "+0.5%",
    status: "excellent",
    icon: Shield
  },
  {
    name: "Data Timeliness",
    description: "Extraction speed and freshness",
    value: 91.3,
    trend: "+3.2%",
    status: "good",
    icon: Clock
  },
  {
    name: "Data Uniqueness",
    description: "Duplicate detection and removal",
    value: 99.1,
    trend: "+0.3%",
    status: "excellent",
    icon: Database
  },
  {
    name: "Data Integrity",
    description: "Consistency and reliability across systems",
    value: 97.8,
    trend: "+1.1%",
    status: "excellent",
    icon: Activity
  },
  {
    name: "Data Consistency",
    description: "Standardization of data representation",
    value: 93.6,
    trend: "+2.7%",
    status: "good",
    icon: TrendingUp
  },
  {
    name: "Data Accessibility",
    description: "Storage organization and security",
    value: 95.4,
    trend: "+1.5%",
    status: "good",
    icon: Search
  },
  {
    name: "Data Traceability",
    description: "Source tracking and transformation history",
    value: 89.7,
    trend: "+4.1%",
    status: "improving",
    icon: Database
  }
]

export default function Metrics() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const { recentProjects, userStats } = useUserData()
  
  // Use recent completed projects for job performance
  const recentJobs = recentProjects.filter(p => p.status === 'completed').slice(0, 5)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success"
      case "good":
        return "text-info"
      case "improving":
        return "text-warning"
      case "needs-attention":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-success/20 text-success border-success/30">Excellent</Badge>
      case "good":
        return <Badge className="bg-info/20 text-info border-info/30">Good</Badge>
      case "improving":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Improving</Badge>
      case "needs-attention":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Needs Attention</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <MainLayout
      title="Performance Metrics"
      description="Comprehensive data quality dashboard and analytics"
      actions={
        <div className="flex space-x-3">
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range: any) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                    setShowCalendar(false)
                  }
                }}
                numberOfMonths={1}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-8">
        {/* Overall Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                  <p className="text-3xl font-bold text-success">{userStats.averageAccuracy.toFixed(1)}</p>
                  <p className="text-xs text-success mt-1">+2.1% this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                  <p className="text-3xl font-bold text-foreground">{(userStats.totalRecords / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Processing</p>
                  <p className="text-3xl font-bold text-foreground">2.1m</p>
                  <p className="text-xs text-info mt-1">-15% faster</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-foreground">${userStats.totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-accent mt-1">All time</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Quality Metrics Grid */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Data Quality Metrics</span>
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of data extraction quality across 9 key dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qualityMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div key={index} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center ${getStatusColor(metric.status)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">{metric.name}</h3>
                        </div>
                      </div>
                      {getStatusBadge(metric.status)}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{metric.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">{metric.value}%</span>
                        <span className="text-xs text-success">{metric.trend}</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Job Performance</CardTitle>
            <CardDescription>Detailed breakdown of your latest scraping jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? recentJobs.map((job, index) => (
                <div key={index} className="p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">{job.name}</h3>
                    <Badge className="bg-success/20 text-success border-success/30">
                      {job.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Records</p>
                      <p className="text-sm font-medium text-foreground">{job.totalRecords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-sm font-medium text-foreground">{job.accuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium text-foreground">{job.completionTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="text-sm font-medium text-foreground">${job.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed jobs yet</p>
                  <p className="text-sm text-muted-foreground">Complete your first scraping job to see metrics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Top Performers</CardTitle>
              <CardDescription>Metrics with the highest scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">Data Uniqueness</span>
                </div>
                <span className="text-sm font-bold text-success">99.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">Data Accuracy</span>
                </div>
                <span className="text-sm font-bold text-success">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">Data Integrity</span>
                </div>
                <span className="text-sm font-bold text-success">97.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Improvement Areas</CardTitle>
              <CardDescription>Metrics with growth potential</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-foreground">Data Traceability</span>
                </div>
                <span className="text-sm font-bold text-warning">89.7%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-foreground">Data Timeliness</span>
                </div>
                <span className="text-sm font-bold text-info">91.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-foreground">Data Consistency</span>
                </div>
                <span className="text-sm font-bold text-info">93.6%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}