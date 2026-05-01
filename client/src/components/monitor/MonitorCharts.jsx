import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useSelector } from 'react-redux'
import Spinner from '../ui/Spinner'

const COLORS = ['#22c55e','#ef4444','#f59e0b','#6c63ff']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-overlay border border-bg-border rounded-lg px-3 py-2 text-xs shadow-deep">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(p.name === 'avgTime' ? 0 : 0) : p.value}{p.name === 'avgTime' ? 'ms' : ''}</p>
      ))}
    </div>
  )
}

export default function MonitorCharts() {
  const { stats, statsLoading } = useSelector(s => s.monitor)

  if (statsLoading || !stats) {
    return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  }

  // Format daily data
  const dailyData = (stats.dailyData || []).map(d => ({
    label: `${d._id.month}/${d._id.day}`,
    requests: d.count,
    errors:   d.errors,
    avgTime:  Math.round(d.avgTime || 0),
  }))

  // Format hourly data
  const hourlyData = (stats.hourlyData || []).map(d => ({
    label:   `${d._id}:00`,
    requests: d.count,
    errors:   d.errors,
  }))

  // Status distribution
  const statusData = (stats.statusDist || []).map(s => ({
    name:  s._id,
    value: s.count,
  }))

  // Slow endpoints
  const slowData = (stats.slowEndpoints || []).map(e => ({
    name:    `${e._id.method} ${e._id.path}`,
    avgTime: Math.round(e.avgTime),
    count:   e.count,
  }))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Daily traffic */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Requests — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#272b35" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="requests" name="Requests" stroke="#6c63ff" fill="url(#reqGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="errors"   name="Errors"   stroke="#ef4444" fill="url(#errGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Traffic by Hour (Today)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hourlyData}>
            <CartesianGrid stroke="#272b35" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: '#8b92a8', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="requests" name="Requests" fill="#6c63ff" radius={[3,3,0,0]} />
            <Bar dataKey="errors"   name="Errors"   fill="#ef4444" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status distribution */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Status Code Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
              {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#8b92a8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Slowest endpoints */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Slowest Endpoints (avg ms)</h3>
        {slowData.length === 0
          ? <p className="text-text-muted text-sm py-8 text-center">No data yet</p>
          : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={slowData} layout="vertical">
              <CartesianGrid stroke="#272b35" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8b92a8', fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgTime" name="avgTime" fill="#f59e0b" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
