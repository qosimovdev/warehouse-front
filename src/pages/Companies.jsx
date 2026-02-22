import { useEffect, useState } from "react";
import API from "../api/axios";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/company");
      setCompanies(Array.isArray(res.data.companies) ? res.data.companies : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  // Add new company
  const addCompany = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await API.post("/company", { name: name.trim() });
      setName("");
      fetchCompanies();
    } catch (err) {
      console.error(err);
      setError("Failed to add company");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Companies</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="New company"
        />
        <button
          type="submit"
          onClick={addCompany}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      <ul className="space-y-2">
        {companies.map((c) => (
          <li
            key={c._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-2 rounded shadow border-2 border-gray-300"
          >
            <div className="font-medium">{c.name}</div>
            {c.phone && (
              <div className="text-gray-500 text-sm">Phone: {c.phone}</div>
            )}
            {c.address && (
              <div className="text-gray-500 text-sm">Address: {c.address}</div>
            )}
          </li>
        ))}
      </ul>

      {companies.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No companies found.</p>
      )}
    </div>
  );
}

export default Companies;
