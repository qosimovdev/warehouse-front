// Header.jsx
import { useAuth } from "../auth/auth";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 shadow-md">
      <h1 className="text-xl font-bold">Warehouse System</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.fullName}</span>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
