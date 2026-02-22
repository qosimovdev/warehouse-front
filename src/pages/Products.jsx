import { useEffect, useState } from "react";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/product");
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await API.post("/product", { name: name.trim() });
      setName("");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to add product");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="New product"
        />
        <button
          onClick={addProduct}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p._id}
            className="flex justify-between items-center bg-white p-2 rounded shadow border-2 border-gray-300"
          >
            <span>{p.name}</span>
            <span className="text-gray-500 text-sm">
              Stock: {p.stock} | Avg Price: {p.averagePrice}
            </span>
          </li>
        ))}
      </ul>

      {products.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No products found.</p>
      )}
    </div>
  );
}

export default Products;
