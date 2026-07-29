import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export function Banner() {
  const { user } = useUser()

  if (user) return null

  return (
    <Link
      to="/login"
      className="fixed top-0 left-0 right-0 z-[999] py-2 text-xs text-center font-medium
                 bg-accent/80 text-white backdrop-blur-sm
                 border-b border-accent/20 transition-colors cursor-pointer"
    >
      Inicia sesión para guardar tus notas
    </Link>
  )
}
