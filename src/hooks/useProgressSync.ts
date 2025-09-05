import { useState, useEffect } from 'react'

interface ProgressData {
  projectId: string
  status: 'running' | 'paused' | 'completed' | 'error'
  currentRecord: number
  totalRecords: number
  accuracy: number
  cost: number
  estimatedTimeRemaining: string
  currentActivity: string
}

export const useProgressSync = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([])

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('activeProgress') || '[]'
      setProgressData(JSON.parse(stored))
    }

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    handleStorageChange() // Initial load

    // Set up interval to sync progress for running projects
    const interval = setInterval(() => {
      const stored = localStorage.getItem('activeProgress') || '[]'
      const current = JSON.parse(stored)
      
      const updated = current.map((item: ProgressData) => {
        if (item.status === 'running') {
          const newRecord = Math.min(item.currentRecord + Math.floor(Math.random() * 3) + 1, item.totalRecords)
          const progressPercent = (newRecord / item.totalRecords) * 100
          
          return {
            ...item,
            currentRecord: newRecord,
            accuracy: 98.5 + (Math.random() * 1.0 - 0.5),
            status: newRecord >= item.totalRecords ? 'completed' as const : item.status,
            currentActivity: newRecord >= item.totalRecords 
              ? 'Scraping completed successfully!' 
              : `Processing record ${newRecord}/${item.totalRecords}`
          }
        }
        return item
      })

      if (JSON.stringify(updated) !== JSON.stringify(current)) {
        localStorage.setItem('activeProgress', JSON.stringify(updated))
        setProgressData(updated)
      }
    }, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const updateProgress = (projectId: string, updates: Partial<ProgressData>) => {
    const stored = localStorage.getItem('activeProgress') || '[]'
    const current = JSON.parse(stored)
    const updated = current.map((item: ProgressData) => 
      item.projectId === projectId ? { ...item, ...updates } : item
    )
    localStorage.setItem('activeProgress', JSON.stringify(updated))
    setProgressData(updated)
  }

  const addProgress = (data: ProgressData) => {
    const stored = localStorage.getItem('activeProgress') || '[]'
    const current = JSON.parse(stored)
    const updated = [...current, data]
    localStorage.setItem('activeProgress', JSON.stringify(updated))
    setProgressData(updated)
  }

  const removeProgress = (projectId: string) => {
    const stored = localStorage.getItem('activeProgress') || '[]'
    const current = JSON.parse(stored)
    const updated = current.filter((item: ProgressData) => item.projectId !== projectId)
    localStorage.setItem('activeProgress', JSON.stringify(updated))
    setProgressData(updated)
  }

  return {
    progressData,
    updateProgress,
    addProgress,
    removeProgress
  }
}