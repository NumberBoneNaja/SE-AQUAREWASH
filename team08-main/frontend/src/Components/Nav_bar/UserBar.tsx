import { NavLink } from "react-router-dom"
import "./active.css"
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";

import { GetUserID } from "../../services/https/index1";
import { GetUserById } from "../../services/https/index";
import MessagePopUp from "../MessagePopUp/MessagePopUp";
import MenuItem from "../../assets/Rank/A.png";

import { message } from "antd";
import { useUnreadNotification } from "../NotificationContax/UnreadNotificationContext ";

import { UsersInterface } from "../../interfaces/UsersInterface";


function UserBar({ page }: {page: string}) {

  const [show, setShow] = useState(false);
  const [showlink,setShowlink] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { unreadCount } = useUnreadNotification();
  const [userdata, setUserdata] = useState<UsersInterface>({});
  const role = localStorage.getItem('Status');


  async function getUserData() {
    const uid = localStorage.getItem("id");
    const res = await GetUserID(Number(uid));
    // console.log(res.data);
    setUserdata(res);
  }
  const [userPoints, setUserPoints] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        try {
          const userData = await GetUserById(userId);
          // Assuming the points field is named 'point' in your backend
          setUserPoints(userData.data.Point || 0);
          console.log("User status:", userData.data.Point);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUser();
  }, []);


  
  useEffect(() => {
     
     getUserData();
  },[])

  useEffect(() => {
  
  },[message,userdata])


   function Logout(){
   
    localStorage.clear();
    message.open({
      type: "success",
      content: "ออกจากระบบ",
      duration: 3
    });
    
    setTimeout(() => {
     
      window.location.href = "/";
    }, 1000);
   
   }

    return (
      <div 
      className="bg-white shadow-base-shadow rounded-b-3xl sticky top-0  gap-2  z-30 "
      >
      
        <div className=" 
        flex justify-between 
        md:h-[60px] md:flex md:items-center md:justify-between px-5

        ">

            <div className="logo 
            ">
              <a href="/Home" target="_self">
                <img src="../icon/logo-1.png" alt="" className="w-[100px]
                " /></a>
            </div>
            <div className="
            md:bg-base-bg md:rounded-3xl
            ">
              <div className="link-page hidden
                md:flex md:items-center md:gap-10 md:mx-5 md:my-1
              ">   

                    <div >
                        <NavLink className={({ isActive }) => isActive || page == "Home" ? "Nav-font-active" : "Nav-font"} to="/Home" > หน้าแรก</NavLink>

                    </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Reservation" ? "Nav-font-active" : "Nav-font"} to="/Viewtable"> จองเครื่องซัก-อบ </NavLink>
                      </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Order" ? "Nav-font-active" : "Nav-font"} to="/Order"> ฝากซัก-อบ </NavLink>
                      </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Reservation" ? "Nav-font-active" : "Nav-font"} to="/Usereward"> แลกรางวัล </NavLink>
                      </div>
              </div>
            </div>
            <div className="flex items-center gap-3 
            md:flex md:gap-3
            ">
              <div className="flex items-center gap-3 px-4 py-1 bg-base-bg rounded-3xl
              md:flex md:items-center md:gap-3
              ">{
                      role == "User" ?(
                        <NavLink className={({ isActive }) => isActive || page == "MainPack" ? "primium-active" : "primium"} to="/MainPack">
                  
                          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="15.000000pt" height="15.000000pt" viewBox="0 0 512.000000 512.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                    fill="" stroke="none">
                                    <path d="M1177 4293 c140 -241 258 -441 262 -445 3 -4 207 193 451 437 l445
                                    445 -707 0 -706 0 255 -437z"/>
                                    <path d="M3230 4285 c244 -244 448 -441 451 -437 4 4 122 204 262 445 l255
                                    437 -706 0 -707 0 445 -445z"/>
                                    <path d="M2105 4230 l-450 -450 905 0 905 0 -450 450 c-247 248 -452 450 -455
                                    450 -3 0 -208 -202 -455 -450z"/>
                                    <path d="M376 4217 l-359 -432 613 -3 c337 -1 615 -1 617 1 5 5 -496 862 -505
                                    864 -4 1 -168 -193 -366 -430z"/>
                                    <path d="M4122 4218 c-139 -237 -251 -433 -249 -435 2 -2 280 -2 617 -1 l613
                                    3 -359 432 c-198 237 -362 432 -365 432 -3 1 -119 -193 -257 -431z"/>
                                    <path d="M105 3453 c57 -76 574 -753 1147 -1504 574 -752 1044 -1366 1045
                                    -1365 1 1 -211 677 -471 1501 l-474 1500 -676 3 -677 2 106 -137z"/>
                                    <path d="M1553 3583 c2 -5 228 -720 503 -1590 274 -871 501 -1583 504 -1583 3
                                    0 230 712 504 1583 275 870 501 1585 503 1590 2 4 -451 7 -1007 7 -556 0
                                    -1009 -3 -1007 -7z"/>
                                    <path d="M3765 3578 c-23 -66 -944 -2993 -942 -2994 1 -1 471 613 1045 1365
                                    573 751 1090 1428 1147 1504 l106 137 -676 0 c-532 0 -677 -3 -680 -12z"/>
                                    </g>
                              </svg>

                        </NavLink>
                      ):(
                        <NavLink className={({ isActive }) => isActive || page == "MainPack" ? "primium-active" : "primium"} to="/MemberShipByUser">
                  
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                  width="15.000000pt" height="15.000000pt" viewBox="0 0 512.000000 512.000000"
                                  preserveAspectRatio="xMidYMid meet">

                                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                  fill="" stroke="none">
                                  <path d="M1177 4293 c140 -241 258 -441 262 -445 3 -4 207 193 451 437 l445
                                  445 -707 0 -706 0 255 -437z"/>
                                  <path d="M3230 4285 c244 -244 448 -441 451 -437 4 4 122 204 262 445 l255
                                  437 -706 0 -707 0 445 -445z"/>
                                  <path d="M2105 4230 l-450 -450 905 0 905 0 -450 450 c-247 248 -452 450 -455
                                  450 -3 0 -208 -202 -455 -450z"/>
                                  <path d="M376 4217 l-359 -432 613 -3 c337 -1 615 -1 617 1 5 5 -496 862 -505
                                  864 -4 1 -168 -193 -366 -430z"/>
                                  <path d="M4122 4218 c-139 -237 -251 -433 -249 -435 2 -2 280 -2 617 -1 l613
                                  3 -359 432 c-198 237 -362 432 -365 432 -3 1 -119 -193 -257 -431z"/>
                                  <path d="M105 3453 c57 -76 574 -753 1147 -1504 574 -752 1044 -1366 1045
                                  -1365 1 1 -211 677 -471 1501 l-474 1500 -676 3 -677 2 106 -137z"/>
                                  <path d="M1553 3583 c2 -5 228 -720 503 -1590 274 -871 501 -1583 504 -1583 3
                                  0 230 712 504 1583 275 870 501 1585 503 1590 2 4 -451 7 -1007 7 -556 0
                                  -1009 -3 -1007 -7z"/>
                                  <path d="M3765 3578 c-23 -66 -944 -2993 -942 -2994 1 -1 471 613 1045 1365
                                  573 751 1090 1428 1147 1504 l106 137 -676 0 c-532 0 -677 -3 -680 -12z"/>
                                  </g>
                            </svg>

                      </NavLink>
                      )
              }
                  <div className={showNotification==true ? "notification-active relative" : "notification relative" } onClick={() => setShowNotification(!showNotification)} >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" fill="#24292E">
                          <path d="M 12 2 C 11.172 2 10.5 2.672 10.5 3.5 L 10.5 4.1953125 C 7.9131836 4.862095 6 7.2048001 6 10 L 6 16 L 4.4648438 17.15625 L 4.4628906 17.15625 A 1 1 0 0 0 4 18 A 1 1 0 0 0 5 19 L 12 19 L 19 19 A 1 1 0 0 0 20 18 A 1 1 0 0 0 19.537109 17.15625 L 18 16 L 18 10 C 18 7.2048001 16.086816 4.862095 13.5 4.1953125 L 13.5 3.5 C 13.5 2.672 12.828 2 12 2 z M 10 20 C 10 21.1 10.9 22 12 22 C 13.1 22 14 21.1 14 20 L 10 20 z"></path>
                      </svg>
                       {
                        unreadCount > 0 &&(
                          <span className="absolute top-[0.5px] right-[-2px] h-[13px] w-[13px] rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                        )
                       }
                      
                    { <AnimatePresence>
                      showNotification &&(
                       
                        <MessagePopUp show={showNotification} close={setShowNotification} />
                     
                      )   </AnimatePresence>
                    }  
                    
                  </div>
                    </div> 
                  

                <b>แต้มสะสม|{userPoints.toLocaleString()} </b>
                <div className="bigprofile  
                 
                  ">
                  <div className="profile  " >
                     <img src={userdata?.Profile || "../icon/user.jpg" } alt="" className="w-[40px] h-[40px] rounded-full object-cover  
                     
                     lg:w-[40px] lg:h-[40px]
                     " onClick={() => setShow(!show)}
                      />
                    
                  </div>
                 
                       
               </div>
               <div className="menu
               md:hidden"
               onClick={() => setShowlink(!showlink)}
               >
                <GiHamburgerMenu size={20} className="burger-icon" />
               
       
               </div>
            </div>
                    <AnimatePresence>
                          {show && (
                          <div  className="absolute border-2 w-[100%] h-[100vh] z-[-10]
                          top-0 left-0
                          " onClick={() => setShow(false)}> 
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              style={{ translateX: "-50%" }}
                              transition={{ duration: 0.1, ease: "easeOut",type : "spring",bounce : 0.25,
                                  stiffness : 100,mass : 0.5,damping : 10,velocity : 0,restDelta : 0.01
                                  ,restSpeed : 0
                               }}
                              className="absolute top-[60px] right-[-140px] w-[370px] h-fit 
                               bg-white text-black shadow-base-shadow p-5 rounded-[10px] flex flex-col gap-4 z-30"
                               onClick={(e) => e.stopPropagation()}
                            >
                              <div className="profileUser flex justify-start  ">
                               <div className="h-full flex items-center  gap-5">
                                 <img src={userdata.Profile || MenuItem } alt="" className="w-[50px] h-[50px] rounded-full object-cover " />
                                
                                    <p className="">🧿 {userdata.UserName} 💎 {userdata.Status}</p>
                                </div>
                              
                              </div>

                              <div className="  
                                flex flex-col gap-4">

                                  {/* <MenuItem icon="../icon/profile-user.png" label="โปรไฟล์" page="โปรไฟล์" linkpage="/ProfileUser"/>
                                  <MenuItem icon="../icon/clipboard.png" label="รายการฝากซัก-อบ ทั้งหมด"  page="รายการฝากซัก-อบ ทั้งหมด" linkpage="/AllOrderUser"/>
                                  <MenuItem icon="../icon/laundry.png" label="การจองเครื่องซัก-อบ ทั้งหมด"  page="การจองเครื่องซัก-อบ ทั้งหมด" linkpage="/AllOrderLaundry"/>
                                  <MenuItem icon="../icon/coupon.png" label="คูปองของฉัน"  page="คูปองของฉัน" linkpage="/CouponUser"/> 
                                  <MenuItem icon="../icon/warning.png" label="ติดตามการรายงาน"  page="ติดตามการรายงาน" linkpage="/ReportUser"/>
                                  <MenuItem icon="../icon/logout.png" label="ออกจากระบบ"  page="ออกจากระบบ" linkpage="/Login"/> */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/profile-user.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "Profile" ? "Nav-font-active" : "Nav-font"} to='/ProfileUser'> โปรไฟล์ </NavLink>
                                          </div>
                                          
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/clipboard.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "AllOrderUser" ? "Nav-font-active" : "Nav-font"} to='/AllOrderUser'> รายการฝากซัก-อบ ทั้งหมด </NavLink>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/laundry.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "AllOrderLaundry" ? "Nav-font-active" : "Nav-font"} to='/BooksTable'>การจองเครื่องซัก-อบ ทั้งหมด </NavLink>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/coupon.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "OwnReward" ? "Nav-font-active" : "Nav-font"} to='/OwnReward'> รางวัลและส่วนลด </NavLink>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>

                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/warning.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "Report" ? "Nav-font-active" : "Nav-font"} to='/Report'> รายงานปัญหาเครื่องซักผ้า </NavLink>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/email_542689.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                            <NavLink className={({ isActive }) => isActive || page === "Mailbox" ? "Nav-font-active" : "Nav-font"} to='/MailBox'> กล่องข้อความ </NavLink>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>

                                      <div className="flex justify-between items-center cursor-pointer " onClick={Logout}>
                                        <div className="flex items-center gap-2">
                                          <img src="../icon/logout.png" alt="" className="w-[25px] h-[25px]" />
                                          <div>
                                             <p className="text-base-red">ออกจากระบบ</p>
                                          </div>
                                          
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="#24292E"
                                        >
                                          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                        </svg>
                                      </div>
                                   

                                </div>
                              
                            </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                   

            
        </div>
        {
          showlink && (

            <div className="md:hidden w-full h-full flex justify-center">
               <div className="flex  gap-10 items-start  w-fit
              ">
                    <div >
                        <NavLink className={({ isActive }) => isActive || page == "Home" ? "Nav-font-active" : "Nav-font"} to="/Main" > หน้าแรก</NavLink>

                    </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Reservation" ? "Nav-font-active" : "Nav-font"} to="/Viewtable"> จองเครื่องซัก-อบ </NavLink>
                      </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Order" ? "Nav-font-active" : "Nav-font"} to="/Order"> ฝากซัก-อบ </NavLink>
                      </div>
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "Reservation" ? "Nav-font-active" : "Nav-font"} to="/Reserve"> แลกรางวัล </NavLink>
                      </div>
                      
              </div>
            </div>

           
          )
        }
        </div>
    )
}

export default UserBar

