import { useEffect, useState } from "react";
import API from "../api/axios";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all purchases
  const fetchPurchases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/purchase");
      setPurchases(Array.isArray(res.data.purchases) ? res.data.purchases : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompaniesAndProducts = async () => {
    try {
      const [companyRes, productRes] = await Promise.all([
        API.get("/company"),
        API.get("/product"),
      ]);
      setCompanies(
        Array.isArray(companyRes.data.companies)
          ? companyRes.data.companies
          : [],
      );
      setProducts(
        Array.isArray(productRes.data.products) ? productRes.data.products : [],
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load companies or products");
    }
  };

  // Add new purchase
  const addPurchase = async (e) => {
    if (!company || !product || !quantity || !price) return;
    setLoading(true);
    e.preventDefault();

    try {
      await API.post("/purchase", {
        company,
        product,
        quantity: Number(quantity),
        price: Number(price),
        paid: Number(paid) || 0,
      });
      // Reset form
      setCompany("");
      setProduct("");
      setQuantity("");
      setPrice("");
      setPaid("");
      fetchPurchases();
    } catch (err) {
      console.error(err);
      setError("Failed to add purchase");
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchCompaniesAndProducts();
  }, []);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Purchases</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 ">
        {/* Company */}
        <div className="flex flex-col">
          <label
            htmlFor="company"
            className="text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <select
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="flex flex-col">
          <label
            htmlFor="product"
            className="text-sm font-medium text-gray-700"
          >
            Product
          </label>
          <select
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price per unit
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Paid */}
        <div className="flex flex-col">
          <label htmlFor="paid" className="text-sm font-medium text-gray-700">
            Paid
          </label>
          <input
            id="paid"
            type="number"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            type="submit"
            onClick={addPurchase}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      {/* Purchases list  */}
      <ul className="space-y-3">
        {purchases.map((p) => {
          const debt = p.debt || 0;
          const formatNumber = (num) => Number(num).toLocaleString();
          return (
            <li
              key={p._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow border-2 border-gray-300"
            >
              {/* Company & Product */}
              <div className="font-semibold text-lg mb-2 md:mb-0">
                {p.company?.name || p.company} - {p.product?.name || p.product}
              </div>

              {/* Qty, Price, Total, Paid, Debt */}
              <div className="text-gray-700 text-base mb-2 md:mb-0">
                Qty:{" "}
                <span className="font-medium">{formatNumber(p.quantity)}</span>{" "}
                | Price:{" "}
                <span className="font-medium">{formatNumber(p.price)}</span> |{" "}
                Total:{" "}
                <span className="font-medium">{formatNumber(p.total)}</span> |{" "}
                Paid:{" "}
                <span className="font-medium">{formatNumber(p.paid)}</span> |{" "}
                Debt:{" "}
                <span
                  className={
                    debt > 0
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {formatNumber(debt)}
                </span>
              </div>

              {/* Date */}
              <div className="text-gray-500 text-base md:ml-4 mt-1 md:mt-0">
                {new Date(p.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </li>
          );
        })}
      </ul>

      {purchases.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No purchases found.</p>
      )}
    </div>
  );
}

export default Purchases;
