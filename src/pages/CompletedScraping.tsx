import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  Download,
  FileText,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Calendar,
  Clock,
  Target,
  DollarSign,
  FileVideo
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { downloadCSV, downloadJSON, downloadExcel, downloadChatLog } from "@/utils/downloadUtils"

interface CompletedJob {
  projectName: string
  targetUrl: string
  totalRecords: number
  finalAccuracy: number
  totalCost: number
  completionTime: string
  errors: number
}

export default function CompletedScraping() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [jobData, setJobData] = useState<CompletedJob>({
    projectName: "E-commerce Product Scraper",
    targetUrl: "https://example.com",
    totalRecords: 100,
    finalAccuracy: 98.7,
    totalCost: 5.00,
    completionTime: "7:32",
    errors: 3
  })

  useEffect(() => {
    const storedJob = sessionStorage.getItem('scrapingJob')
    if (storedJob) {
      const job = JSON.parse(storedJob)
      const updatedJobData = {
        projectName: job.projectName,
        targetUrl: job.targetUrl,
        totalRecords: job.costData.totalRecords,
        finalAccuracy: 98.7,
        totalCost: job.costData.totalCost,
        completionTime: "7:32",  
        errors: 3
      }
      setJobData(updatedJobData)
      
      // Avoid duplicate saves: only save if not already updated by ScrapingStatus
      const existing = JSON.parse(localStorage.getItem('savedProjects') || '[]')
      const projectId = sessionStorage.getItem('currentProjectId')
      const exists = projectId && existing.some((p: any) => p.id === projectId)
      if (!exists) {
        handleAutoSaveProject(job, updatedJobData)
      }
    }
  }, [])

  const handleAutoSaveProject = (job: any, completedJobData: CompletedJob) => {
    const storedAgentData = sessionStorage.getItem('agentData')
    let agentData = {}
    if (storedAgentData) {
      agentData = JSON.parse(storedAgentData)
    }
    
    const savedProject = {
      id: Date.now().toString(),
      name: completedJobData.projectName,
      description: (agentData as any).projectDescription || "",
      targetUrl: completedJobData.targetUrl,
      videoName: (agentData as any).videoName || "Training video",
      instructions: (agentData as any).instructions || "",
      completedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalRecords: completedJobData.totalRecords,
      accuracy: completedJobData.finalAccuracy,
      totalCost: completedJobData.totalCost,
      completionTime: completedJobData.completionTime,
      status: 'completed' as const
    }

    const existingProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')
    const updatedProjects = [savedProject, ...existingProjects] // Add to beginning
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects))
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'))
  }

  const handleDownloadData = (format: string) => {
    toast({
      title: "Download Started",
      description: `Your data is being prepared in ${format} format.`,
    })
    
    // Trigger actual downloads
    switch (format) {
      case 'CSV':
        downloadCSV()
        break
      case 'JSON':
        downloadJSON()
        break
      case 'Excel':
        downloadExcel()
        break
      default:
        console.log(`Downloading data in ${format} format`)
    }
  }

  const handleDownloadChat = () => {
    toast({
      title: "Chat Export Started",
      description: "Your conversation history is being prepared for download.",
    })
    downloadChatLog()
  }

  const handleViewMetrics = () => {
    // Navigate to project-specific metrics with project data
    const projectId = sessionStorage.getItem('currentProjectId') || Date.now().toString()
    navigate(`/metrics/${jobData.projectName}`, { 
      state: { 
        projectData: {
          id: projectId,
          name: jobData.projectName,
          targetUrl: jobData.targetUrl,
          totalRecords: jobData.totalRecords,
          accuracy: jobData.finalAccuracy,
          totalCost: jobData.totalCost,
          completionTime: jobData.completionTime,
          completedDate: new Date().toISOString()
        }
      }
    })
  }

  const handleCreateNewAgent = () => {
    // Clear session storage and navigate to create new agent
    sessionStorage.clear()
    navigate('/')
  }

  const handleSaveProject = () => {
    const storedAgentData = sessionStorage.getItem('agentData')
    if (storedAgentData) {
      const agentData = JSON.parse(storedAgentData)
      
      const savedProject = {
        id: Date.now().toString(),
        name: jobData.projectName,
        description: agentData.projectDescription || "",
        targetUrl: jobData.targetUrl,
        videoName: agentData.videoName || "Training video",
        instructions: agentData.instructions || "",
        completedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        totalRecords: jobData.totalRecords,
        accuracy: jobData.finalAccuracy,
        totalCost: jobData.totalCost,
        completionTime: jobData.completionTime,
        status: 'completed' as const
      }

      const existingProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')
      const updatedProjects = [...existingProjects, savedProject]
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects))

      toast({
        title: "Project Saved",
        description: "Your project has been saved to the Projects tab.",
      })
      
      navigate('/projects')
    }
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Success Banner */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            <span className="font-bold text-foreground">Successfully extracted</span> {jobData.totalRecords} records from <span className="font-bold text-foreground">{jobData.targetUrl}</span> with <span className="font-bold text-success">{jobData.finalAccuracy}% accuracy</span> in {jobData.completionTime}.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{jobData.totalRecords}</div>
              <div className="text-sm text-muted-foreground">Records Extracted</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{jobData.finalAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{jobData.completionTime}</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">${jobData.totalCost}</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Download Options */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Download className="w-5 h-5 text-primary" />
                <span>Download Results</span>
              </CardTitle>
              <CardDescription>
                Export your scraped data in multiple formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownloadData('CSV')}
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">CSV File</div>
                    <div className="text-xs text-muted-foreground">Spreadsheet format</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownloadData('JSON')}
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">JSON File</div>
                    <div className="text-xs text-muted-foreground">Developer format</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleDownloadData('Excel')}
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">Excel File</div>
                    <div className="text-xs text-muted-foreground">Advanced spreadsheet</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={handleDownloadChat}
                >
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">Chat Log</div>
                    <div className="text-xs text-muted-foreground">Conversation history</div>
                  </div>
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm">Data Quality Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Records:</span>
                    <span className="text-foreground font-medium">
                      {Math.floor(jobData.totalRecords * (jobData.finalAccuracy / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="text-foreground font-medium">{jobData.errors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="text-foreground font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Format:</span>
                    <span className="text-foreground font-medium">Structured</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Summary & Next Steps */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Project Summary</CardTitle>
              <CardDescription>
                {jobData.projectName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Completed: {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground break-all">
                    Target: {jobData.targetUrl}
                  </span>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground text-sm">Next Steps</h4>
                
                <Button 
                  onClick={handleViewMetrics}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>

                <Button 
                  onClick={() => console.log('View uploaded training video')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileVideo className="w-4 h-4 mr-2" />
                  View Uploaded Video
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/projects')}
                  className="w-full bg-gradient-primary"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View in Projects
                </Button>
                
                <div className="text-center">
                  <Badge variant="secondary" className="bg-success/20 text-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Project Saved & Completed Successfully
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}