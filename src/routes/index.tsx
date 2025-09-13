import {createFileRoute,  useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  navigate({ to: '/flow-balance' })
  return (
    <div className="px-2 font-bold text-xl">
      <p>Loading</p>
    </div>
  )
  }
