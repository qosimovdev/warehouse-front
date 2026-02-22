import { NavLink } from "react-router-dom";
import { Box, Building2, ShoppingCart, Clock } from "lucide-react";

function BottomNavbar() {
  const linkStyle = ({ isActive }) =>
    `flex flex-col items-center text-xs ${
      isActive ? "text-blue-600" : "text-gray-400"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-2 md:hidden">
      <NavLink to="/" className={linkStyle}>
        <ShoppingCart size={20} />
        Kirim
      </NavLink>

      <NavLink to="/products" className={linkStyle}>
        <Box size={20} />
        Maxsulotlar
      </NavLink>

      <NavLink to="/companies" className={linkStyle}>
        <Building2 size={20} />
        Firma
      </NavLink>

      <NavLink to="/history" className={linkStyle}>
        <Clock size={20} />
        Tarix
      </NavLink>
    </div>
  );
}

export default BottomNavbar;
