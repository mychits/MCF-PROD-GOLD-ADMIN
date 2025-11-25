import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Icons
import { FaCalendarDays } from "react-icons/fa6";
import { MdOutlineReceiptLong, MdOutlinePayments, MdOutlineEmojiPeople, MdMan, MdCancel } from "react-icons/md";
import { TbMoneybag, TbUserCancel, TbReportSearch, TbGraph, TbGraphFilled } from "react-icons/tb";
import { FaPeopleGroup, FaPeopleArrows, FaUserCheck, FaUserTie, FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill, RiAuctionFill, RiReceiptLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { LiaCalculatorSolid } from "react-icons/lia";
import { GiMoneyStack } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import { BsCalendarDate, BsCalculator } from "react-icons/bs";
import { BiGrid } from "react-icons/bi";
import { TbList } from "react-icons/tb";
import { IoSearchOutline, IoCloseCircle, IoStatsChart } from "react-icons/io5";
import { AiTwotoneGold } from "react-icons/ai";



import { MdOutlinePending } from "react-icons/md";

import { HiOutlineBanknotes } from "react-icons/hi2";


import { MdCalendarMonth } from "react-icons/md";


import { LiaPeopleCarrySolid } from "react-icons/lia";
import { MdPersonOff } from "react-icons/md";

// Keep your full subMenus array exactly as defined
const subMenus = [
  {
    id:"1",
    title: "Daybook",
    link: "/reports/daybook",
    Icon: FaCalendarDays,
    category: "Reports",
    color: "from-blue-500 to-blue-600",
  },
  {
     id:"2",
    title: "Receipt Report",
    link: "/reports/receipt",
    Icon: MdOutlineReceiptLong,
    category: "Finance",
    color: "from-green-500 to-green-600",
  },
    {
     id:"&&%",
    title: "Payment Report",
    link: "/reports/payment-report",
    Icon: MdOutlinePayments ,
    category: "Reports",
    color: "from-yellow-500 to-pink-600",
  },
  {
     id:"3",
    title: "Group Report",
    link: "/reports/group-report",
    Icon: FaPeopleGroup,
    category: "Reports",
    color: "from-purple-500 to-purple-600",
  },
  {
     id:"4",
    title: "Enrollment Report",
    link: "/reports/enrollment-report",
    Icon: FaPeopleArrows,
    category: "Customer",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id:"5",
    title: "All Customer Report",
    link: "/reports/all-user-report",
    Icon: FaPersonWalkingArrowLoopLeft,
    category: "Customer",
    color: "from-teal-500 to-teal-600",
  },
  {
    id:"6",
    title: "Customer Report",
    link: "/reports/user-report",
    Icon: MdOutlineEmojiPeople,
    category: "Customer",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id:"7",
    title: "Loan Summary Report",
    link: "/reports/customer-loan-report",
    Icon: GiMoneyStack,
    category: "Customer",
    color: "from-cyan-500 to-cyan-600",
  },
   {
    id:"&*DD",
    title: "Pigmy Summary Report",
    link: "/reports/pigmy-summary-report",
    Icon: BsCalculator ,
    category: "Customer",
    color: "from-blue-500 to-blue-600",
  },
  {
    id:"8",
    title: "Holded Customers",
    link: "/reports/holded-customer-report",
    Icon: TbUserCancel,
    category: "Customer",
    color: "from-red-500 to-red-600",
  },
  {
    id:"9",
    title: "Collection Executive Report",
    link: "/reports/collection-executive",
    Icon: TbMoneybag,
    category: "Finance",
    color: "from-green-500 to-green-600",
  },
  {
    id:"10",
    title: "Collection Area Report",
    link: "/reports/collection-area-report",
    Icon: TbMoneybag,
    category: "Customer",
    color: "from-green-500 to-green-600",
  },
  {
    id:"11",
    title: "Employee Report",
    link: "/reports/employee-report",
    Icon: FaUserTie,
    category: "Employee",
    color: "from-indigo-500 to-indigo-600",
  },
 
  {
     id:"13",
    title: "Registration Receipt",
    link: "/reports/registration-fee-receipt",
    Icon: RiReceiptLine,
    category: "Finance",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id:"14",
    title: "PayOut Report",
    link: "/reports/payout",
    Icon: MdOutlinePayment,
    category: "Finance",
    color: "from-green-500 to-green-600",
  },
  {
    id:"15",
    title: "Outstanding Report",
    link: "/reports/outstanding-report",
    Icon: MdOutlinePending,
    category: "Finance",
    color: "from-orange-500 to-orange-600",
  },
  {
     id:"16",
    title: "Auction Report",
    link: "/reports/auction-report",
    Icon: RiAuctionFill,
    category: "Reports",
    color: "from-pink-500 to-pink-600",
  },
 
  {
     id:"17",
    title: "All Lead Report",
    link: "/reports/lead-report",
    Icon: MdMan,
    category: "Reports",
    color: "from-purple-500 to-purple-600",
  },
     {
    id:"30",
    title: "Non Converted Lead Report",
    link: "/reports/non-converted-lead-report",
    category: "Customer",
   Icon: MdPersonOff,
   color: "from-blue-500 to-blue-600",
  },
    {
    id:"30",
    title: "Converted Lead Report",
    link: "/reports/converted-lead-report",
    category: "Customer",
   Icon: LiaPeopleCarrySolid,
   color: "from-blue-500 to-blue-600",
  },
  {
     id:"18",
    title: "Pigme Report",
    link: "/reports/pigme-report",
    Icon: LiaCalculatorSolid,
    category: "Finance",
    color: "from-yellow-500 to-yellow-600",
  },
  {
     id:"19",
    title: "Loan Report",
    link: "/reports/loan-report",
    Icon: GiMoneyStack,
    category: "Finance",
    color: "from-green-500 to-green-600",
  },
  {
       id:"20",
    title: "Sales Report",
    link: "/reports/sales-report",
    Icon: FaUserCheck,
    category: "Reports",
    color: "from-blue-500 to-blue-600",
  },
  {
     id:"21",
    title: "Payment Summary",
    link: "/reports/payment-summary",
    Icon: TbReportSearch,
    category: "Finance",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id:"22",
    title: "Monthly Installment Turnover",
    link: "/reports/monthly-install-turnover",
    Icon: SlCalender,
    category: "Employee",
    color: "from-blue-500 to-blue-600",
  },
  {
    id:"23",
    title: "Monthly Attendance Report",
    link: "/reports/employee-monthly-report",
    category: "Employee",
    Icon: BsCalendarDate,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id:"24",
    title: "Payout Salary Report",
    link: "/reports/payout-salary-report",
    category: "Employee",
    Icon: HiOutlineBanknotes,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id:"25",
    title: "Commission Report",
    link: "/reports/target-commission",
    category: "Agent",
   Icon: TbGraph,
   color: "from-yellow-500 to-yellow-600",
  },
   {
    id:"26",
    title: "Incentive Report",
    link: "/reports/target-incentive",
    category: "Employee",
   Icon: TbGraphFilled,
   color: "from-indigo-500 to-indigo-600",
  },
    {
    id:"27",
    title: "Unverified Customer Report",
    link: "/reports/unverified-customer-report",
    category: "Customer",
   Icon: MdCancel,
   color: "from-blue-500 to-blue-600",
  },
  //     {
  //   id:"28",
  //   title: "Remaining Salary Report",
  //   link: "/reports/salary-remaining",
  //   category: "Employee",
  //  Icon: MdCancel,
  //  color: "from-blue-500 to-blue-600",
  // },
     {
    id:"29",
    title: "Chit Asking Month Report",
    link: "/reports/chit-asking-month-report",
    category: "Customer",
   Icon: MdCalendarMonth,
   color: "from-blue-500 to-blue-600",
  },
  
];

const categories = ["All", "Reports", "Customer", "Agent", "Employee", "Finance"];

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [notRendered, setNotRendered] = useState(true);
  const [loading, setLoading] = useState(true);

  // Simulate initial load (like Home)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setNotRendered(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredMenus = subMenus
    .filter((menu) => activeCategory === "All" || menu.category === activeCategory)
    .filter((menu) =>
      menu.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleClearSearch = () => setSearchQuery("");

  // Skeleton for loading state
  const SkeletonCard = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[180px] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  // Render only when at /reports (dashboard view)
  if (location.pathname === "/reports") {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-auto mt-20 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-30"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 shadow-lg">
                      <IoStatsChart className="text-3xl text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                      Reports Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                      Browse, search, and access all financial and operational reports
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-3xl mt-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoSearchOutline className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 text-base bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <IoCloseCircle className="text-2xl" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 mb-6 justify-end">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewType === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                  title="Grid View"
                >
                  <BiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewType === "list"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                  title="List View"
                >
                  <TbList size={18} />
                </button>
              </div>

              {/* No Results */}
              {!loading && filteredMenus.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                    <AiTwotoneGold className="text-4xl text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No reports found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter</p>
                </div>
              )}

              {/* Grid View */}
              {viewType === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {loading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => <SkeletonCard key={i} />)
                    : filteredMenus.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(item.link)}
                          className={`
                            group relative bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer
                            transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1
                            ${notRendered ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}
                          `}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          {/* Top accent bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} rounded-t-2xl`}></div>

                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br ${item.color}`}
                          >
                            <item.Icon className="text-2xl text-white" />
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2">
                            {item.title}
                          </h3>

                          {/* Hover arrow */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                            <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}

              {/* List View */}
              {viewType === "list" && (
                <div className="space-y-4">
                  {loading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => <SkeletonCard key={i} />)
                    : filteredMenus.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(item.link)}
                          className={`
                            group relative bg-white border border-slate-200 rounded-xl p-5 cursor-pointer
                            transition-all duration-300 shadow-sm hover:shadow-md
                            ${notRendered ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"}
                          `}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow bg-gradient-to-br ${item.color}`}
                            >
                              <item.Icon className="text-xl text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">{item.title}</h3>
                              <p className="text-sm text-slate-500 mt-1">Click to view report</p>
                            </div>
                            <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                              <svg
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render child routes via Outlet
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="mt-20 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Reports;