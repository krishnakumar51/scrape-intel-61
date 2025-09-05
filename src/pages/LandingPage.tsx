import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  Bot,
  MessageSquare,
  Play,
  Eye,
  BarChart3,
  Activity,
  Folder,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Zap,
  Shield,
  Download
} from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCreateProject = () => {
    if (isAuthenticated) {
      navigate('/create-agent')
    } else {
      setShowAuthModal(true)
    }
  }

  const flowSteps = [
    {
      number: "01",
      title: "Prepare & Configure",
      description: "Set project details, instructions & target URL",
      icon: <Target className="w-5 h-5" />,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      number: "02", 
      title: "Agent Creation & Interaction",
      description: "AI analysis, setup & cost preview",
      icon: <Bot className="w-5 h-5" />,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      title: "Execute", 
      description: "Start scraping process",
      icon: <Play className="w-5 h-5" />,
      gradient: "from-green-500 to-green-600"
    },
    {
      number: "04",
      title: "Monitor",
      description: "Live progress & analytics",
      icon: <Eye className="w-5 h-5" />,
      gradient: "from-orange-500 to-orange-600"
    },
    {
      number: "05",
      title: "Complete",
      description: "Results & reports",
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: "from-teal-500 to-teal-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-primary bg-clip-text text-transparent mb-4 tracking-tight">
          WebScraper AI
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Intelligent web scraping powered by artificial intelligence. Create custom agents, extract data seamlessly, and monitor your projects with advanced analytics.
        </p>
      </motion.div>

      {/* Project Creation Flow */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground">Simple 5-step process to create intelligent scraping agents</p>
        </motion.div>

        <motion.div 
          className="relative max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Flow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {flowSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="bg-gradient-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {step.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs font-bold mb-3 bg-primary/10 text-primary">
                      {step.number}
                    </Badge>
                    <h3 className="font-semibold text-foreground text-lg mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {index < flowSteps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 z-10 transform -translate-y-1/2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="bg-background rounded-full p-2 border-2 border-primary/20">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Button 
            onClick={handleCreateProject}
            className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white font-semibold px-8 py-4 text-lg rounded-xl"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create New Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Platform Overview */}
      <motion.div 
        className="max-w-6xl mx-auto mt-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Overview</h2>
          <p className="text-muted-foreground text-lg">Explore the powerful features of WebScraper AI</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/50 p-1">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Metrics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card className="bg-gradient-card/80 backdrop-blur-sm border-border/50 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-foreground flex items-center space-x-3 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span>Dashboard</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Real-time monitoring and control center for all your scraping operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Live Agents</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Monitor all running agents in real-time with live status updates</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Cost Analysis</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Monitor spending patterns, optimize usage, and forecast future costs</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Performance</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Analyze processing speed, efficiency trends, and system optimization</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-gradient-card/80 backdrop-blur-sm border-border/50 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-foreground flex items-center space-x-3 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <span>Projects</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Centralized project management and comprehensive storage solution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Success Rates</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Track accuracy, completion rates, and data quality metrics across all projects</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Cost Analysis</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Monitor spending patterns, optimize usage, and forecast future costs</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Performance</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Analyze processing speed, efficiency trends, and system optimization</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="bg-gradient-card/80 backdrop-blur-sm border-border/50 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-foreground flex items-center space-x-3 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span>Metrics</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced analytics and comprehensive performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Success Rates</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Track accuracy, completion rates, and data quality metrics across all projects</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Cost Analysis</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Monitor spending patterns, optimize usage, and forecast future costs</div>
                  </motion.div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border border-border/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-semibold text-foreground text-xl mb-2">Performance</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">Analyze processing speed, efficiency trends, and system optimization</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </MainLayout>
  )
}