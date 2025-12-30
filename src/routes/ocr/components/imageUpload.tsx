import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Image as ImageIcon, X, Clipboard } from 'lucide-react'

export interface ImageFile {
  file: File
  previewUrl: string
  base64: string
  mimeType: string
}

interface ImageUploadProps {
  onImageSelected: (image: ImageFile | null) => void
  selectedImage: ImageFile | null
  disabled: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  selectedImage,
  disabled,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // result looks like "data:image/jpeg;base64,..."
        // we need to split it to get the raw base64 and mime type
        const [prefix, base64] = result.split(',')
        const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type

        onImageSelected({
          file,
          previewUrl: result,
          base64,
          mimeType,
        })
      }
      reader.readAsDataURL(file)
    },
    [onImageSelected],
  )

  // Handle global paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return

      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            processFile(file)
            e.preventDefault() // Prevent default paste behavior
            break
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [disabled, processFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageSelected(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (selectedImage) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-muted rounded-xl overflow-hidden border-2 border-border shadow-sm group">
        <img
          src={selectedImage.previewUrl}
          alt="Preview"
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={clearImage}
            disabled={disabled}
            className="p-2 bg-background/90 text-foreground rounded-full shadow-md hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <p className="text-white text-sm truncate font-medium">
            {selectedImage.file.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full h-64 md:h-96 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-input bg-card hover:border-primary hover:bg-muted/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
        <Upload size={32} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Upload an image
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs text-center">
        Drag & drop, paste (Ctrl+V), or click to browse
      </p>
      <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ImageIcon size={14} />
          <span>JPG, PNG, WEBP</span>
        </div>
        <div className="flex items-center gap-1">
          <Clipboard size={14} />
          <span>Paste supported</span>
        </div>
      </div>
    </div>
  )
}
