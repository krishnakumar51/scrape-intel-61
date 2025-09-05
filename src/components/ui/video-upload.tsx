import { useState, useCallback } from "react"
import { Upload, Video, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface VideoUploadProps {
  onVideoSelect?: (file: File) => void
  onVideoRemove?: () => void
  maxSize?: number // in MB
  className?: string
}

export function VideoUpload({ 
  onVideoSelect, 
  onVideoRemove, 
  maxSize = 500,
  className = ""
}: VideoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback((file: File) => {
    // Enhanced video format validation
    const validVideoTypes = [
      'video/mp4', 
      'video/avi', 
      'video/quicktime', 
      'video/x-msvideo', 
      'video/webm',
      'video/mov'
    ]
    
    const isValidVideo = validVideoTypes.some(type => 
      file.type === type || file.name.toLowerCase().includes(type.split('/')[1])
    )
    
    if (!isValidVideo && !file.type.startsWith('video/')) {
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Enhanced upload progress simulation with smoother animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          setUploadedFile(file)
          onVideoSelect?.(file)
          return 100
        }
        return prev + Math.random() * 15 + 5 // More realistic progress
      })
    }, 150)
  }, [maxSize, onVideoSelect])

  const handleRemove = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    // Reset the file input
    const fileInput = document.getElementById('video-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    onVideoRemove?.()
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input clicked")
    const files = e.target.files
    console.log("Files:", files)
    if (files && files.length > 0) {
      console.log("Processing file:", files[0].name)
      handleFile(files[0])
    }
  }

  if (uploadedFile) {
    return (
      <Card className={`p-4 bg-gradient-card border-border shadow-lg animate-fade-in ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate text-sm">{uploadedFile.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready for processing
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer group ${
        isDragOver 
          ? 'border-primary bg-primary/5 shadow-glow scale-102' 
          : 'border-border hover:border-primary/60 hover:bg-primary/2'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-6 text-center">
        {isUploading ? (
          <div className="space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Video className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Processing Video...</h3>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto h-2" />
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {Math.round(uploadProgress)}% complete
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Upload className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                Upload Training Video
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Drag and drop your scraping demonstration video here, or click to browse files
              </p>
              <div className="space-y-1 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                <p>📹 Formats: MP4, AVI, MOV, WebM, QuickTime</p>
                <p>📏 Maximum size: {maxSize}MB</p>
                <p>⚡ Instant processing</p>
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="video/mp4,video/avi,video/quicktime,video/x-msvideo,video/webm,video/mov,.mov,.mp4,.avi,.webm,.quicktime"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
                multiple={false}
              />
              <label htmlFor="video-upload">
                <Button 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video File
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}