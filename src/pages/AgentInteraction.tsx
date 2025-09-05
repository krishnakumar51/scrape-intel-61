import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { AgentBuildingOverlay } from "@/components/AgentBuildingOverlay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bot, 
  User,
  Send,
  DollarSign,
  Clock,
  Target,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AgentData {
  projectName: string
  projectDescription: string
  targetUrl: string
  instructions: string
  videoName: string
}

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  isApproachCard?: boolean
  approachOptions?: string[]
  isSampleRecord?: boolean
  sampleData?: any
  isRecordCountPrompt?: boolean
}

export default function AgentInteraction() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'initial' | 'sample_record' | 'record_count' | 'cost_calculation' | 'approval'>('initial')
  const [costData, setCostData] = useState({ perRecord: 0.07, totalRecords: 100, totalCost: 7.00 })
  const [selectedApproach, setSelectedApproach] = useState<string>("")
  const [showBuildingOverlay, setShowBuildingOverlay] = useState<boolean>(() => sessionStorage.getItem('showBuildingOverlay') === 'true')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('agentData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setAgentData(data)
      initializeConversation(data)
    } else {
      navigate('/')
    }
    // One-time: clear flag so overlay does not appear on reconnect
    sessionStorage.removeItem('showBuildingOverlay')
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const initializeConversation = (data: AgentData) => {
    const initialMessage: Message = {
      id: '1',
      role: 'agent',
      content: `Hello! I've analyzed your project "${data.projectName}" and reviewed your video demonstration for ${data.targetUrl}. 

Based on your requirements, I've identified several possible scraping approaches. Please select the one that best matches your needs:`,
      timestamp: new Date(),
      isApproachCard: true,
      approachOptions: [
        "Full page scraping with pagination handling - Extract all product listings with detailed information",
        "Targeted data extraction - Focus on specific product attributes like price, title, and availability", 
        "Category-based scraping - Scrape products by category with customizable depth levels"
      ]
    }
    setMessages([initialMessage])
  }

  const handleApproachSelection = (approach: string) => {
    setSelectedApproach(approach)
    
    // Add user selection
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: approach,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Show "Preparing the sample" status message
    setTimeout(() => {
      const preparingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `Perfect choice! I'll implement ${approach.split(' - ')[0].toLowerCase()}.

Preparing the sample...`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, preparingMessage])

      // After 3-5 seconds, show the sample record
      setTimeout(() => {
        const sampleRecord = {
          product_name: "Wireless Bluetooth Headphones",
          price: "$49.99",
          rating: "4.5/5",
          reviews_count: "1,245",
          availability: "In Stock",
          target_url: "https://example.com/product/wireless-bluetooth-headphones"
        }

        const sampleMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'agent',
          content: `Sample Scraped Record:`,
          timestamp: new Date(),
          isSampleRecord: true,
          sampleData: sampleRecord
        }

        const costMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: 'agent',
          content: `This type of record costs approximately **$${costData.perRecord}** to scrape.

How many records would you like me to scrape?`,
          timestamp: new Date(),
          isRecordCountPrompt: true
        }

        setMessages(prev => [...prev, sampleMessage, costMessage])
        setCurrentStep('record_count')
        setIsLoading(false)
      }, 4000) // 4 second delay
    }, 1000) // 1 second delay for preparing message
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate agent response based on current step
    setTimeout(() => {
      let agentResponse: Message

      if (currentStep === 'record_count') {
        // Extract number from user input
        const recordCount = parseInt(inputMessage.match(/\d+/)?.[0] || '100')
        const newTotalCost = recordCount * costData.perRecord
        
        setCostData(prev => ({
          ...prev,
          totalRecords: recordCount,
          totalCost: parseFloat(newTotalCost.toFixed(2))
        }))

        agentResponse = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: `Perfect! I'll scrape **${recordCount} records** for you.

Here's your cost breakdown:
• **Cost per record:** $${costData.perRecord}
• **Total records:** ${recordCount}
• **Total cost:** $${newTotalCost.toFixed(2)}
• **Estimated time:** ${Math.ceil(recordCount / 20)}-${Math.ceil(recordCount / 15)} minutes

The scraping will include error handling, data validation, and quality checks. Would you like to proceed with these settings?`,
          timestamp: new Date()
        }
        setCurrentStep('cost_calculation')
      } else {
        agentResponse = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: "I understand your requirements. Let me adjust the approach accordingly and provide an updated cost estimate.",
          timestamp: new Date()
        }
      }

      setMessages(prev => [...prev, agentResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleApproveAndStart = () => {
    // Create project only once in savedProjects with stable id
    const projectId = `project-${Date.now()}`

    const savedProject = {
      id: projectId,
      name: agentData.projectName,
      description: agentData.projectDescription || "",
      targetUrl: agentData.targetUrl,
      videoName: agentData.videoName || "Training video",
      instructions: agentData.instructions || "",
      completedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalRecords: costData.totalRecords,
      accuracy: 98.5,
      totalCost: costData.totalCost,
      completionTime: "",
      status: 'running' as const
    }

    // Persist current project id for later updates
    sessionStorage.setItem('currentProjectId', projectId)

    // Save to projects list ONLY (avoid duplicates)
    const existingProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')
    const updatedProjects = [...existingProjects, savedProject]
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects))

    // Save to active progress for real-time sync (keyed by projectId)
    const progressData = {
      projectId,
      status: 'running' as const,
      currentRecord: 0,
      totalRecords: costData.totalRecords,
      accuracy: 98.5,
      cost: costData.totalCost,
      estimatedTimeRemaining: '5:30',
      currentActivity: 'Initializing scraper...'
    }
    const activeProgress = JSON.parse(localStorage.getItem('activeProgress') || '[]')
    const updatedProgress = [...activeProgress, progressData]
    localStorage.setItem('activeProgress', JSON.stringify(updatedProgress))

    sessionStorage.setItem('scrapingJob', JSON.stringify({
      ...agentData,
      costData,
      projectId,
      startTime: new Date().toISOString()
    }))
    
    toast({
      title: "Project Started",
      description: "Your scraping project has been saved and started.",
    })
    
    navigate('/scraping-status')
  }

  const handleBack = () => {
    navigate('/agent-setup')
  }

  if (!agentData) return null

  return (
    <>
      {showBuildingOverlay && (
        <AgentBuildingOverlay onComplete={() => setShowBuildingOverlay(false)} />
      )}
      <MainLayout>
        <div className="max-w-5xl mx-auto mt-4 h-[calc(100vh-6rem)] flex flex-col">
          <div className="mb-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agent Setup
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Chat Interface - Full Height Layout */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Card className="bg-gradient-card border-border flex-1 flex flex-col min-h-0">
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <CardTitle className="text-foreground text-lg">Agent Conversation</CardTitle>
                  </div>
                </CardHeader>
              
                <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="space-y-4 pr-2">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar className="w-8 h-8 shrink-0">
                              {message.role === 'user' ? (
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback className="bg-gradient-primary text-white">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className={`rounded-lg p-3 break-words ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-foreground'
                            }`}>
                              <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                              {message.isApproachCard && message.approachOptions && (
                                <div className="mt-3 space-y-2">
                                  {message.approachOptions.map((option, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      className="w-full text-left h-auto p-3 whitespace-normal text-wrap"
                                      onClick={() => handleApproachSelection(option)}
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </div>
                              )}
                              {message.isSampleRecord && message.sampleData && (
                                <div className="mt-3 p-4 bg-background border border-border rounded-lg">
                                  <pre className="text-sm text-foreground font-mono overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(message.sampleData, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-primary text-white">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted text-foreground rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="flex-shrink-0 mt-4 space-y-4">
                    {currentStep === 'cost_calculation' && (
                      <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Ready to start scraping?</span>
                          <Button 
                            onClick={handleApproveAndStart}
                            className="bg-gradient-primary hover:shadow-glow"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Start
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="bg-background border-border"
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gradient-primary"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Info Sidebar - Full Height */}
            <div className="flex flex-col space-y-4 min-h-0">
            <Card className="bg-gradient-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-foreground">Project Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">{agentData.projectName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{agentData.projectDescription || "No description"}</p>
                </div>
                
                <Separator className="bg-border" />
                
                <div>
                  <p className="text-sm text-muted-foreground">Target URL</p>
                  <p className="text-sm font-medium text-foreground break-all">{agentData.targetUrl}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Training Video</p>
                  <p className="text-sm font-medium text-foreground">{agentData.videoName}</p>
                </div>
              </CardContent>
            </Card>

            {currentStep === 'cost_calculation' && (
              <Card className="bg-gradient-card border-border flex-1">
                <CardHeader className="pb-4">
                  <CardTitle className="text-foreground text-sm">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Per Record</span>
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${costData.perRecord}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Records</span>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {costData.totalRecords}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${costData.totalCost}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Time</span>
                      <Badge variant="secondary" className="bg-muted/20 text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.ceil(costData.totalRecords / 20)}-{Math.ceil(costData.totalRecords / 15)} min
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
    </>
  )
}