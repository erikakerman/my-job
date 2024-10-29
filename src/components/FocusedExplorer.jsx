import { useState, useEffect } from "react";

const FocusedExplorer = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://links.api.jobtechdev.se/joblinks?limit=5")
      .then((res) => res.json())
      .then((fetchedData) => {
        console.log("Fetched data:", fetchedData);
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalJobs = data?.total ? String(data.total) : "0";

  return (
    <div className="p-4">
      <div className="mb-4">Total Jobs: {totalJobs}</div>
      <div className="space-y-4">
        {data?.hits?.map((job) => (
          <div key={job.id} className="p-4 border rounded">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Occupation: </span>
                {job.occupation_group?.label || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Municipality: </span>
                {job.workplace_addresses?.[0]?.municipality || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Source: </span>
                {job.source_links?.[0]?.url || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Published: </span>
                {job.publication_date || "Not specified"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FocusedExplorer;
