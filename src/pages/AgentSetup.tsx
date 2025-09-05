import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoUpload } from "@/components/ui/video-upload"
import { 
  Globe, 
  ArrowRight,
  Sparkles,
  FileVideo,
  MessageSquare,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectDetails {
  projectName: string
  projectDescription: string
}

export default function AgentSetup() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [targetUrl, setTargetUrl] = useState("")
  const [instructions, setInstructions] = useState("")
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  useEffect(() => {
    const storedDetails = sessionStorage.getItem('projectDetails')
    if (storedDetails) {
      setProjectDetails(JSON.parse(storedDetails))
    } else {
      navigate('/')
    }
  }, [navigate])

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      setIsValidUrl(true)
    } catch {
      setIsValidUrl(url.length > 0 ? false : null)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setTargetUrl(url)
    validateUrl(url)
  }

  const handleGenerateAgent = () => {
    console.log("Generate button clicked!")
    console.log("Target URL:", targetUrl)
    console.log("Instructions:", instructions)
    console.log("Is form valid:", isFormValid)
    
    if (!targetUrl || !instructions) {
      console.log("Missing required fields")
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      })
      return
    }

    console.log("About to store data and navigate...")
    
    // Store all details for the next step
    sessionStorage.setItem('agentData', JSON.stringify({
      ...projectDetails,
      targetUrl,
      instructions,
      videoName: uploadedVideo?.name || null
    }))
    // Show building overlay only for this path
    sessionStorage.setItem('showBuildingOverlay', 'true')
    
    toast({
      title: "Generating Agent",
      description: "Redirecting to agent interaction...",
    })
    
    console.log("Navigating to agent-interaction...")
    navigate('/agent-interaction')
  }

  const handleBack = () => {
    navigate('/')
  }

  const isFormValid = targetUrl && isValidUrl && instructions

  if (!projectDetails) return null

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto mt-4">
        {/* Progress Indicator - Compact */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-primary">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              Details
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="flex items-center gap-2 text-primary">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              Setup
            </span>
            <div className="w-8 h-0.5 bg-muted"></div>
            <span className="flex items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
              Start
            </span>
          </div>
        </div>

        {/* Setup Cards Grid - Compact Version */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Target Website - Compact */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base">Target Website</CardTitle>
                <CardDescription className="text-xs">Website to scrape</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Label htmlFor="target-url" className="text-foreground font-medium text-sm">
                Website URL *
              </Label>
              <div className="relative">
                <Input
                  id="target-url"
                  type="url"
                  placeholder="https://example.com"
                  value={targetUrl}
                  onChange={handleUrlChange}
                  className={`bg-background/70 backdrop-blur-sm h-10 pr-10 transition-all duration-200 ${
                    isValidUrl === false ? 'border-destructive focus:border-destructive' : 
                    isValidUrl === true ? 'border-green-500 focus:border-green-500' : 'border-border/50 focus:border-primary'
                  }`}
                />
                {isValidUrl !== null && (
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-200 ${
                    isValidUrl ? 'bg-green-500 animate-pulse' : 'bg-destructive'
                  }`} />
                )}
              </div>
              {isValidUrl === false && (
                <p className="text-xs text-destructive animate-fade-in">Please enter a valid URL</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Upload - Compact */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileVideo className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base">Training Video</CardTitle>
                <CardDescription className="text-xs">Demo video (Optional)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-background/30 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setUploadedVideo(e.target.files?.[0] || null)}
                className="hidden"
                id="video-upload-compact"
              />
              <label htmlFor="video-upload-compact" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <FileVideo className="w-6 h-6 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">
                    {uploadedVideo ? uploadedVideo.name : "Click to upload video"}
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Instructions - Compact */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-base">Scraping Instructions</CardTitle>
                <CardDescription className="text-xs">What data to extract and requirements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="instructions" className="text-foreground font-medium text-sm">
                  Instructions *
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Describe what data you want to extract, pagination requirements, specific fields to focus on, and quality standards..."
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="bg-background/70 border-border/50 backdrop-blur-sm focus:bg-background focus:border-primary transition-all duration-200 resize-none text-sm"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>💡 Be detailed for best results</span>
                  <span className={`${instructions.length > 800 ? 'text-warning' : ''}`}>
                    {instructions.length}/1000
                  </span>
                </div>
              </div>

              <Button 
                className="w-full h-10 text-sm font-semibold bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white"
                onClick={handleGenerateAgent}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {!isFormValid && (
                <p className="text-xs text-muted-foreground text-center animate-fade-in">
                  Please enter a valid URL and scraping instructions to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}