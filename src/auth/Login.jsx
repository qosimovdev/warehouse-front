// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await API.post(
//         "/auth/login",
//         { email: email.trim(), password: password.trim() },
//         { headers: { "Content-Type": "application/json" } },
//       );
//       console.log("Login response:", res.data);
//       const token = res.data.accessToken;
//       if (!token) throw new Error("Token not received");
//       localStorage.setItem("token", token);
//       API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       navigate("/purchases");
//     } catch (err) {
//       console.error(err);
//       setError("Login failed. Check your email and password.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6">Warehouse Login</h2>
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
//         <input
//           type="text"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           required
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;
// Login.jsx
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      if (!res.data.accessToken) {
        alert("Token not received");
        return;
      }

      login(res.data.accessToken, res.data.user);
      navigate("/purchases");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your email and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Warehouse Login</h2>

        <input
          type="text"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
