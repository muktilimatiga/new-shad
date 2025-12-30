import { createFileRoute } from '@tanstack/react-router'
import { Launcher } from './launcer'
import { Toaster } from 'sonner'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <Toaster richColors />
      <Launcher />
    </>
  )
}
