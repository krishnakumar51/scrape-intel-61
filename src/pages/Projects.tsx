import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { AgentConnectionOverlay } from "@/components/AgentConnectionOverlay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bot, 
  Search,
  Calendar,
  Target,
  FileVideo,
  BarChart3,
  DollarSign,
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SavedProject {
  id: string
  name: string
  description: string
  targetUrl: string
  videoName: string
  instructions: string
  completedDate: string
  totalRecords: number
  accuracy: number
  totalCost: number
  completionTime: string
  status: 'completed' | 'running' | 'failed'
}

export default function Projects() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [showConnectionOverlay, setShowConnectionOverlay] = useState(false)
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null)

  useEffect(() => {
    // Load saved projects from localStorage
    const savedProjects = localStorage.getItem('savedProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.targetUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects))
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your list.",
    })
  }

  const handleCreateNew = () => {
    navigate('/create-agent')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success'
      case 'running': return 'bg-primary/20 text-primary'
      case 'failed': return 'bg-destructive/20 text-destructive'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'running': return <Clock className="w-3 h-3" />
      case 'failed': return <Target className="w-3 h-3" />
      default: return <Bot className="w-3 h-3" />
    }
  }

  const handleConnectToAgent = (project: SavedProject) => {
    setSelectedProject(project)
    setShowConnectionOverlay(true)
  }

  const handleConnectionComplete = () => {
    setShowConnectionOverlay(false)
    // Store the project data for agent interaction
    if (selectedProject) {
      sessionStorage.setItem('agentData', JSON.stringify({
        projectName: selectedProject.name,
        projectDescription: selectedProject.description,
        targetUrl: selectedProject.targetUrl,
        instructions: selectedProject.instructions,
        videoName: selectedProject.videoName
      }))
      navigate('/agent-interaction')
    }
  }

  return (
    <>
      {showConnectionOverlay && (
        <AgentConnectionOverlay onComplete={handleConnectionComplete} />
      )}
      <MainLayout
      title="Projects"
      description="Manage and view your scraping projects"
      actions={
        <Button onClick={handleCreateNew} className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      }
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-12 text-center">
            <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Create your first scraping project to get started"
              }
            </p>
            <Button onClick={handleCreateNew} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-gradient-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-foreground text-lg truncate">{project.name}</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      {project.description || "No description"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{project.targetUrl}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{project.videoName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{project.completedDate}</span>
                  </div>
                </div>

                <Separator className="bg-border" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Records</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {project.status === 'running' ? 'In Progress' : project.totalRecords}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Accuracy</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {project.status === 'running' ? 'Processing...' : `${project.accuracy}%`}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Cost</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {project.status === 'running' ? 'Calculating...' : `$${project.totalCost}`}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Time</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {project.status === 'running' ? 'Running...' : project.completionTime}
                    </span>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleConnectToAgent(project)}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Connect to Agent
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
    </>
  )
}