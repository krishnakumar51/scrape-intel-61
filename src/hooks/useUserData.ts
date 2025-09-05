import { useState, useEffect } from 'react'

interface ProjectData {
  id: string
  name: string
  description?: string
  targetUrl: string
  completedDate: string
  totalRecords: number
  accuracy: number
  totalCost: number
  completionTime: string
  status: 'completed' | 'running' | 'paused' | 'error'
}

interface RecentActivity {
  action: string
  project: string
  time: string
  type: 'success' | 'warning' | 'info'
}

interface UserStats {
  totalProjects: number
  totalRecords: number
  averageAccuracy: number
  totalSpent: number
  totalTimeSaved: string
}

export function useUserData() {
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalProjects: 0,
    totalRecords: 0,
    averageAccuracy: 0,
    totalSpent: 0,
    totalTimeSaved: '0h'
  })

  const loadData = () => {
    // Get stored projects from localStorage (only use savedProjects to avoid duplicates)
    const storedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]')
    
    // Use only savedProjects, no need to combine with userAgents to avoid duplicates
    const allProjects = storedProjects

    // Sort by most recent
    const sortedProjects = allProjects.sort((a, b) => 
      new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
    )
    
    setRecentProjects(sortedProjects.slice(0, 10))

    // Get real-time recent activities from localStorage
    const storedActivities = JSON.parse(localStorage.getItem('recentActivity') || '[]')
    
    // If no stored activities, generate from projects
    if (storedActivities.length === 0) {
      const activities: RecentActivity[] = sortedProjects.slice(0, 5).map((project, index) => {
        const actions = [
          { action: 'Completed scraping project', type: 'success' as const },
          { action: 'Updated project settings', type: 'info' as const },
          { action: 'Achieved high accuracy rate', type: 'success' as const },
          { action: 'Paused scraping job', type: 'warning' as const },
        ]
        
        const timeAgo = [
          `${Math.floor(Math.random() * 3) + 1} hours ago`,
          `${Math.floor(Math.random() * 2) + 1} days ago`,
          `${Math.floor(Math.random() * 7) + 1} days ago`
        ]

        const activity = actions[index % actions.length]
        return {
          action: activity.action,
          project: project.name,
          time: timeAgo[index % timeAgo.length],
          type: activity.type
        }
      })
      setRecentActivity(activities)
    } else {
      // Use stored real-time activities
      setRecentActivity(storedActivities.slice(0, 10))
    }

    // Calculate user stats
    if (sortedProjects.length > 0) {
      const stats = {
        totalProjects: sortedProjects.length,
        totalRecords: sortedProjects.reduce((sum, p) => sum + p.totalRecords, 0),
        averageAccuracy: sortedProjects.reduce((sum, p) => sum + p.accuracy, 0) / sortedProjects.length,
        totalSpent: sortedProjects.reduce((sum, p) => sum + p.totalCost, 0),
        totalTimeSaved: calculateTimeSaved(sortedProjects)
      }
      setUserStats(stats)
    }
  }

  useEffect(() => {
    loadData()
    
    // Listen for storage changes to refresh data
    const handleStorageChange = () => {
      loadData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const calculateTimeSaved = (projects: ProjectData[]): string => {
    const totalMinutes = projects.reduce((sum, project) => {
      // Extract hours and minutes from completionTime string
      const timeMatch = project.completionTime.match(/(\d+)h\s*(\d+)m/)
      if (timeMatch) {
        const hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        return sum + (hours * 60) + minutes
      }
      return sum + 120 // default 2 hours if no match
    }, 0)

    // Assume manual work would take 10x longer
    const timeSavedMinutes = totalMinutes * 9
    const hours = Math.floor(timeSavedMinutes / 60)
    
    return `${hours}h`
  }

  return {
    recentProjects,
    recentActivity,
    userStats,
    refreshData: loadData
  }
}