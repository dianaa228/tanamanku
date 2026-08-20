import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import ApiModeBadge from './components/ui/ApiModeBadge'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ApiModeBadge />
    </>
  )
}
