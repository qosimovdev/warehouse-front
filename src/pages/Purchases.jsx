// import { useEffect, useState } from "react";
// import API from "../api/axios";

// function Purchases() {
//   const [purchases, setPurchases] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [company, setCompany] = useState("");
//   const [product, setProduct] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [price, setPrice] = useState("");
//   const [paid, setPaid] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch all purchases
//   const fetchPurchases = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.get("/purchase");
//       setPurchases(Array.isArray(res.data.purchases) ? res.data.purchases : []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load purchases");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCompaniesAndProducts = async () => {
//     try {
//       const [companyRes, productRes] = await Promise.all([
//         API.get("/company"),
//         API.get("/product"),
//       ]);
//       setCompanies(
//         Array.isArray(companyRes.data.companies)
//           ? companyRes.data.companies
//           : [],
//       );
//       setProducts(
//         Array.isArray(productRes.data.products) ? productRes.data.products : [],
//       );
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load companies or products");
//     }
//   };

//   // Add new purchase
//   const addPurchase = async (e) => {
//     if (!company || !product || !quantity || !price) return;
//     setLoading(true);
//     e.preventDefault();

//     try {
//       await API.post("/purchase", {
//         company,
//         product,
//         quantity: Number(quantity),
//         price: Number(price),
//         paid: Number(paid) || 0,
//       });
//       // Reset form
//       setCompany("");
//       setProduct("");
//       setQuantity("");
//       setPrice("");
//       setPaid("");
//       fetchPurchases();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add purchase");
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//     fetchCompaniesAndProducts();
//   }, []);

//   return (
//     <div className="p-4 pb-20">
//       <h1 className="text-xl font-bold mb-4">Purchases</h1>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 ">
//         {/* Company */}
//         <div className="flex flex-col">
//           <label
//             htmlFor="company"
//             className="text-sm font-medium text-gray-700"
//           >
//             Company
//           </label>
//           <select
//             id="company"
//             value={company}
//             onChange={(e) => setCompany(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Company</option>
//             {companies.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Product */}
//         <div className="flex flex-col">
//           <label
//             htmlFor="product"
//             className="text-sm font-medium text-gray-700"
//           >
//             Product
//           </label>
//           <select
//             id="product"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Product</option>
//             {products.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Quantity */}
//         <div className="flex flex-col">
//           <label
//             htmlFor="quantity"
//             className="text-sm font-medium text-gray-700"
//           >
//             Quantity
//           </label>
//           <input
//             id="quantity"
//             type="number"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Price */}
//         <div className="flex flex-col">
//           <label htmlFor="price" className="text-sm font-medium text-gray-700">
//             Price per unit
//           </label>
//           <input
//             id="price"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Paid */}
//         <div className="flex flex-col">
//           <label htmlFor="paid" className="text-sm font-medium text-gray-700">
//             Paid
//           </label>
//           <input
//             id="paid"
//             type="number"
//             value={paid}
//             onChange={(e) => setPaid(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Button */}
//         <div className="flex items-end">
//           <button
//             type="submit"
//             onClick={addPurchase}
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition disabled:opacity-50 cursor-pointer"
//           >
//             {loading ? "Adding..." : "Add"}
//           </button>
//         </div>
//       </div>

//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       {loading && <p className="text-gray-500 mb-2">Loading...</p>}

//       {/* Purchases list  */}
//       <ul className="space-y-3">
//         {purchases.map((p) => {
//           const debt = p.debt || 0;
//           const formatNumber = (num) => Number(num).toLocaleString();
//           return (
//             <li
//               key={p._id}
//               className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow border-2 border-gray-300"
//             >
//               {/* Company & Product */}
//               <div className="font-semibold text-lg mb-2 md:mb-0">
//                 {p.company?.name || p.company} - {p.product?.name || p.product}
//               </div>

//               {/* Qty, Price, Total, Paid, Debt */}
//               <div className="text-gray-700 text-base mb-2 md:mb-0">
//                 Qty:{" "}
//                 <span className="font-medium">{formatNumber(p.quantity)}</span>{" "}
//                 | Price:{" "}
//                 <span className="font-medium">{formatNumber(p.price)}</span> |{" "}
//                 Total:{" "}
//                 <span className="font-medium">{formatNumber(p.total)}</span> |{" "}
//                 Paid:{" "}
//                 <span className="font-medium">{formatNumber(p.paid)}</span> |{" "}
//                 Debt:{" "}
//                 <span
//                   className={
//                     debt > 0
//                       ? "text-red-600 font-bold"
//                       : "text-green-600 font-bold"
//                   }
//                 >
//                   {formatNumber(debt)}
//                 </span>
//               </div>

//               {/* Date */}
//               <div className="text-gray-500 text-base md:ml-4 mt-1 md:mt-0">
//                 {new Date(p.createdAt).toLocaleString("en-US", {
//                   year: "numeric",
//                   month: "2-digit",
//                   day: "2-digit",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                 })}
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       {purchases.length === 0 && !loading && (
//         <p className="text-gray-500 mt-4">No purchases found.</p>
//       )}
//     </div>
//   );
// }

// export default Purchases;
import { useEffect, useState } from "react";
import API from "../api/axios";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  const [company, setCompany] = useState("");
  const [items, setItems] = useState([
    { product: "", quantity: "", price: "" },
  ]);
  const [paid, setPaid] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchPurchases = async () => {
    try {
      const res = await API.get("/purchase");
      setPurchases(res.data.purchases || []);
    } catch {
      setError("Failed to load purchases");
    }
  };

  const fetchCompaniesAndProducts = async () => {
    try {
      const [c, p] = await Promise.all([
        API.get("/company"),
        API.get("/product"),
      ]);
      setCompanies(c.data.companies || []);
      setProducts(p.data.products || []);
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchCompaniesAndProducts();
  }, []);

  // ================= ITEMS =================
  const addItem = () => {
    setItems([...items, { product: "", quantity: "", price: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ================= CALCULATE =================
  const total = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) * Number(item.price) || 0);
  }, 0);

  const paidNum = Number(paid) || 0;
  const debt = total - paidNum;
  const isOverPaid = paidNum > total;

  // ================= ADD PURCHASE =================
  const addPurchase = async (e) => {
    e.preventDefault();

    if (!company || items.length === 0) return;

    if (isOverPaid) {
      setError("❌ Paid amount cannot be greater than total");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/purchase", {
        company,
        paid: paidNum,
        items: items.map((i) => ({
          product: i.product,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      });

      // reset
      setCompany("");
      setItems([{ product: "", quantity: "", price: "" }]);
      setPaid("");

      fetchPurchases();
    } catch {
      setError("Failed to add purchase");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Purchases</h1>

      {/* FORM */}
      <form onSubmit={addPurchase} className="space-y-4">
        {/* COMPANY */}
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* ITEMS */}
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2">
            <select
              value={item.product}
              onChange={(e) =>
                handleItemChange(index, "product", e.target.value)
              }
              className="border p-2 rounded"
            >
              <option value="">Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + Add Product
        </button>

        {/* PAID */}
        <input
          type="number"
          placeholder="Paid"
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* TOTAL */}
        <div>
          <p>
            Total: <b>{total.toLocaleString()}</b>
          </p>
          <p className={debt > 0 ? "text-red-600" : "text-green-600"}>
            Debt: <b>{debt.toLocaleString()}</b>
          </p>

          {isOverPaid && (
            <p className="text-red-600 font-bold">
              ❌ Paid is greater than total
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Adding..." : "Add Purchase"}
        </button>
      </form>

      {/* ERROR */}
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* LIST */}
      <div className="mt-6 space-y-3">
        {purchases.map((p) => (
          <div key={p._id} className="border p-3 rounded bg-white shadow">
            <div className="font-bold">{p.company?.name}</div>

            <div className="mt-2">
              {p.items?.map((item, i) => (
                <div key={i}>
                  {item.product?.name} — {item.quantity} × {item.price}
                </div>
              ))}
            </div>

            <div className="mt-2 text-sm">
              Total: {p.total?.toLocaleString()} | Paid:{" "}
              {p.paid?.toLocaleString()} |{" "}
              <span className={p.debt > 0 ? "text-red-600" : "text-green-600"}>
                Debt: {p.debt?.toLocaleString()}
              </span>
            </div>

            <div className="text-gray-500 text-xs mt-1">
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Purchases;
