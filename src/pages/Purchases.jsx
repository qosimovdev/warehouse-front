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
  const addPurchase = async () => {
    if (!company || !product || !quantity || !price) return;

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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price per unit"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Paid"
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={addPurchase}
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-1"
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      {/* Purchases list  */}
      <ul className="space-y-3">
        {purchases.map((p) => {
          const debt = p.debt || 0;

          //   Format numbers with commas
          const formatNumber = (num) => Number(num).toLocaleString();

          return (
            <li
              key={p._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow"
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
