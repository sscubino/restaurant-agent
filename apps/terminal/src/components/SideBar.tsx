import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import useUser from "../hooks/useUser";
import { CiCreditCard1, CiMobile3 } from "react-icons/ci";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsPhone } from "react-icons/bs";
import { BiLogoGmail } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { getCustomerPortalUrl } from "../services/api/subscription/subscription";
import { FiExternalLink } from "react-icons/fi";

const Pages = [
  { name: "Dashboard", link: "/dashbooard", icon: GoHome },
  { name: "Menu", link: "/menu", icon: GiForkKnifeSpoon },
  { name: "Calls", link: "/calls", icon: CiMobile3 },
];

const SideBar = () => {
  const [expanded, setExpanded] = React.useState<boolean>(() =>
    JSON.parse(localStorage.getItem("sidebarExpanded") || "true")
  );
  const { user } = useUser();
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate();
  const [loadingPortal, setLoadingPortal] = React.useState<boolean>(false);

  const handleExpanded = () => {
    setExpanded((prevState) => {
      const newState = !prevState;
      localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
      return newState;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToCustomerPortal = () => {
    setLoadingPortal(true);
    getCustomerPortalUrl(user.id)
      .then((url) => {
        window.open(url, "_blank");
      })
      .finally(() => {
        setLoadingPortal(false);
      });
  };

  return (
    <div
      style={{
        width: expanded ? "250px" : "75px",
        padding: expanded ? "24px" : "24px 8px",
      }}
      className="h-[100vh] bg-white relative flex flex-col"
    >
      <button
        onClick={handleExpanded}
        className="bg-white cursor-pointer absolute right-[-14px] top-[135px] p-[4px] rounded-full border-[1px] border-gray-300"
      >
        {expanded ? (
          <MdKeyboardArrowLeft className="text-gray-400" size={16} />
        ) : (
          <MdKeyboardArrowRight className="text-gray-400" size={16} />
        )}
      </button>

      <div className="flex flex-row items-start h-[150px] justify-center gap-[8px] border-b-[1px] border-b-gray-300">
        <div className="flex-1 flex flex-col items-start min-w-0 relative h-full">
          <div className="w-full flex flex-col justify-center">
            <div
              style={{ alignSelf: expanded ? "flex-start" : "center" }}
              className="h-[40px] w-[40px] rounded-full mb-[12px] bg-gray-200"
            ></div>

            {expanded && (
              <p className="text-[16px] text-gray-900 font-bold">
                {user.firstName + " " + user.lastName} - {user.restaurant.name}
              </p>
            )}
            {expanded && (
              <>
                <div className="flex items-center gap-1 w-full">
                  <BiLogoGmail size={12} className="text-gray-500" />
                  <p className="text-[12px] text-gray-500 break-words text-ellipsis overflow-hidden whitespace-nowrap">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-1 w-full">
                  <BsPhone size={12} className="text-gray-500" />
                  <p className="text-[12px] text-gray-500">
                    +{user.restaurant.phone}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-[30px]">
        <p
          style={{
            textAlign: expanded ? "start" : "center",
            marginLeft: expanded ? "12px" : "0px",
          }}
          className="text-[12px] mb-[20px] text-[#757575]"
        >
          MAIN
        </p>

        <div className="flex flex-col items-start w-full">
          {Pages.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                to={item.link}
                className={`flex w-full mb-[4px] flex-row items-center gap-[12px] py-[12px] px-[12px] rounded-[8px] transition 
                                    ${item.link === pathName ? "bg-gray-100" : "hover:bg-gray-50"}`}
                key={index}
                style={{ justifyContent: expanded ? "flex-start" : "center" }}
              >
                <Icon size={20} className="text-gray-600" />
                {expanded && (
                  <p className="text-[#757575] text-[16px]/[20px] line-[100px]">
                    {item.name}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <p
          style={{
            textAlign: expanded ? "start" : "center",
            marginLeft: expanded ? "12px" : "0px",
          }}
          className="text-[12px] mb-[20px] text-[#757575]"
        >
          {expanded ? "SUBSCRIPTION" : "SUBS"}
        </p>
        <div className="flex flex-col items-start w-full">
          <button
            className="flex w-full flex-row items-center gap-[12px] py-[12px] px-[12px] rounded-[8px] transition hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              justifyContent: expanded ? "flex-start" : "center",
            }}
            onClick={goToCustomerPortal}
            disabled={loadingPortal}
          >
            <CiCreditCard1 size={20} className="text-gray-500" />
            {expanded && (
              <div className="flex items-center gap-2.5">
                <p className="text-[#757575] text-[16px]/[20px] line-[100px] font-medium">
                  Customer Portal
                </p>
                <FiExternalLink size={14} className="text-[#757575]" />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          className="flex w-full flex-row items-center gap-[12px] py-[12px] px-[12px] rounded-[8px] transition hover:bg-red-50 cursor-pointer hover:text-red-500! text-[#757575]"
          style={{ justifyContent: expanded ? "flex-start" : "center" }}
          onClick={logout}
        >
          <CiLogout size={20} />
          {expanded && (
            <p className="text-[16px]/[20px] line-[100px]">Logout</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
