import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { message } from "antd";


function EmSidebar({page}:{page:string}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const role = localStorage.getItem('Status');
  
  const Logout = () => {
    localStorage.clear();
    message.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 1000);
};
  return (
    <motion.div
      className="h-[88vh] bg-white rounded-2xl fixed top-[67px] z-30 left-3 shadow-base-shadow"
      initial={{ width: "4rem" }}
      animate={{ width: isExpanded ? "16rem" : "4rem" }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full flex flex-col justify-between py-4  px-4">
        <div className="icon-link flex flex-col gap-2 w-full">
          {/* Profile */}
          <NavLink
            className={({ isActive }) =>
                `flex items-center gap-4 ${
                  isActive || page === "Profile" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
                } py-[4px]`
              }
            to="/ProfileUserEm"
          >
            <img
              src={
                page === "Profile"
                  ? "../icon/profile-user.svg"
                  : "../icon/profile-usernrmal.svg"
              }
              alt=""
              className="w-[30px] h-[30px]"
            />
            <motion.span
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
            >
              โปรไฟล์
            </motion.span>
          </NavLink>

          {/* Manage Members */}
          {
            role === 'Admin' && (
              <NavLink
                className={({ isActive }) =>
                    `flex items-center gap-4 ${
                      isActive || page === "Adminmanagement" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
                    } py-[4px]  `
                  }
                to="/AdminManager"
              >
                
                <img
                  src={
                    page === "Adminmanagement"
                      ? "../icon/group (1).png"
                      : "../icon/group.png"
                  }
                  alt=""
                  className="w-[30px] h-[30px] ml-[1px]"
                />
                <motion.span
                  className="text-sm font-medium truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
                >
                  จัดการสมาชิก
                </motion.span>
              </NavLink>

            )
          }
          

          {/* Employee Orders */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-4 ${
                isActive || page === "EmAllOrder" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
              } py-[4px]`
            }
            to="/EmployeeOrder"
          >
            <img
              src={
                page === "EmAllOrder"
                  ? "../icon/clipboard.svg"
                  : "../icon/clipboard (1).png"
              }
              alt=""
              className="w-[30px] h-[30px] ml-[1px]"
            />
            <motion.span
              className="text-sm font-medium truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
            >
              รายการฝากซัก-อบ ทั้งหมด
            </motion.span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
                `flex items-center gap-4 ${
                  isActive || page === "WorkProcess" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
                } py-[4px]`
              }
            to="/WorkProcess"
          >
            <img
              src={
                page === "WorkProcess"
                  ? "../icon/laundry-basket-active.png"
                  : "../icon/laundry-basket.png"
              }
              alt=""
              className="w-[30px] h-[30px] ml-[1px]"
            />
            <motion.span
              className="text-sm font-medium truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
            >
              จัดการงาน
            </motion.span>
          </NavLink>

          {/* Coupon Management */}
          {
            role === 'Admin' && (
               <NavLink
            className={({ isActive }) =>
                `flex items-center gap-4 ${
                  isActive || page === "CreateReward" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
                } py-[4px]`
              }
            to="/GetReward"
          >
            <img
              src={
                page === "CreateReward"
                  ? "../icon/promotion (1).png"
                  : "../icon/promotion.png"
              }
              alt=""
              className="w-[30px] h-[30px] ml-[1px]"
            />
            <motion.span
              className="text-sm font-medium truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
            >
              การจัดการคูปองและส่วนลด
            </motion.span>
          </NavLink>
            )
          }
          {
            role === 'Admin' && (
              <NavLink
              className={({ isActive }) =>
                  `flex items-center gap-4 ${
                    isActive || page === "Announcement" ? "text-blue-bg font-bold Em-active" : "text-gray-600"
                  } py-[4px]`
                }
              to="/CreatePost"
            >
              <img
                src={
                  page === "Announcement"
                    ? "../icon/file.png"
                    : "../icon/file-normal.png"
                }
                alt=""
                className="w-[30px] h-[30px] ml-[1px]"
              />
              <motion.span
                className="text-sm font-medium truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
              >
                แจ้งข่าวสาร
              </motion.span>
            </NavLink>
            )
          }
         

          

          {/* Expand/Collapse Toggle */}
          <div
            className="cursor-pointer text-center text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "ย่อ" : "ขยาย"}
          </div>
        </div>

        {/* Logout */}
        <div className=" flex items-center gap-4" onClick={() => Logout()}>
          <img src="../icon/logout.png" alt="" className="w-[30px] h-[30px]" />
          {
           
              <motion.p className="text-sm font-medium truncate text-base-red"
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.2 }}
              >ออกจากระบบ</motion.p>

          
          }
         
        </div>
      </div>
    </motion.div>
  );
}

export default EmSidebar;
