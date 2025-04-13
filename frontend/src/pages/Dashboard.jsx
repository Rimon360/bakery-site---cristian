import {NavLink} from "react-router-dom";
import {Routes, Route, useNavigate} from "react-router-dom";
import Products from "./Products.jsx";
import NotFound from "./NotFound.jsx";
import Users from "./Users.jsx";
import Shops from "./Shops.jsx";
import {CiUser} from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
function Dashboard() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    nav("/login");
  };

  return (
    <section className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <ul className="space-y-1">
          <li>
            <NavLink to={"/dashboard/users"} className={({isActive}) => (isActive ? "text-orange-400 bg-[#0005]" : "")}>
              <FaUser /> Users
            </NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard/shops"} className={({isActive}) => (isActive ? "text-orange-400 bg-[#0005]" : "")}>
              <FaListUl /> Shops
            </NavLink>
          </li>
        </ul>
        <button onClick={logout} className="w-full flex items-center gap-2 mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
          Logout <FiLogOut />
        </button>
      </aside>

      <section className="right-section flex-1 p-4 bg-gray-50">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  );
}

export default Dashboard;
