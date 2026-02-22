import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchCompaniesAndProducts = useCallback(async () => {
    try {
      const [compRes, prodRes] = await Promise.all([
        API.get("/company"),
        API.get("/product"),
      ]);
      const companiesData = Array.isArray(compRes.data)
        ? compRes.data
        : Object.values(compRes.data);
      const productsData = Array.isArray(prodRes.data)
        ? prodRes.data
        : Object.values(prodRes.data);
      const compMap = {};
      companiesData.forEach((c) => (compMap[c._id] = c.name));
      const prodMap = {};
      productsData.forEach((p) => (prodMap[p._id] = p.name));
    } catch (err) {
      console.error("Failed to load companies/products", err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        type: "PURCHASE",
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      const res = await API.get("/history", { params });
      const data =
        res.data && Array.isArray(res.data.history)
          ? res.data.history
          : Array.isArray(res.data)
            ? res.data
            : [];

      setHistory(data);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate]);

  useEffect(() => {
    const init = async () => {
      await fetchCompaniesAndProducts();
      fetchHistory();
    };
    init();
  }, [fetchHistory, fetchCompaniesAndProducts]);

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const formatCurrency = (value) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const typeColors = { PURCHASE: "bg-green-100 text-green-800" };
  const actionColors = {
    CREATED: "bg-green-200 text-green-900",
    UPDATED: "bg-yellow-200 text-yellow-900",
    DELETED: "bg-red-200 text-red-900",
  };

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Purchase History</h1>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded shadow-sm"
          />
        </div>
      </div>

      {loading && <p className="text-gray-500 mb-4 text-center">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* History Cards */}
      <div className="grid gap-6">
        {history.map((h) => (
          <div
            key={h._id}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition duration-200"
          >
            <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${typeColors[h.type]}`}
                >
                  {h.type}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${actionColors[h.action]}`}
                >
                  {h.action}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                {formatDate(h.date)}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-2">
              <strong>By:</strong> {h.user?.fullName || "Unknown"} (
              {h.user?.role || "N/A"})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-gray-700 text-sm">
              <div>
                <span className="font-medium">Company:</span>{" "}
                {h.newData.company?.name || h.newData.company}
              </div>
              <div>
                <span className="font-medium">Product:</span>{" "}
                {h.newData.product?.name || h.newData.product}
              </div>
              {h.newData?.quantity !== undefined && (
                <div>
                  <strong>Qty:</strong> {h.newData.quantity}
                </div>
              )}
              {h.newData?.price !== undefined && (
                <div>
                  <strong>Price:</strong> {formatCurrency(h.newData.price)}
                </div>
              )}
              {h.newData?.paid !== undefined && (
                <div>
                  <strong>Paid:</strong> {formatCurrency(h.newData.paid)}
                </div>
              )}
              {h.newData?.total !== undefined && (
                <div>
                  <strong>Total:</strong> {formatCurrency(h.newData.total)}
                </div>
              )}
              {h.newData?.debt !== undefined && (
                <div className="text-red-600 font-semibold">
                  <strong>Debt:</strong> {formatCurrency(h.newData.debt)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default History;
