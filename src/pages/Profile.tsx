import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useUserData } from "@/hooks/useUserData"
import { 
  User,
  Mail,
  Calendar,
  MapPin,
  Building,
  Phone,
  Globe,
  Edit,
  Camera,
  Trophy,
  Target,
  Clock,
  DollarSign,
  Star,
  Award,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function Profile() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const { recentActivity, userStats } = useUserData()
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "ScrapeMaster Inc",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    website: "https://johndoe.dev",
    bio: "Full-stack developer with 5+ years of experience in web scraping and data extraction. Passionate about building scalable solutions for data-driven businesses.",
    joinDate: "March 2023"
  })

  // Dynamic stats based on user data
  const stats = [
    { label: "Projects Created", value: userStats.totalProjects.toString(), icon: Target, color: "text-primary" },
    { label: "Data Records Scraped", value: `${(userStats.totalRecords / 1000000).toFixed(1)}M`, icon: Trophy, color: "text-success" },
    { label: "Total Time Saved", value: userStats.totalTimeSaved, icon: Clock, color: "text-info" },
    { label: "Total Spent", value: `$${userStats.totalSpent.toFixed(0)}`, icon: DollarSign, color: "text-accent" }
  ]

  const achievements = [
    { title: "First Project", description: "Created your first scraping project", date: "Mar 2023", earned: true },
    { title: "Data Master", description: "Scraped over 1 million records", date: "Jun 2023", earned: true },
    { title: "Efficiency Expert", description: "Achieved 99%+ accuracy rate", date: "Aug 2023", earned: true },
    { title: "Power User", description: "Used advanced features for 30 days", date: "Oct 2023", earned: true },
    { title: "Cost Optimizer", description: "Saved over $10,000 in operational costs", date: "Dec 2023", earned: true },
    { title: "Scale Master", description: "Process 10M+ records in a month", date: "Not earned", earned: false },
  ]

  const recentActivityData = recentActivity.length > 0 ? recentActivity : [
    { action: "No recent activity", project: "Create your first project", time: "Get started" }
  ]

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <MainLayout
      title="Profile"
      description="Manage your account information and view your scraping statistics"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary/20 text-primary">Pro Plan</Badge>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{profile.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Joined {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={profile.website} className="text-sm text-primary hover:underline">
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-gradient-primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-gradient-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest scraping projects and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivityData.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg border border-border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.project} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>Unlock badges by reaching milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-muted/20 border-border opacity-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-success/20' : 'bg-muted/20'
                  }`}>
                    {achievement.earned ? (
                      <Star className="w-4 h-4 text-success" />
                    ) : (
                      <Star className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}