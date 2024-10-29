import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { searchJobs } from "../services/api";

const DataAnalyzer = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataAnalysis, setDataAnalysis] = useState({
    fieldPresence: {},
    fieldTypes: {},
    sampleValues: {},
    uniqueValues: {},
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await searchJobs({});
        console.log("API Response:", response); // For debugging
        setJobs(response.hits || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      // Analyze data structure and content
      const analysis = {
        fieldPresence: {},
        fieldTypes: {},
        sampleValues: {},
        uniqueValues: {},
        arrayFields: new Set(),
        totalJobs: jobs.length,
      };

      // Analyze each job posting
      jobs.forEach((job) => {
        // Track which fields are present and their types
        Object.entries(job).forEach(([field, value]) => {
          // Track field presence
          analysis.fieldPresence[field] =
            (analysis.fieldPresence[field] || 0) + 1;

          // Track field types
          const type = Array.isArray(value) ? "array" : typeof value;
          if (!analysis.fieldTypes[field]) {
            analysis.fieldTypes[field] = new Set();
          }
          analysis.fieldTypes[field].add(type);

          // Track unique values (for non-object fields)
          if (type !== "object" && type !== "array") {
            if (!analysis.uniqueValues[field]) {
              analysis.uniqueValues[field] = new Set();
            }
            analysis.uniqueValues[field].add(value);
          }

          // Store sample values
          if (!analysis.sampleValues[field]) {
            analysis.sampleValues[field] = value;
          }
        });
      });

      // Convert Sets to arrays for rendering
      Object.keys(analysis.fieldTypes).forEach((field) => {
        analysis.fieldTypes[field] = Array.from(analysis.fieldTypes[field]);
      });
      Object.keys(analysis.uniqueValues).forEach((field) => {
        analysis.uniqueValues[field] = Array.from(analysis.uniqueValues[field]);
      });

      setDataAnalysis(analysis);
    }
  }, [jobs]);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  // Prepare data for visualization
  const fieldPresenceData = Object.entries(dataAnalysis.fieldPresence)
    .map(([field, count]) => ({
      field,
      count,
      percentage: ((count / jobs.length) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">API Data Analysis</h2>

      {/* Sample Size Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Dataset Overview</h3>
        <p className="text-gray-600">Analyzing {jobs.length} job listings</p>
      </div>

      {/* Field Presence Analysis */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Field Presence Analysis</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fieldPresenceData}>
              <XAxis
                dataKey="field"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-semibold">{data.field}</p>
                      <p>Present in: {data.count} listings</p>
                      <p>Percentage: {data.percentage}%</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field Details Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Field Analysis</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Field Name</th>
              <th className="px-4 py-2 text-left">Presence</th>
              <th className="px-4 py-2 text-left">Types</th>
              <th className="px-4 py-2 text-left">Unique Values</th>
              <th className="px-4 py-2 text-left">Sample Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dataAnalysis.fieldPresence).map((field) => (
              <tr key={field} className="border-t">
                <td className="px-4 py-2 font-medium">{field}</td>
                <td className="px-4 py-2">
                  {dataAnalysis.fieldPresence[field]}(
                  {(
                    (dataAnalysis.fieldPresence[field] / jobs.length) *
                    100
                  ).toFixed(1)}
                  %)
                </td>
                <td className="px-4 py-2">
                  {dataAnalysis.fieldTypes[field]?.join(", ")}
                </td>
                <td className="px-4 py-2">
                  {dataAnalysis.uniqueValues[field]?.length || "N/A"}
                </td>
                <td className="px-4 py-2 max-w-xs truncate">
                  {JSON.stringify(dataAnalysis.sampleValues[field])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raw Data Example */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">
          Sample Job Listing Structure
        </h3>
        <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify(jobs[0], null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DataAnalyzer;
