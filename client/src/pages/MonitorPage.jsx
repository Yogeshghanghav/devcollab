import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats, fetchAlerts } from "../features/monitor/monitorSlice";

import StatCard from "../components/ui/StatCard";
import MonitorCharts from "../components/monitor/MonitorCharts";
import LogsTable from "../components/monitor/LogsTable";
import AlertsPanel from "../components/monitor/AlertsPanel";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

const TABS = ["Overview", "Logs", "Alerts"];

export default function MonitorPage() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector((s) => s.monitor);

  const [tab, setTab] = useState("Overview");

  const load = () => {
    dispatch(fetchStats());
    dispatch(fetchAlerts());
  };

  useEffect(() => {
    load();
  }, [dispatch]);

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#6c63ff22,transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-semibold font-display text-white">
              API Monitoring
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time performance & health tracking
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            label="Requests (24h)"
            value={stats?.summary.total24h?.toLocaleString()}
            loading={statsLoading}
          />

          <StatCard
            label="Errors (24h)"
            value={stats?.summary.errors24h?.toLocaleString()}
            loading={statsLoading}
          />

          <StatCard
            label="Error Rate"
            value={
              stats?.summary.errorRate24h != null
                ? `${stats.summary.errorRate24h}%`
                : undefined
            }
            loading={statsLoading}
            accent={stats?.summary.errorRate24h > 10}
          />

          <StatCard
            label="Avg Response"
            value={
              stats?.summary.avgResponseTime != null
                ? `${stats.summary.avgResponseTime}ms`
                : undefined
            }
            loading={statsLoading}
          />
        </div>
        <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl w-fit">

          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-lg transition-all
                ${
                  tab === t
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl animate-fade-in">

          {tab === "Overview" && <MonitorCharts />}
          {tab === "Logs" && <LogsTable />}
          {tab === "Alerts" && <AlertsPanel />}

        </div>

      </div>
    </div>
  );
}
