import React, { useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { IoIosHelpCircle } from "react-icons/io";
import { GiGoldBar } from "react-icons/gi";
import { IoPeopleOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineGroups } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { MdAppSettingsAlt } from "react-icons/md";
import { ImHappy } from "react-icons/im";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";
import { LuTarget } from "react-icons/lu";
import { BsFileBarGraph } from "react-icons/bs";
import { TbGraph } from "react-icons/tb";
import { TbGraphFilled } from "react-icons/tb";
import { MdAccountBalanceWallet } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaGift } from "react-icons/fa6";

const MenuSidebar = [
  { title: "Dashboard", icon: <RiDashboardFill />, link: "/dashboard" },
  {
    title: "Analytics",
    icon: <SiGoogleanalytics />,
    link: "/analytics",
  },
  {
    title: "App Settings",
    spacing: true,
    icon: <TiSpanner />,
    submenu: true,
    submenuItems: [
      {
        title: "Groups",
        icon: <MdOutlineGroups />,
        submenu: true,
        submenuItems: [
          {
            title: "Mobile Access",
            icon: <MdAppSettingsAlt size={20} />,
            link: "/group-menu/filter-groups",
          },
          {
            title: "Dream Asset",
            icon: <ImHappy size={20} />,
            link: "/lead-setting/app-settings/groups/asset",
          },
          {
            title: "Become Agent",
            icon: <FaPersonMilitaryPointing size={20} />,
            link: "/lead-setting/app-settings/groups/become-agent",
          },
        ],
      },
    ],
  },
  {
    title: "Insurance",
    icon: <IoPeopleOutline />,
    link: "/insurance"
  },
  {
    title: "Reward",
    icon: <FaGift />,
    link: "/gift-received"
  },
  {
    title: "Designations",
    icon: <IoPeopleOutline />,
    link: "/designation",
  },
  {
    title: "Administrative Privileges",
    icon: <RiAdminLine />,
    link: "/administrative-privileges",
  },
  {
    title: "Admin Access Rights",
    icon: <BsPersonCheck />,
    link: "/admin-access-rights",
  },
  {
    title: "Penalty Management",
    icon: <RiMoneyRupeeCircleFill />,
    submenu: true,
    submenuItems: [
      { title: "Penalty Settings", icon: <TiSpanner size={20} />, link: "/penalty-settings" },
      { title: "Penalty Monitor", icon: <TbGraph size={20} />, link: "/penalty-monitor" },
    ],
  },
  {
    title: "Profile",
    spacing: true,
    icon: <CgProfile />,
    link: "/profile",
  },
  { title: "Help & Support", icon: <IoIosHelpCircle />, link: "/help" },
];

const SettingSidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  const toggleExpand = (key) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const isExpanded = (key) => expandedMenus.has(key);

  const renderMenu = (items, level = 0, pathPrefix = "") => {
    return items.map((item, index) => {
      const key = pathPrefix ? `${pathPrefix}/${index}` : `${index}`;
      const isSubmenu = level > 0;
      const isActive = location.pathname === item.link;

      const textSizeClass = "text-sm";
      const titleFontSizeClass = isSubmenu
        ? "text-sm font-normal"
        : "text-base font-medium";
      const iconSizeClass = isSubmenu ? "text-xl" : "text-2xl";
      const paddingLeftClass = isSubmenu ? "pl-6 md:pl-8" : "";

      return (
        <div key={key} className={`${item.spacing ? "mt-9" : "mt-2"}`}>
          {item.submenu ? (
            <>
              <div
                className={`text-gray-300 ${textSizeClass} ${paddingLeftClass} flex items-center justify-between gap-x-4 cursor-pointer p-3 hover:bg-gradient-to-r hover:from-amber-900/30 hover:to-yellow-900/30 hover:border-l-4 hover:border-amber-500 rounded-r-xl transition-all duration-300 ${
                  isExpanded(key) ? "bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-l-4 border-amber-500/70 rounded-r-xl" : ""
                }`}
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-x-4">
                  {item.icon && (
                    <span className={`${iconSizeClass} text-amber-400 transition-colors duration-300`}>
                      {item.icon}
                    </span>
                  )}
                  {open && (
                    <span className={`${titleFontSizeClass}`}>{item.title}</span>
                  )}
                </div>
                {open && (
                  <span className={isSubmenu ? "text-sm" : "text-xl"}>
                    {item.title === "Groups" ? (
                      isExpanded(key) ? (
                        <AiOutlineMinus size={isSubmenu ? 14 : 16} className="text-amber-400" />
                      ) : (
                        <AiOutlinePlus size={isSubmenu ? 14 : 16} className="text-amber-400" />
                      )
                    ) : (
                      <BsChevronDown
                        size={isSubmenu ? 14 : 16}
                        className={`text-amber-400 transition-transform duration-200 ${
                          isExpanded(key) ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </span>
                )}
              </div>
              {open && isExpanded(key) && item.submenuItems && (
                <div className="ml-3 md:ml-4 bg-gray-800/50 rounded-xl p-2 backdrop-blur-sm border-l-2 border-amber-500/30">
                  {renderMenu(item.submenuItems, level + 1, key)}
                </div>
              )}
            </>
          ) : (
            <Link to={item.link || "#"}>
              <div
                className={`text-gray-300 ${textSizeClass} ${paddingLeftClass} flex items-center gap-x-4 cursor-pointer p-3 hover:bg-gradient-to-r hover:from-amber-900/30 hover:to-yellow-900/30 hover:border-l-4 hover:border-amber-500 rounded-r-xl transition-all duration-300 ${
                  isActive ? "bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-l-4 border-amber-500/70 rounded-r-xl" : ""
                }`}
              >
                {item.icon && (
                  <span className={`${iconSizeClass} text-amber-400 transition-colors duration-300`}>
                    {item.icon}
                  </span>
                )}
                {open && (
                  <span className={`${titleFontSizeClass}`}>{item.title}</span>
                )}
              </div>
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen max-h-auto p-5 pt-8 border-r border-amber-600/20 duration-300 relative shadow-2xl ${
        open ? "w-64" : "w-20"
      }`}
    >
      <div
        className={`absolute top-9 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-3xl rounded-full p-1 cursor-pointer border-2 border-amber-400 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 ${
          open ? "-right-3" : "-right-3 rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      >
        <BsArrowLeftShort className="bg-white rounded-full" />
      </div>
      
      <div className="inline-flex ml-9 mb-8">
       
        <h3
          className={`text-white origin-left font-bold text-2xl flex items-center ${
            !open && "scale-0"
          } duration-300`}
        >
          <span className="text-amber-500">Settings</span>
        </h3>
      </div>

      <ul className="pt-2">{renderMenu(MenuSidebar)}</ul>
    </div>
  );
};

export default SettingSidebar;