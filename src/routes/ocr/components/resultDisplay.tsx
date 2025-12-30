import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ocr/components/resultDisplay')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ocr/components/resultDisplay"!</div>
}
import React, { useState } from 'react'
import { Copy, Check, FileText, Loader2, RefreshCw } from 'lucide-react'

interface ResultDisplayProps {
  result: string
  loading: boolean
  progressStatus?: string
  progressValue?: number
  onCopy: () => void
  onRetry?: () => void
  error?: string | null
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  loading,
  progressStatus = 'Processing...',
  progressValue = 0,
  onCopy,
  onRetry,
  error,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-destructive/5 rounded-xl border border-destructive/20 text-center">
        <div className="p-3 bg-destructive/10 rounded-full text-destructive mb-4">
          <FileText size={24} />
        </div>
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Analysis Failed
        </h3>
        <p className="text-destructive dark:text-destructive/80 mb-6 max-w-sm">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/10 transition-colors shadow-sm font-medium"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    const percentage = Math.round(progressValue * 100)

    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-card rounded-xl border border-border shadow-sm">
        <div className="animate-spin text-primary mb-6">
          <Loader2 size={40} />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {progressStatus}
        </h3>

        <div className="w-full max-w-xs bg-muted rounded-full h-2.5 mb-2 overflow-hidden">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-muted-foreground text-sm font-mono">{percentage}%</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-muted/40 rounded-xl border border-dashed border-border text-center">
        <div className="p-3 bg-muted rounded-full text-muted-foreground mb-4">
          <FileText size={24} />
        </div>
        <p className="text-muted-foreground">
          Upload an image to see the extracted text here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          Result
        </h3>
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all
            ${
              copied
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            }
          `}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="flex-1 p-6 overflow-auto max-h-[500px]">
        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-card-foreground whitespace-pre-wrap font-mono text-sm">
          {result}
        </div>
      </div>
    </div>
  )
}
