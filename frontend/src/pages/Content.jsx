import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchContent, createContent, deleteContent } from "@/store/contentSlice"
import { Card, CardHeader, CardBody } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/Loader"

const CONTENT_TYPES = ["MOVIE", "SERIES", "SPORTS", "NEWS"]

const typeVariant = {
  MOVIE: "default",
  SERIES: "success",
  SPORTS: "warning",
  NEWS: "secondary"
}

export default function Content() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.content)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "",
    content_type: "MOVIE",
    genre: "",
    duration_minutes: "",
    description: ""
  })

  useEffect(() => {
    dispatch(fetchContent())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(createContent({
      ...form,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null
    }))
    if (createContent.fulfilled.match(result)) {
      setShowForm(false)
      setForm({ title: "", content_type: "MOVIE", genre: "", duration_minutes: "", description: "" })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Content</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Content"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold">Add New Content</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="Stranger Things"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Content Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.content_type}
                  onChange={(e) => setForm({ ...form, content_type: e.target.value })}
                >
                  {CONTENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Genre"
                placeholder="Sci-Fi"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="120"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" loading={loading}>
                  Add Content
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="font-semibold">All Content ({items.length})</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-sm">No content yet. Add some above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Title</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Genre</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Duration</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium">{item.title}</td>
                      <td className="py-3">
                        <Badge variant={typeVariant[item.content_type]}>
                          {item.content_type}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500">{item.genre || "—"}</td>
                      <td className="py-3 text-gray-500">
                        {item.duration_minutes ? `${item.duration_minutes} min` : "—"}
                      </td>
                      <td className="py-3">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => dispatch(deleteContent(item.id))}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}