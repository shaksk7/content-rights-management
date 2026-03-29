import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { login, clearError } from "@/store/authSlice"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardBody } from "@/components/ui/Card"

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: "", password: "" })

  // Handle redirect when token exists
  useEffect(() => {
    if (token) navigate("/")
  }, [token])

  // Clear error only on unmount
  useEffect(() => {
    return () => dispatch(clearError())
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Rights Manager</h1>
          <p className="text-gray-500 mt-2">Content Rights Management Platform</p>
        </div>
        <Card>
          <CardBody className="p-8">
            <h2 className="text-xl font-semibold mb-6">Sign In</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center mt-2"
              >
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}