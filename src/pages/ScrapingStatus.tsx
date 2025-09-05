import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Play, 
  Pause,
  Square,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Database
} from "lucide-react"

interface ScrapingJob {
  projectName: string
  targetUrl: string
  costData: {
    perRecord: number
    totalRecords: number
    totalCost: number
  }
  startTime: string
}

interface ScrapingProgress {
  status: 'running' | 'paused' | 'completed' | 'error'
  currentRecord: number
  totalRecords: number
  accuracy: number
  errors: number
  estimatedTimeRemaining: string
  currentActivity: string
}

export default function ScrapingStatus() {
  const navigate = useNavigate()
  const [job, setJob] = useState<ScrapingJob | null>(null)
  const [progress, setProgress] = useState<ScrapingProgress>({
    status: 'running',
    currentRecord: 0,
    totalRecords: 0, // Will be updated when job loads
    accuracy: 98.5,
    errors: 0,
    estimatedTimeRemaining: '5:30',
    currentActivity: 'Initializing scraper...'
  })
  const [logs, setLogs] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info', timestamp: string}>>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedJob = sessionStorage.getItem('scrapingJob')
    if (storedJob) {
      const jobData = JSON.parse(storedJob)
      setJob(jobData)
      // Update total records immediately from job data
      setProgress(prev => ({ 
        ...prev, 
        totalRecords: jobData.costData.totalRecords,
        currentActivity: `Starting to scrape ${jobData.costData.totalRecords} records...`
      }))
      
      // Add initial activity to recent activity
      addRecentActivity('Started scraping agent', jobData.projectName, 'info')
      
      // Pass the correct totalRecords to startScraping
      startScraping(jobData)
    } else {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    // Smart auto-scroll: only scroll if user hasn't manually scrolled up
    const logsContainer = document.querySelector('[data-logs-container="true"]') as HTMLElement;
    if (logsContainer && logsContainer.dataset.userScrolling !== 'true') {
      // Use timeout to ensure DOM is updated
      setTimeout(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [logs])

  const addRecentActivity = (action: string, projectName: string, type: 'success' | 'warning' | 'info') => {
    const newActivity = {
      action,
      project: projectName,
      time: 'just now',
      type
    }
    
    // Get existing activities
    const existingActivities = JSON.parse(localStorage.getItem('recentActivity') || '[]')
    
    // Add new activity to the beginning
    const updatedActivities = [newActivity, ...existingActivities.slice(0, 9)] // Keep only 10 most recent
    
    // Save to localStorage
    localStorage.setItem('recentActivity', JSON.stringify(updatedActivities))
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'))
  }

  const startScraping = (jobDataParam?: ScrapingJob) => {
    const targetTotalRecords = jobDataParam?.costData.totalRecords || job?.costData.totalRecords || progress.totalRecords
    
    // Initial logs
    const initialLogs = [
      {
        id: '0',
        message: 'Scraping started...',
        type: 'info' as const,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: '1',
        message: `Starting Scraping (0/${targetTotalRecords})`,
        type: 'info' as const,
        timestamp: new Date().toLocaleTimeString()
      }
    ]
    setLogs(initialLogs)

    let currentRecord = 0
    let logId = 2
    
    const interval = setInterval(() => {
      const prevRecord = currentRecord
      currentRecord += Math.floor(Math.random() * 3) + 1
      
      // Add log entries for each new record
      const newLogs = []
      for (let i = prevRecord + 1; i <= Math.min(currentRecord, targetTotalRecords); i++) {
        const isSuccess = Math.random() > 0.05 // 95% success rate
        newLogs.push({
          id: logId.toString(),
          message: `Scraping successful for record ${i}/${targetTotalRecords} -->> ${isSuccess ? '✅' : '❌'}`,
          type: isSuccess ? 'success' as const : 'error' as const,
          timestamp: new Date().toLocaleTimeString()
        })
        logId++
      }
      
      if (currentRecord >= targetTotalRecords) {
        currentRecord = targetTotalRecords
        newLogs.push({
          id: logId.toString(),
          message: `Scraping finished successfully: ${targetTotalRecords}/${targetTotalRecords} records -->> ✅`,
          type: 'success' as const,
          timestamp: new Date().toLocaleTimeString()
        })
        
        setProgress(prev => ({
          ...prev,
          status: 'completed',
          currentRecord,
          totalRecords: targetTotalRecords,
          currentActivity: 'Scraping completed successfully!'
        }))
        setLogs(prev => [...prev, ...newLogs])
        clearInterval(interval)
        
        // Add completion activity and persist using the provided job data to avoid stale closures
        const jobForSave = jobDataParam || job
        if (jobForSave) {
          addRecentActivity('Completed scraping project', jobForSave.projectName, 'success')
          // Save completed project to localStorage for recent activity
          saveCompletedProject(jobForSave, targetTotalRecords)
        }
        
        // Navigate to completion page after a short delay
        setTimeout(() => {
          navigate('/scraping-complete')
        }, 2000)
        return
      }

      const timeRemaining = Math.max(0, Math.floor((targetTotalRecords - currentRecord) * 0.6))
      const minutes = Math.floor(timeRemaining / 60)
      const seconds = timeRemaining % 60

      setProgress(prev => ({
        ...prev,
        currentRecord,
        totalRecords: targetTotalRecords,
        currentActivity: `Processing record ${currentRecord}/${targetTotalRecords}`,
        estimatedTimeRemaining: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        accuracy: 98.5 + (Math.random() * 1.0 - 0.5)
      }))
      
      setLogs(prev => [...prev, ...newLogs])
    }, 300)

    return () => clearInterval(interval)
  }

  const handlePause = () => {
    setProgress(prev => ({ ...prev, status: prev.status === 'paused' ? 'running' : 'paused' }))
  }

  const saveCompletedProject = (jobData: ScrapingJob, totalRecords: number) => {
    const projectId = sessionStorage.getItem('currentProjectId') || jobData.projectName // fallback
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')

    const idx = savedProjects.findIndex((p: any) => p.id === projectId)
    const completionTime = `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`

    if (idx !== -1) {
      // Update existing project entry
      savedProjects[idx] = {
        ...savedProjects[idx],
        totalRecords,
        accuracy: progress.accuracy,
        totalCost: jobData.costData.totalCost,
        completionTime,
        status: 'completed'
      }
    } else {
      // Fallback: create if not found
      savedProjects.unshift({
        id: projectId,
        name: jobData.projectName,
        description: `Scraped from ${jobData.targetUrl}`,
        targetUrl: jobData.targetUrl,
        completedDate: new Date().toLocaleDateString(),
        totalRecords,
        accuracy: progress.accuracy,
        totalCost: jobData.costData.totalCost,
        completionTime,
        status: 'completed' as const
      })
    }

    localStorage.setItem('savedProjects', JSON.stringify(savedProjects))

    // Remove from active progress using consistent projectId
    const activeProgress = JSON.parse(localStorage.getItem('activeProgress') || '[]')
    const updatedProgress = activeProgress.filter((p: any) => p.projectId !== projectId)
    localStorage.setItem('activeProgress', JSON.stringify(updatedProgress))

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'))
  }

  const handleStop = () => {
    setProgress(prev => ({ ...prev, status: 'error', currentActivity: 'Scraping stopped by user' }))
  }

  const getStatusColor = () => {
    switch (progress.status) {
      case 'running': return 'bg-success'
      case 'paused': return 'bg-warning'
      case 'completed': return 'bg-success'
      case 'error': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (!job) return null

  const progressPercent = (progress.currentRecord / progress.totalRecords) * 100

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col space-y-2 p-4">
        {/* Centered Title */}
        <div className="text-center flex-shrink-0 pb-1">
          <h1 className="text-lg font-bold text-foreground">Scraping in Progress</h1>
        </div>
        {/* Main Progress Card - Compact */}
        <Card className="bg-gradient-card border-border flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-foreground flex items-center space-x-2 text-base">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="truncate">{job.projectName}</span>
                </CardTitle>
                <CardDescription className="text-xs truncate">{job.targetUrl}</CardDescription>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <Badge className={`${getStatusColor()} text-white text-xs px-2 py-1`}>
                  {getStatusIcon()}
                  <span className="ml-1 capitalize">{progress.status}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-foreground font-medium">
                  {progress.currentRecord} / {progress.totalRecords} records
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressPercent.toFixed(1)}% Complete</span>
                <span>Est. {progress.estimatedTimeRemaining} remaining</span>
              </div>
            </div>

            {/* Current Activity */}
            <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
              <Activity className="w-3 h-3 text-primary animate-spin" />
              <span className="text-xs text-foreground">{progress.currentActivity}</span>
            </div>

          </CardContent>
        </Card>

        {/* Metrics Grid - Compact */}
        <div className="grid grid-cols-3 gap-2 flex-shrink-0">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-1 px-3 pt-2">
              <CardTitle className="text-xs text-foreground">Quality</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Accuracy</span>
                <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                  {progress.accuracy.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Valid</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  {Math.floor(progress.currentRecord * (progress.accuracy / 100))}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-1 px-3 pt-2">
              <CardTitle className="text-xs text-foreground">Performance</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Records/Min</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                  ~45
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Est. Total</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  8:15
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-1 px-3 pt-2">
              <CardTitle className="text-xs text-foreground">Cost</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current</span>
                <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                  ${(progress.currentRecord * job.costData.perRecord).toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Est</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  ${job.costData.totalCost.toFixed(2)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Progress Logs - Compact */}
        <Card className="bg-gradient-card border-border flex-1">
          <CardHeader className="pb-2 flex-shrink-0 px-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                  <Database className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xs text-foreground">Live Processing Logs</CardTitle>
                  <p className="text-xs text-muted-foreground">Real-time activity</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs h-6 px-2 bg-muted/50 hover:bg-muted"
              >
                ↓ Latest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-2 px-4 flex-1">
            <div className="h-48 border rounded-lg bg-background/80 backdrop-blur-sm overflow-hidden shadow-inner">
              <ScrollArea 
                className="h-full" 
                data-logs-container="true"
                onWheel={() => {
                  // Mark user as manually scrolling
                  const container = document.querySelector('[data-logs-container="true"]') as HTMLElement;
                  if (container) {
                    container.dataset.userScrolling = 'true';
                    setTimeout(() => {
                      container.dataset.userScrolling = 'false';
                    }, 3000);
                  }
                }}
              >
                <div className="p-4 space-y-2 font-mono text-xs">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`flex items-start space-x-3 p-2 rounded-md transition-all duration-200 ${
                        log.type === 'success' ? 'bg-success/5 border-l-2 border-success/30' : 
                        log.type === 'error' ? 'bg-destructive/5 border-l-2 border-destructive/30' : 
                        'bg-primary/5 border-l-2 border-primary/30'
                      } hover:bg-opacity-80`}
                    >
                      <span className="text-muted-foreground/70 shrink-0 w-16 text-[10px] font-medium tracking-wide">
                        {log.timestamp}
                      </span>
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        log.type === 'success' ? 'bg-success/20 text-success' : 
                        log.type === 'error' ? 'bg-destructive/20 text-destructive' : 
                        'bg-primary/20 text-primary'
                      }`}>
                        {log.type === 'success' ? '✓' : log.type === 'error' ? '✗' : 'i'}
                      </div>
                      <span className="text-foreground/90 break-words text-[11px] leading-relaxed flex-1">
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}