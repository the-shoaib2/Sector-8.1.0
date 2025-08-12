import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

interface UseProfileImageProps {
  initialImage?: string | null
  onImageUpdate?: (imageUrl: string) => void
  lazyLoad?: boolean
}

interface UseProfileImageReturn {
  image: string | null
  isLoading: boolean
  isLoaded: boolean
  updateImage: (imageUrl: string) => Promise<void>
  getInitials: (name?: string | null) => string
  removeImage: () => Promise<void>
}

const isValidImageUrl = (url: string | null): boolean => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function useProfileImage({ 
  initialImage = null, 
  onImageUpdate,
  lazyLoad = true
}: UseProfileImageProps = {}): UseProfileImageReturn {
  const [image, setImage] = useState<string | null>(initialImage)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (initialImage && lazyLoad) {
      if (!isValidImageUrl(initialImage)) {
        setIsLoaded(true)
        setImage(null)
        return
      }

      const img = new Image()
      img.src = initialImage
      
      img.onload = () => {
        setIsLoaded(true)
        setImage(initialImage)
      }
      
      img.onerror = () => {
        setIsLoaded(true)
        setImage(null)
      }
    } else {
      setIsLoaded(true)
    }
  }, [initialImage, lazyLoad])

  const updateImage = async (imageUrl: string) => {
    setIsLoading(true)
    setIsLoaded(false)
    try {
      if (!isValidImageUrl(imageUrl)) {
        throw new Error("Invalid image URL format")
      }

      // Preload image
      if (lazyLoad) {
        const img = new Image()
        img.src = imageUrl
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error("Failed to load image"))
        })
      }

      // Update the image state
      setImage(imageUrl)
      setIsLoaded(true)
      
      // Call the callback if provided
      if (onImageUpdate) {
        onImageUpdate(imageUrl)
      }

      toast.success("Profile image updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load image. Please try a different image URL.")
      setImage(null)
      setIsLoaded(true)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = async () => {
    setIsLoading(true)
    try {
      setImage(null)
      setIsLoaded(true)
      
      // Call the callback if provided
      if (onImageUpdate) {
        onImageUpdate("")
      }

      toast.success("Profile image removed successfully")
    } catch (error) {
      toast.error("Failed to remove profile image")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name?: string | null): string => {
    if (!name) return "U"
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return {
    image,
    isLoading,
    isLoaded,
    updateImage,
    getInitials,
    removeImage
  }
} 