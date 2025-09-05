import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowRight,
  Sparkles,
  Target
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateAgent() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleContinue = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    if (!projectName) {
      toast({
        title: "Missing Information",
        description: "Please enter a project name to continue.",
        variant: "destructive",
      })
      return
    }

    // Store project details in sessionStorage to pass to next step
    sessionStorage.setItem('projectDetails', JSON.stringify({
      projectName,
      projectDescription
    }))
    
    navigate('/agent-setup')
  }

  const isFormValid = projectName.length > 0

  return (
    <MainLayout>
      {/* Page Heading */}
      <div className="text-center mb-16 mt-12">
        <h1 className="text-6xl font-black bg-gradient-primary bg-clip-text text-transparent mb-4 tracking-tight font-heading">
          WebScraper AI
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Intelligent web scraping powered by artificial intelligence
        </p>
      </div>
      
      {/* Main Form - Centered and Larger */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card/80 backdrop-blur-sm border-border/50 shadow-xl animate-fade-in">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-xl">Project Details</CardTitle>
                <CardDescription className="text-sm">Define your scraping project</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-foreground font-medium text-sm">
                Project Name *
              </Label>
              <Input
                id="project-name"
                placeholder="e.g., E-commerce Product Scraper"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-background/50 border-border/50 backdrop-blur-sm focus:bg-background focus:border-primary transition-all duration-200 h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description" className="text-foreground font-medium text-sm">
                Project Description
                <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
              </Label>
              <Textarea
                id="project-description"
                placeholder="Brief description of what this agent will accomplish..."
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="bg-background/50 border-border/50 backdrop-blur-sm focus:bg-background focus:border-primary transition-all duration-200 resize-none text-sm"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white font-semibold h-9"
                onClick={handleContinue}
                disabled={!isFormValid}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue to Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              {!isFormValid && (
                <p className="text-xs text-muted-foreground text-center mt-2 animate-fade-in">
                  Please enter a project name to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="login"
        />
      </div>
    </MainLayout>
  )
}