import useJobStats from "./hooks/useJobStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const { stats, weeklyTrends, isLoading, error } = useJobStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center text-lg text-gray-600">
            Loading job statistics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tech Jobs in Malmö/Lund
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Utvecklare</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.utvecklare}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">
                Data Analyst
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.dataAnalyst}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">
                Data Scientist
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.dataScientist}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">
                Total Positions
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.total}
              </dd>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Weekly Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <XAxis
                  dataKey="dateRange"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="utvecklare"
                  stroke="#4f46e5"
                  name="Utvecklare"
                />
                <Line
                  type="monotone"
                  dataKey="dataAnalyst"
                  stroke="#06b6d4"
                  name="Data Analyst"
                />
                <Line
                  type="monotone"
                  dataKey="dataScientist"
                  stroke="#7c3aed"
                  name="Data Scientist"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
