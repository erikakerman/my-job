// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobListPage from "./pages/ListPage/JobListPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">MyJob</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<JobListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
