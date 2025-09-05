import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bot, FileText, Target, Settings, Sparkles } from "lucide-react"

interface ConnectionStep {
  id: string
  label: string
  icon: React.ReactNode
  duration: number
}

const connectionSteps: ConnectionStep[] = [
  {
    id: "fetching",
    label: "Fetching the agent",
    icon: <Bot className="w-5 h-5" />,
    duration: 1200
  },
  {
    id: "instructions",
    label: "Fetching instructions",
    icon: <FileText className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: "objective",
    label: "Fetching the objective",
    icon: <Target className="w-5 h-5" />,
    duration: 800
  },
  {
    id: "initializing",
    label: "Initializing connection",
    icon: <Settings className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: "ready",
    label: "Preparing interaction interface",
    icon: <Sparkles className="w-5 h-5" />,
    duration: 1000
  }
]

interface AgentConnectionOverlayProps {
  onComplete: () => void
}

export function AgentConnectionOverlay({ onComplete }: AgentConnectionOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const totalDuration = 5000 // 5 seconds total

  useEffect(() => {
    if (currentStep >= connectionSteps.length) {
      // All steps completed, fade out and call onComplete
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300) // Wait for fade out animation
      }, 500)
      return
    }

    const step = connectionSteps[currentStep]
    const stepDuration = totalDuration / connectionSteps.length
    const progressPerStep = 100 / connectionSteps.length
    const startProgress = currentStep * progressPerStep
    const endProgress = (currentStep + 1) * progressPerStep

    // Animate progress for current step
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (endProgress - startProgress) / (stepDuration / 50)
        if (newProgress >= endProgress) {
          clearInterval(progressTimer)
          return endProgress
        }
        return newProgress
      })
    }, 50)

    // Move to next step after duration
    const stepTimer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, stepDuration)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(stepTimer)
    }
  }, [currentStep, onComplete])

  if (!isVisible) return null

  const currentStepData = connectionSteps[currentStep]

  return (
    <div className={`fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className="bg-gradient-card border-border/50 shadow-xl max-w-lg w-full mx-6 animate-scale-in">
        <CardContent className="p-8">
          {/* Loading Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-muted rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Fetching the Agent
            </h2>
            {currentStepData && (
              <div className="flex items-center justify-center space-x-3 text-muted-foreground">
                <div className="p-2 bg-primary/20 rounded-lg">
                  {currentStepData.icon}
                </div>
                <span className="text-sm animate-pulse">{currentStepData.label}...</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {connectionSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="mt-6 space-y-2">
            {connectionSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                  index < currentStep ? 'text-success' : 
                  index === currentStep ? 'text-primary' : 
                  'text-muted-foreground/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index < currentStep ? 'bg-success animate-pulse' : 
                  index === currentStep ? 'bg-primary animate-pulse' : 
                  'bg-muted'
                }`}></div>
                <span>{step.label}</span>
                {index < currentStep && (
                  <div className="ml-auto text-success">✓</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}