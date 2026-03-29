import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchExpiring, fetchByTerritory } from "@/store/reportsSlice"
import { Card, CardHeader, CardBody } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader } from "@/components/Loader"

export default function Reports() {
  const dispatch = useDispatch()
  const { expiring, byTerritory, loading } = useSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchExpiring(30))
    dispatch(fetchByTerritory())
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Rights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Expiring in 30 Days</h2>
              <Badge variant="warning">{expiring?.total || 0}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? <Loader /> : expiring?.rights?.length === 0 ? (
              <p className="text-gray-500 text-sm">No rights expiring soon.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {expiring?.rights?.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div>
                      <p className="font-medium text-sm">{r.licensee}</p>
                      <p className="text-xs text-gray-500">{r.territory}</p>
                    </div>
                    <Badge variant="warning">{r.end_date}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* By Territory */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Rights by Territory</h2>
          </CardHeader>
          <CardBody>
            {loading ? <Loader /> : byTerritory?.data?.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {byTerritory?.data?.map((item) => (
                  <div key={item.territory} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="font-medium text-sm">{item.territory}</p>
                    <Badge variant="default">{item.total_rights} rights</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}