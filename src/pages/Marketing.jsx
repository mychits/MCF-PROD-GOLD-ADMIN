import { NavLink, Outlet } from "react-router-dom";
import { useState, Fragment, useRef } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { FaWhatsapp } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { LiaSmsSolid } from "react-icons/lia";
// const subMenus = [
//   {
//     key:"#1",
//     title: "Promotion Login",
//     link: "https://app.whatsapppromotion.net/login",
//     icon: <FaWhatsapp size={20} />,
//     newTab:true
//   },
//   { key:"#2",
//     title: "Advertisement",
//     link: "/marketing/what-add",
//     icon: <FaWhatsapp size={20} />,
//   },
//   { key:"#3",
//     title: "Failed Users",
//     link: "/marketing/failed-whatuser",
//     red: true,
//     icon: <FaWhatsapp size={20} className="text-red-00" />,
//   },
//   { key:"#4",
//     title: "Due Message",
//     link: "/marketing/due-message",
//    icon:<RiMoneyRupeeCircleLine  size={20} className="text-red-00"/>
    
//   },
// ];
// const Marketing = () => {
//   return (
//     <div>
//       <div className="w-screen flex mt-20">
//         <Sidebar />
//         <div className="flex min-h-screen ">
//           <div className="w-[300px] bg-gray-50 min-h-screen  p-4">
//             {subMenus.map(({key, title, link, icon, red,newTab }) => (
//               <NavLink
//               key={key}
//               target={`${newTab?"_blank":"_self"}`} 
//                 className={({ isActive }) =>
//                   `my-2 flex items-center gap-2 font-medium rounded-md hover:bg-gray-300  p-3 ${
//                     red ? "text-red-800" : "text-blue-950"
//                   } ${isActive ? "bg-gray-200 border-l-8 border-blue-300" : ""}`
//                 }
//                 to={link}
//               >
//                 {icon}
//                 {title}
//               </NavLink>
//             ))}
//           </div>
//         <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };



const mainMenus = [
  {
    key: "#main-1",
    title: "Whatsapp Marketing",
    icon: <FaWhatsapp size={20} />,
    subMenus: [
      {
        key: "#1",
        title: "Whatsapp Login",
        link: "https://app.interakt.ai/login",
        icon: <FaWhatsapp size={20} />,
        newTab: true,
      },
      {
        key: "#2",
        title: "Whatsapp Advertisement",
        link: "/marketing/what-add",
        icon: <FaWhatsapp size={20} />,
      },
      {
        key: "#11",
        title: "Whatsapp promo",
        link: "/marketing/what-promo",
        icon: <FaWhatsapp size={20} />,
      },
      {
        key: "#3",
        title: "Whatsapp Failed Users",
        link: "/marketing/failed-whatuser",
        red: true,
        icon: <FaWhatsapp size={20} className="text-red-600" />,
      },
      {
        key: "#4",
        title: "Whatsapp Due Message",
        link: "/marketing/due-message",
        icon: <RiMoneyRupeeCircleLine size={20} />,
      },
      {
        key: "#5",
        title: "Whatsapp Auction Intimation Message",
        link: "/marketing/auction-intimation-message",
        icon: <RiMoneyRupeeCircleLine size={28}  />,
      },
       {
        key: "#6",
        title: "Whatsapp Over Due Message",
        link: "/marketing/over-due-message",
        icon: <RiMoneyRupeeCircleLine size={28}  />,
      },
    ],
  },
  {
    key: "#main-2",
    title: "Email Marketing",
    icon: <MdEmail size={20} />,
     subMenus: [
       {
        key: "#7",
        title: " Due Email ",
        link: "/marketing/due-email",
        icon: <RiMoneyRupeeCircleLine size={20} />,
      },
       {
        key: "#8",
        title: "Over Due Email",
        link: "/marketing/over-due-email",
        icon: <RiMoneyRupeeCircleLine size={20}  />,
      },

     ],
  },
   {
    key: "#main-3",
    title: "SMS Marketing",
    icon: <LiaSmsSolid size={20} />,
     subMenus: [
       {
        key: "#9",
        title: " Due SMS Message ",
        link: "/marketing/due-sms",
        icon: <RiMoneyRupeeCircleLine size={20} />,
      },
       {
        key: "#10",
        title: "Over Due SMS Message",
        link: "/marketing/over-due-sms",
        icon: <RiMoneyRupeeCircleLine size={28}  />,
      },

     ],
  },
];

const Marketing = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-screen flex mt-20">
      <Sidebar />
      <div className="flex min-h-screen">
        <div className="w-[300px] bg-gray-50 min-h-screen p-4 space-y-4">
          {mainMenus.map((menu, index) => {
            const isOpen = openMenuIndex === index;
            return (
              <Fragment key={menu.key}>
                <div
                  onClick={() => toggleMenu(index)}
                  className="flex items-center gap-3 text-lg font-semibold text-blue-900 px-2 py-2 cursor-pointer hover:opacity-80 rounded-md transition"
                >
                  {menu.icon}
                  {menu.title}
                  {menu.subMenus && (
                    <span className="ml-auto">
                      {isOpen ? (
                        <AiOutlineMinus className="text-sm" />
                      ) : (
                        <AiOutlinePlus className="text-sm" />
                      )}
                    </span>
                  )}
                </div>

                {/* Submenus */}
                {isOpen && menu.subMenus && (
                  <ul className="ml-5 mt-2 space-y-1">
                    {menu.subMenus.map((submenu) => (
                      <li key={submenu.key}>
                        <NavLink
                          to={submenu.link}
                          target={submenu.newTab ? "_blank" : "_self"}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-md transition font-medium ${
                              submenu.red ? "text-red-700" : "text-blue-950"
                            } ${
                              isActive
                                ? "bg-blue-100 border-l-4 border-blue-400"
                                : "hover:bg-gray-200"
                            }`
                          }
                        >
                          {submenu.icon}
                          {submenu.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="flex-1 bg-white p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Marketing;



