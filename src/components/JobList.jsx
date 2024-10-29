// src/components/JobList/JobList.jsx
import PropTypes from "prop-types";
import JobCard from "../JobCard/JobCard";
import { Briefcase } from "lucide-react";

const JobList = ({ jobs }) => {
  if (!jobs.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg text-gray-500">
          No jobs found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      occupation: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default JobList;
