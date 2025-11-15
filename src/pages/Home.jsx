import { LiaLayerGroupSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { ImUserTie } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import api from "../instance/TokenInstance";
import { AiTwotoneGold } from "react-icons/ai";
import { IoTrendingUp, IoStatsChart } from "react-icons/io5";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [staff, setStaffs] = useState([]);
  const [employee, setEmployees] = useState([]);
  const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState("0");
  const [searchValue, setSearchValue] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [hidePayment, setHidePayment] = useState(false);
  const [notRendered, setNotRendered] = useState(true);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGroupData = useCallback(async () => {
    try {
      const response = await api.get("/group/get-group-admin");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching group data:", error);
      setGroups([]);
    }
  }, []);

  const fetchAgentData = useCallback(async () => {
    try {
      const response = await api.get("/agent/get");
      setAgents(response.data?.agent || []);
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setAgents([]);
    }
  }, []);

  const fetchStaffData = useCallback(async () => {
    try {
      const response = await api.get("/agent/get-agent");
      setStaffs(response.data || []);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setStaffs([]);
    }
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    try {
      const response = await api.get("/agent/get-employee");
      setEmployees(response.data?.employee || []);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setEmployees([]);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/user/get-user");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUsers([]);
    }
  }, []);

  const fetchTotalAmount = useCallback(async () => {
    try {
      const response = await api.get("/payment/get-total-payment-amount");
      setTotalAmount(response?.data?.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching total amount:", error);
      setTotalAmount(0);
    }
  }, []);

  const fetchMonthlyPayments = useCallback(async () => {
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const lastDayFormatted = lastDay.toISOString().split("T")[0];

      const response = await api.get("/payment/get-current-month-payment", {
        params: {
          from_date: firstDay,
          to_date: lastDayFormatted,
        },
      });
      setPaymentsPerMonthValue(response?.data?.monthlyPayment || 0);
    } catch (err) {
      console.error("Error fetching monthly payment data:", err.message);
      setPaymentsPerMonthValue(0);
    }
  }, []);

  const checkPaymentPermissions = useCallback(() => {
    try {
      const user = localStorage.getItem("user");
      const userObj = user ? JSON.parse(user) : null;

      if (
        userObj?.admin_access_right_id?.access_permissions?.edit_payment ===
        "true"
      ) {
        setHidePayment(true);
      }
    } catch (error) {
      console.error("Error parsing user permissions:", error);
      setHidePayment(false);
    }
  }, []);

  useEffect(() => {
    checkPaymentPermissions();
  }, [checkPaymentPermissions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotRendered(false);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchGroupData(),
      fetchUserData(),
      fetchAgentData(),
      fetchStaffData(),
      fetchEmployeeData(),
      fetchTotalAmount(),
      fetchMonthlyPayments(),
    ]).then(() => setLoading(false));
  }, [
    reloadTrigger,
    fetchGroupData,
    fetchUserData,
    fetchAgentData,
    fetchStaffData,
    fetchEmployeeData,
    fetchTotalAmount,
    fetchMonthlyPayments,
  ]);

  const baseCards = [
    {
      id: 1,
      icon: <LiaLayerGroupSolid size={22} />,
      text: "Groups",
      count: groups?.length,
      bgGradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      iconColor: "text-white",
      textColor: "text-slate-700",
      countColor: "text-slate-900",
      borderColor: "border-amber-100",
      hoverShadow: "hover:shadow-amber-100",
      accentColor: "bg-amber-500",
      redirect: "/group",
    },
    {
      id: 2,
      icon: <MdGroups size={22} />,
      text: "Customers",
      count: users?.length,
      bgGradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      iconColor: "text-white",
      textColor: "text-slate-700",
      countColor: "text-slate-900",
      borderColor: "border-amber-100",
      hoverShadow: "hover:shadow-amber-100",
      accentColor: "bg-amber-500",
      redirect: "/user",
    },
    // {
    //   id: 3,
    //   icon: <FaPeopleGroup size={22} />,
    //   text: "Staff",
    //   count: staff?.length,
    //   bgGradient: "from-amber-50 to-yellow-50",
    //   iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
    //   iconColor: "text-white",
    //   textColor: "text-slate-700",
    //   countColor: "text-slate-900",
    //   borderColor: "border-amber-100",
    //   hoverShadow: "hover:shadow-amber-100",
    //   accentColor: "bg-amber-500",
    //   redirect: "/staff-menu",
    // },
    {
      id: 4,
      icon: <FaPersonMilitaryPointing size={22} />,
      text: "Agents",
      count: agents?.length,
      bgGradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      iconColor: "text-white",
      textColor: "text-slate-700",
      countColor: "text-slate-900",
      borderColor: "border-amber-100",
      hoverShadow: "hover:shadow-amber-100",
      accentColor: "bg-amber-500",
      redirect: "/staff-menu/agent",
    },
    {
      id: 5,
      icon: <ImUserTie size={22} />,
      text: "Employees",
      count: employee?.length,
      bgGradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      iconColor: "text-white",
      textColor: "text-slate-700",
      countColor: "text-slate-900",
      borderColor: "border-amber-100",
      hoverShadow: "hover:shadow-amber-100",
      accentColor: "bg-amber-500",
      redirect: "/staff-menu/employee-menu",
    },
  ];

  const paymentCards = hidePayment
    ? [
      {
        id: 6,
        icon: <MdOutlinePayments size={22} />,
        text: "Total Payments",
        count: totalAmount,
        bgGradient: "from-amber-50 to-yellow-50",
        iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
        iconColor: "text-white",
        textColor: "text-slate-700",
        countColor: "text-slate-900",
        borderColor: "border-amber-100",
        hoverShadow: "hover:shadow-amber-100",
        accentColor: "bg-amber-500",
        redirect: "/payment-in-out-menu/pay-in-menu/payment",
        featured: true,
      },
      {
        id: 7,
        icon: <SlCalender size={22} />,
        text: "Monthly Payments",
        count: paymentsPerMonthValue,
        bgGradient: "from-amber-50 to-yellow-50",
        iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
        iconColor: "text-white",
        textColor: "text-slate-700",
        countColor: "text-slate-900",
        borderColor: "border-amber-100",
        hoverShadow: "hover:shadow-amber-100",
        accentColor: "bg-amber-500",
        redirect: "/payment-in-out-menu/pay-in-menu/payment",
      },
    ]
    : [];

  const allCards = [...baseCards, ...paymentCards];

  const filteredCards = allCards.filter((card) =>
    card.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCardClick = (index) => {
    setClickedIndex(index);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCardKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      setClickedIndex(index);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[168px] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar
          onGlobalSearchChangeHandler={handleSearchChange}
          visibility={true}
        />

        <main className="flex-1 overflow-auto mt-20 px-6 py-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-3 shadow-lg">
                    <IoStatsChart className="text-3xl text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                    Business Dashboard
                  </h1>
                  <p className="text-slate-500 text-sm lg:text-base mt-1">
                    Real-time insights and metrics at a glance
                  </p>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <IoTrendingUp className="text-emerald-500 text-lg" />
                  <span className="text-slate-600">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading
                ? Array(baseCards.length)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} />)
                : filteredCards.map((card, index) => (
                  <Link
                    to={card.redirect}
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    onKeyDown={(e) => handleCardKeyDown(e, index)}
                    role="button"
                    tabIndex={0}
                    className={`
                        group relative flex flex-col p-6 rounded-2xl
                        bg-white
                        border ${card.borderColor}
                        cursor-pointer
                        transition-all duration-300 ease-out
                        shadow-sm hover:shadow-xl
                        ${card.hoverShadow}
                        hover:-translate-y-1
                        ${notRendered
                        ? "opacity-0 translate-y-8 pointer-events-none"
                        : "opacity-100 translate-y-0 pointer-events-auto"
                      }
                        ${clickedIndex === index
                        ? "scale-98"
                        : ""
                      }
                        ${card.featured ? "lg:col-span-2" : ""}
                      `}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${card.accentColor} rounded-t-2xl`}></div>

                    {/* Content */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`
                            flex items-center justify-center w-12 h-12
                            ${card.iconBg} ${card.iconColor} rounded-xl
                            shadow-lg
                            group-hover:scale-110 transition-transform duration-300
                          `}
                      >
                        {card.icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${card.textColor} mb-2 uppercase tracking-wide`}>
                        {card.text}
                      </h3>

                      <div className="flex items-baseline gap-3">
                        <span
                          className={`
                              text-3xl font-bold ${card.countColor}
                              ${String(card.count).length > 10 ? "text-2xl" : ""}
                              ${String(card.count).length > 15 ? "text-xl" : ""}
                            `}
                        >
                          {card.count.toLocaleString()}
                        </span>

                        {/* Trend indicator */}
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <IoTrendingUp className="text-sm" />
                          <span>Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover arrow */}
                    <div className={`
                        absolute bottom-4 right-4 
                        opacity-0 group-hover:opacity-100 
                        transform translate-x-2 group-hover:translate-x-0
                        transition-all duration-300
                      `}>
                      <div className={`w-8 h-8 ${card.accentColor} rounded-full flex items-center justify-center text-white`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Empty State */}
            {!loading && filteredCards.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                  <AiTwotoneGold className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-slate-500">
                  We couldn't find any matches for "{searchValue}"
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;