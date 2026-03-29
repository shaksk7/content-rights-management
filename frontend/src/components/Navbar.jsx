import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/authSlice"
import { Button } from "@/components/ui/Button"

export function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-bold text-primary">
            Rights Manager
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/content"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Content
            </Link>
            <Link
              to="/rights"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Rights
            </Link>
            <Link
              to="/reports"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Reports
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500">
              {user.username}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}