import { Fragment, useRef, useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { BsCash } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { CgWebsite } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircle } from "react-icons/io";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleArrows } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { IoPeopleOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { GiTakeMyMoney } from "react-icons/gi";
import { PiCalculatorBold } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi";
import ids from "../../data/ids";
import { FaClipboardList } from "react-icons/fa";
import { TbArrowsLeftDown } from "react-icons/tb";
import { RiUserLocationFill } from "react-icons/ri";
import { FaMapLocationDot } from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi2";
import { TbSettings } from "react-icons/tb";
import { MdOutlineGroups } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa6";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { GiRoundTable } from "react-icons/gi";
import { GrUserSettings } from "react-icons/gr";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { TbReceiptRupee } from "react-icons/tb";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import { SiQuicklook } from "react-icons/si";
import { BiTransfer } from "react-icons/bi";
import { FaMobileAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdAccountBalanceWallet } from "react-icons/md";
import { LuTarget } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";

const MenuSidebar = [
  {
    id: "$1",
    title: "Dashboard",
    icon: <RiDashboardFill />,
    link: "/dashboard",
  },
  {
    id: "$!GPP",
    title: "Quick Search",
    icon: <SiQuicklook />,
    link: "/quick-search",
  },
  {
    id: "$PP",
    title: "Analytics",
    icon: <SiGoogleanalytics />,
    link: "/analytics",
  },
  {
    id: "$2",
    title: "Groups ",
    spacing: true,
    icon: <TbCategoryPlus />,
    link: "/group-menu",
  },
  {
    id: ids.three,
    title: "Customers",
    icon: <IoIosPersonAdd />,
    link: "/customer-menu",
  },
  {
    id: "$4",
    title: "Enrollments ",
    icon: <FaPeopleArrows />,
    link: "/enroll-menu",
  },
  {
    id: "$9856",
    title: "Legals ",
    icon: <FaHandshake />,
    link: "/legals-menu"
  },
  {
    id: "$18",
    title: "Tasks",
    icon: <FaClipboardList />,
    link: "/task",
  },
  {
    id: ids.seven,
    title: "Staff",
    icon: <GiRoundTable />,
    link: "/staff-menu"
  },
  {
    title: "Target Management",
    icon: <LuTarget />,
    link: "/target-menu"
  },
  {
    id: "$7",
    title: "Leads",
    icon: <IoPeopleOutline />,
    link: "/lead",
  },
  {
    id: "$7865",
    title: "Other Services",
    icon: <GiTakeMyMoney />,
    link: "/other-service-menu",
  },
  {
    id: ids.eleven,
    title: "Auctions ",
    icon: <RiAuctionLine />,
    link: "/auction",
  },
  {
    id: "$#S",
    title: "Accounts",
    icon: <MdAccountBalanceWallet />,
    link: "/payment-menu/"
  },
  {
    id: "$12",
    title: "Reports",
    icon: <GrAnalytics />,
    link: "/reports",
  },
  {
    id: ids.fourteen,
    title: "Marketing",
    icon: <GoGraph />,
    link: "/marketing",
  },
  {
    id: "$199",
    title: "General Settings",
    icon: <TbSettings />,
    submenu: true,
    submenuItems: [
      {
        id: "#1",
        title: "Collection",
        icon: <HiCurrencyRupee size="20" />,
        hider: true,
        newTab: true,
        submenu: true,
        submenuItems: [
          {
            id: ids.fourteen,
            title: "Collection Area",
            icon: <FaMapLocationDot />,
            link: "/collection-area-request",
          },
        ],
      },
      {
        id: "#3",
        title: "Employee",
        hider: true,
        icon: <FaUserTie size={18} />,
        newTab: true,
        submenu: true,
        submenuItems: [
          {
            id: "#206",
            title: "Employee Profile",
            icon: <GrUserSettings size={18} />,
            link: "/employee-profile",
          },
        ],
      },
      {
        id: "#3",
        title: "Transfer",
        hider: true,
        icon: <BiTransfer size={18} />,
        newTab: true,
        submenu: true,
        submenuItems: [
          {
            id: "#206",
            title: "Soft Transfer",
            icon: <GrUserSettings size={18} />,
            link: "/soft-transfer",
          },
          {
            id: "#206",
            title: "Hard Transfer",
            icon: <GrUserSettings size={18} />,
            link: "/hard-transfer",
          },
        ],
      },
    ],
  },
  {
    id: "$15",
    title: "Other Sites",
    icon: <CgWebsite />,
    submenu: true,
    submenuItems: [
      {
        id: "#1",
        title: "Chit Admin",
        link: "http://prod-chit.s3-website.eu-north-1.amazonaws.com/",
        newTab: true,
      },
      {
        id: "#2",
        title: "Chit Plans Admin",
        link: "https://erp.admin.mychits.co.in/chit-enrollment-plan/admin/",
        newTab: true,
      },
      {
        id: "#3",
        title: "Chit Enrollment Request",
        link: "https://erp.admin.mychits.co.in/src/request/enrollment.php?user-role=&user-code=",
        newTab: true,
      },
    ],
  },
  {
    id: "$16",
    title: "Settings",
    icon: <IoIosSettings />,
    link: "/lead-setting",
  },
  {
    id: "$17",
    title: "Help & Support",
    icon: <IoIosHelpCircle />,
    link: "/help",
  },
];

const Sidebar = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(true);
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
  const [nestedSubmenuOpenIndex, setNestedSubmenuOpenIndex] = useState({});

  const toggleSubMenu = (index) => {
    setSubmenuOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleNestedSubMenu = (submenuIndex, subIndex) => {
    setNestedSubmenuOpenIndex((prevState) => ({
      ...prevState,
      [submenuIndex]: prevState[submenuIndex] === subIndex ? null : subIndex,
    }));
  };

  return (
    <div
      ref={ref}
      className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen max-h-auto p-5 pt-8 border-r border-amber-600/20 ${
        open ? "w-64" : "w-20"
      } duration-300 relative shadow-2xl`}
    >
      <div
        className={`absolute top-9 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-3xl rounded-full p-1 cursor-pointer border-2 border-amber-400 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 ${
          open ? "-right-3" : "-right-3 rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      >
        <BsArrowLeftShort className="bg-white rounded-full" />
      </div>
      
      <div className="inline-flex mb-8">
        <div className="relative group">
          
        
        </div>
        <h3
          className={`text-white origin-left   font-bold text-2xl flex items-center ${
            !open && "scale-0"
          } duration-300`}
        >
          <span className="text-amber-500">My</span>
          <span className="text-yellow-500 ml-1">Chits</span>
            <span className="text-amber-300 ml-1">Gold</span>
        </h3>
      </div>

      <ul className="">
        {MenuSidebar.map((menu, index) => {
          const isSpecialMenu =
            menu.title === "Collections" || menu.title === "Groups";
          const isOpen = submenuOpenIndex === index;

          return (
            <Fragment key={menu.id}>
              <a href={menu.link} onClick={() => toggleSubMenu(index)}>
                <li
                  className={`text-gray-300 text-sm flex items-center p-3 gap-x-4 cursor-pointer hover:bg-gradient-to-r hover:from-amber-900/30 hover:to-yellow-900/30 hover:border-l-4 hover:border-amber-500 rounded-r-xl transition-all duration-300 ${
                    menu.spacing ? "mt-9" : "mt-2"
                  }`}
                >
                  <span className="text-2xl block float-left text-amber-400 group-hover:text-yellow-400 transition-colors duration-300">
                    {menu.icon}
                  </span>
                  <span
                    className={`text-base font-medium flex-1 ${
                      !open && "hidden"
                    }`}
                  >
                    {menu.title}
                  </span>
                  {menu.submenu &&
                    open &&
                    (isSpecialMenu ? (
                      isOpen ? (
                        <AiOutlineMinus className="ml-auto text-amber-400 transition-transform duration-200" />
                      ) : (
                        <AiOutlinePlus className="ml-auto text-amber-400 transition-transform duration-200" />
                      )
                    ) : (
                      <BsChevronDown
                        className={`text-amber-400 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        } transition-transform duration-200`}
                      />
                    ))}
                </li>
              </a>

              {menu.submenu && isOpen && open && (
                <ul className="ml-4 bg-gray-800/50 rounded-xl p-2 backdrop-blur-sm border-l-2 border-amber-500/30">
                  {menu.submenuItems.map((submenuItem, subIndex) => (
                    <Fragment key={submenuItem.id}>
                      <a
                        href={submenuItem.link}
                        target={submenuItem.newTab ? "_blank" : "_self"}
                      >
                        <li
                          onClick={() => toggleNestedSubMenu(index, subIndex)}
                          className={`${
                            submenuItem.red ? "text-red-300" : "text-gray-300"
                          } select-none text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-gradient-to-r hover:from-amber-900/20 hover:to-yellow-900/20 rounded-lg transition-all duration-300 group`}
                        >
                          <span className="text-amber-400 group-hover:text-yellow-400 transition-colors duration-300">
                            {submenuItem.icon}
                          </span>
                          <span className="flex-1">{submenuItem.title}</span>
                          {submenuItem.submenu &&
                            (nestedSubmenuOpenIndex[index] === subIndex ? (
                              <AiOutlineMinus className="text-amber-400 transition-transform duration-200" />
                            ) : (
                              <AiOutlinePlus className="text-amber-400" />
                            ))}
                        </li>
                      </a>

                      {submenuItem.submenu &&
                        nestedSubmenuOpenIndex[index] === subIndex && (
                          <ul className="ml-8 bg-gray-900/50 rounded-lg p-2 backdrop-blur-sm border-l border-amber-500/30">
                            {submenuItem.submenuItems.map((subSubItem) => (
                              <a
                                key={subSubItem.id}
                                href={subSubItem.link}
                                target={subSubItem.newTab ? "_blank" : "_self"}
                              >
                                <li
                                  className={`${
                                    subSubItem.red
                                      ? "text-red-300"
                                      : "text-gray-300"
                                  } select-none text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-gradient-to-r hover:from-amber-900/20 hover:to-yellow-900/20 rounded-md transition-all duration-300 group`}
                                >
                                  <span className="text-amber-400 group-hover:text-yellow-400 transition-colors duration-300">
                                    {subSubItem.icon}
                                  </span>
                                  <span>{subSubItem.title}</span>
                                </li>
                              </a>
                            ))}
                          </ul>
                        )}
                    </Fragment>
                  ))}
                </ul>
              )}
            </Fragment>
          );
        })}
      </ul>

      <div
        className="rounded-full fixed right-5 bottom-20 bg-gradient-to-r from-amber-500 to-yellow-500 p-3 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 z-50 hover:scale-110 cursor-pointer"
        onClick={() => {
          ref.current.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <TbArrowsLeftDown className="text-2xl text-gray-900 rotate-90" />
      </div>
    </div>
  );
};

export default Sidebar;