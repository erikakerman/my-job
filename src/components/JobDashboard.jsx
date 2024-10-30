import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Briefcase, TrendingUp, Users, Building2 } from "lucide-react";

const JobDashboard = ({ jobs, onFilterChange }) => {
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    topEmployers: [],
    jobsByField: [],
    locationStats: [],
  });

  const [selectedField, setSelectedField] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    if (jobs) {
      // Calculate dashboard metrics
      const employerCounts = {};
      const fieldCounts = {};
      const locationCounts = {};

      jobs.forEach((job) => {
        // Count by employer
        const employer = job.employer || "Unknown";
        employerCounts[employer] = (employerCounts[employer] || 0) + 1;

        // Count by field
        const field = job["occupation-field"] || "Other";
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;

        // Count by location
        const location = job.municipality || "Unknown";
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });

      // Transform data for charts
      const topEmployers = Object.entries(employerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const jobsByField = Object.entries(fieldCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      const locationStats = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setMetrics({
        totalJobs: jobs.length,
        topEmployers,
        jobsByField,
        locationStats,
      });
    }
  }, [jobs]);

  const handleFieldChange = (event) => {
    const field = event.target.value;
    setSelectedField(field);
    onFilterChange({ occupationField: field, region: selectedRegion });
  };

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    onFilterChange({ occupationField: selectedField, region });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation Field
            </label>
            <select
              value={selectedField}
              onChange={handleFieldChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Fields</option>
              {metrics.jobsByField.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Regions</option>
              {metrics.locationStats.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Total Jobs
            </span>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{metrics.totalJobs}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Top Field</span>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.jobsByField[0]?.name || "N/A"}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Top Location
            </span>
            <Building2 className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.locationStats[0]?.name || "N/A"}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Top Employer
            </span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">
            {metrics.topEmployers[0]?.name || "N/A"}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Jobs by Field</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.jobsByField}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Jobs by Location</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.locationStats}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

JobDashboard.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      employer: PropTypes.string,
      "occupation-field": PropTypes.string,
      municipality: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onFilterChange: PropTypes.func,
};

JobDashboard.defaultProps = {
  jobs: [],
  onFilterChange: () => {},
};

export default JobDashboard;
