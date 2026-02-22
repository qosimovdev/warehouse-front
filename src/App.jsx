// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./auth/Login";
// import Products from "./pages/Products";
// import Companies from "./pages/Companies";
// import Purchases from "./pages/Purchases";
// import History from "./pages/History";
// import BottomNavbar from "./layout/BottomNavbar";
// import { AuthProvider } from "./auth/AuthProvider";
// import { useAuth } from "./auth/auth";
// import Header from "./components/Header";

// function PrivateRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Header />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/products"
//             element={
//               <PrivateRoute>
//                 <Products />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/companies"
//             element={
//               <PrivateRoute>
//                 <Companies />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/purchases"
//             element={
//               <PrivateRoute>
//                 <Purchases />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/history"
//             element={
//               <PrivateRoute>
//                 <History />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//         <BottomNavbar />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Products from "./pages/Products";
import Companies from "./pages/Companies";
import Purchases from "./pages/Purchases";
import History from "./pages/History";
import BottomNavbar from "./layout/BottomNavbar";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/auth";
import Header from "./components/Header";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

// alohida komponent ichida useAuth() chaqiramiz
function AppContent() {
  const { user } = useAuth(); // endi ishlaydi

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <PrivateRoute>
              <Purchases />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
      </Routes>

      {user && <BottomNavbar />}
    </>
  );
}

export default App;
