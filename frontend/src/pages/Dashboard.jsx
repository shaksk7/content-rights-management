import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchContent } from "@/store/contentSlice"
import { fetchRights } from "@/store/rightsSlice"
import { fetchExpiring } from "@/store/reportsSlice"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/Loader"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { items: content } = useSelector((state) => state.content)
  const { items: rights } = useSelector((state) => state.rights)
  const { expiring, loading } = useSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchContent())
    dispatch(fetchRights())
    dispatch(fetchExpiring(30))
  }, [])

  const stats = [
    {
      label: "Total Content",
      value: content.length,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Total Rights",
      value: rights.length,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Expiring Soon",
      value: expiring?.total || 0,
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody>
              <div className={`inline-flex p-3 rounded-lg ${stat.bg} mb-3`}>
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Expiring Rights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Rights Expiring in 30 Days</h2>
            <Badge variant="warning">{expiring?.total || 0} expiring</Badge>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loader />
          ) : expiring?.rights?.length === 0 ? (
            <p className="text-gray-500 text-sm">No rights expiring soon.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Content ID</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Licensee</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Territory</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {expiring?.rights?.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50">
                      <td className="py-3">{r.content_id}</td>
                      <td className="py-3">{r.licensee}</td>
                      <td className="py-3">{r.territory}</td>
                      <td className="py-3">
                        <Badge variant="warning">{r.end_date}</Badge>
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