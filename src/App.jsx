import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const Login = lazy(() => import("./auth/Login"));
const Products = lazy(() => import("./pages/Products"));
const Companies = lazy(() => import("./pages/Companies"));
const Purchases = lazy(() => import("./pages/Purchases"));
const History = lazy(() => import("./pages/History"));
const BottomNavbar = lazy(() => import("./layout/BottomNavbar"));
const Header = lazy(() => import("./components/Header"));
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/auth";
import "./assets/css/index.css";

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

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <Suspense fallback={null}>{user && <Header />}</Suspense>
      <main className="min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                user ? <Navigate to="/products" /> : <Navigate to="/login" />
              }
            />
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
        </Suspense>
      </main>
      <Suspense fallback={null}>{user && <BottomNavbar />}</Suspense>
    </>
  );
}

export default App;
