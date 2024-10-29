import { useState, useEffect } from "react";

const DataExplorer = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://links.api.jobtechdev.se/joblinks?q=remote&limit=2")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Job Data</h2>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DataExplorer;
