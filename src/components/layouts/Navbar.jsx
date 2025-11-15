import { IoIosLogOut } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { useEffect, useState } from "react";
import { NavbarMenu } from "../../data/menu";
import ResponsiveMenu from "./ResponsiveMenu";
import Modal from "../modals/Modal";
import { AiTwotoneGold } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { CgProfile } from "react-icons/cg";
import { Card, Button, Input } from "antd";

const Navbar = ({
  onGlobalSearchChangeHandler = () => {},
  visibility = false,
}) => {
  const [adminName, setAdminName] = useState("");
  const [onload, setOnload] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnload(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    try {
      const usr = localStorage.getItem("user");
      if (usr) {
        const admin = JSON.parse(usr);
        setAdminName(admin?.admin_name || "Super Admin");
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-amber-200 via-white to-yellow-200 shadow-xl border-b border-amber-100">
        <div
          className={`
            flex justify-between items-center py-4 px-10
            transition-all duration-700 ease-out transform
            ${onload ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"}
          `}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-full p-2">
                <AiTwotoneGold className="text-4xl text-amber-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">My</h1>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">Chits</h1>
              <h1 className="text-xl font-bold text-amber-500 ml-2 tracking-wide">Gold</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <GlobalSearchBar
                onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
                visibility={visibility}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {[
              { to: "/reports/group-report", label: "Group Report" },
              { to: "/reports/daybook", label: "Day Book" },
              { to: "/reports/receipt", label: "Receipt Report" },
              { to: "/reports/user-report", label: "Customer Report" },
              { to: "/reports/employee-report", label: "Employee Report" },
              { to: "/reports/lead-report", label: "Lead Report" }
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group
                  ${isActive 
                    ? 'text-white shadow-lg transform scale-105' 
                    : 'text-amber-800 hover:text-amber-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"></div>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-8">
            {/* Notifications */}
            <button className="relative group p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md">
              <IoIosNotifications className="text-xl text-amber-700 group-hover:text-amber-800" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-md border border-amber-200 hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <CgProfile className="relative text-2xl text-amber-600" />
              </div>
              <span className="text-sm font-bold text-gray-800">{adminName}</span>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="group relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <IoIosLogOut className="text-xl" />
            </button>

            {/* Mobile Menu */}
            <button 
              className="md:hidden p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all duration-300"
              onClick={() => setOpen(!open)}
            >
              <MdMenu className="text-2xl text-amber-700" />
            </button>
          </div>
        </div>
      </nav>

      <ResponsiveMenu open={open} menu={NavbarMenu} />
      
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="py-8 px-10 bg-gradient-to-br from-amber-50 via-white to-yellow-50 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <AiTwotoneGold className="text-2xl text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
              Business Management
            </h3>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-lg">Grocery Shop</span>
                  <p className="text-sm text-gray-500">Active Business</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-md">
                  Active
                </span>
              </div>
            </div>

            <div className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-lg">Shoe Shop</span>
                  <p className="text-sm text-gray-500">Inactive Business</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105">
                Switch
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-amber-200">
            <h4 className="text-lg font-bold text-amber-800 mb-5 flex items-center gap-2">
              <span className="text-2xl">+</span> Add New Business
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter business name"
                className="w-full px-5 py-3.5 bg-white border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 placeholder-gray-400 font-medium transition-all duration-300"
              />
              <button className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Add Business
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;