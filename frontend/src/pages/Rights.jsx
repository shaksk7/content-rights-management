import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchRights, createRights, checkAvailability, clearAvailability } from "@/store/rightsSlice"
import { fetchContent } from "@/store/contentSlice"
import { Card, CardHeader, CardBody } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/Loader"

const PLATFORMS = ["LINEAR_TV", "OTT", "SATELLITE", "ALL"]

export default function Rights() {
  const dispatch = useDispatch()
  const { items, loading, availability } = useSelector((state) => state.rights)
  const { items: content } = useSelector((state) => state.content)
  const [showForm, setShowForm] = useState(false)
  const [showCheck, setShowCheck] = useState(false)
  const [form, setForm] = useState({
    content_id: "",
    licensee: "",
    territory: "",
    platform: "OTT",
    start_date: "",
    end_date: "",
    is_exclusive: false
  })
  const [checkForm, setCheckForm] = useState({
    content_id: "",
    territory: "",
    platform: "OTT",
    check_date: ""
  })

  useEffect(() => {
    dispatch(fetchRights())
    dispatch(fetchContent())
    return () => dispatch(clearAvailability())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(createRights({
      ...form,
      content_id: parseInt(form.content_id)
    }))
    if (createRights.fulfilled.match(result)) {
      setShowForm(false)
      setForm({
        content_id: "", licensee: "", territory: "",
        platform: "OTT", start_date: "", end_date: "", is_exclusive: false
      })
    }
  }

  const handleCheck = (e) => {
    e.preventDefault()
    dispatch(checkAvailability({
      ...checkForm,
      content_id: parseInt(checkForm.content_id)
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rights</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setShowCheck(!showCheck); setShowForm(false) }}>
            Check Availability
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setShowCheck(false) }}>
            {showForm ? "Cancel" : "+ Add Rights"}
          </Button>
        </div>
      </div>

      {/* Availability Check Form */}
      {showCheck && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold">Check Availability</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCheck} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={checkForm.content_id}
                  onChange={(e) => setCheckForm({ ...checkForm, content_id: e.target.value })}
                  required
                >
                  <option value="">Select content</option>
                  {content.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Territory"
                placeholder="India"
                value={checkForm.territory}
                onChange={(e) => setCheckForm({ ...checkForm, territory: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={checkForm.platform}
                  onChange={(e) => setCheckForm({ ...checkForm, platform: e.target.value })}
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Input
                label="Check Date"
                type="date"
                value={checkForm.check_date}
                onChange={(e) => setCheckForm({ ...checkForm, check_date: e.target.value })}
                required
              />
              <div className="md:col-span-2">
                <Button type="submit">Check</Button>
              </div>
            </form>

            {availability && (
              <div className={`mt-4 p-4 rounded-lg ${availability.available ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <p className={`font-medium ${availability.available ? "text-green-700" : "text-red-700"}`}>
                  {availability.available ? "✅ Available" : "❌ Not Available"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {availability.territory} — {availability.platform} — {availability.check_date}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Add Rights Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold">Add New Rights</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.content_id}
                  onChange={(e) => setForm({ ...form, content_id: e.target.value })}
                  required
                >
                  <option value="">Select content</option>
                  {content.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Licensee"
                placeholder="JioSTAR"
                value={form.licensee}
                onChange={(e) => setForm({ ...form, licensee: e.target.value })}
                required
              />
              <Input
                label="Territory"
                placeholder="India"
                value={form.territory}
                onChange={(e) => setForm({ ...form, territory: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Input
                label="Start Date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="exclusive"
                  checked={form.is_exclusive}
                  onChange={(e) => setForm({ ...form, is_exclusive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="exclusive" className="text-sm text-gray-700">
                  Exclusive Rights
                </label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" loading={loading}>Add Rights</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Rights List */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">All Rights ({items.length})</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-sm">No rights yet. Add some above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Content ID</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Licensee</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Territory</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Platform</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Period</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Exclusive</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">{item.content_id}</td>
                      <td className="py-3 font-medium">{item.licensee}</td>
                      <td className="py-3">{item.territory}</td>
                      <td className="py-3">
                        <Badge variant="default">{item.platform}</Badge>
                      </td>
                      <td className="py-3 text-gray-500">
                        {item.start_date} → {item.end_date}
                      </td>
                      <td className="py-3">
                        {item.is_exclusive
                          ? <Badge variant="success">Yes</Badge>
                          : <Badge variant="secondary">No</Badge>
                        }
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