// src/pages/ListPage/JobListPage.jsx
import { useState } from "react";
import { Search } from "lucide-react";

const JobListPage = () => {
  const [isWorking, setIsWorking] = useState(false);

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl text-brand-600">MyJob Setup Test</h1>
        <p className="text-gray-600 mt-2">
          If you see this styled text, Tailwind is working!
        </p>
      </div>

      {/* Test Button */}
      <div className="flex gap-2">
        <button
          className="btn-primary"
          onClick={() => setIsWorking(!isWorking)}
        >
          Click to Test
        </button>
        <button className="btn-secondary">Secondary Button</button>
      </div>

      {/* Test Icon */}
      <div className="flex items-center gap-2 text-gray-600">
        <Search className="h-5 w-5" />
        <span>If you see this icon, Lucide React is working!</span>
      </div>

      {/* State Test */}
      {isWorking && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg">
          State management is working!
        </div>
      )}
    </div>
  );
};

export default JobListPage;
