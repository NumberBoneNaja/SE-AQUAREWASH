import { NavLink } from "react-router-dom"
import "./active.css"
import { useEffect, useState } from "react";

import { GiHamburgerMenu } from "react-icons/gi";

import {  GetUserID } from "../../services/https/index1";
import { UsersInterface } from "../../interfaces/UsersInterface";





function EmployeeBar({ page }: {page: string}) {

  const [show, setShow] = useState(false);
  const [showlink,setShowlink] = useState(false);

   
   const role = localStorage.getItem('Status');
   const [userdata, setUserdata] = useState<UsersInterface>({});
   
  async function getUserData() {
      const uid = localStorage.getItem("id");
      const res = await GetUserID(Number(uid));
      // console.log(res.data);
      setUserdata(res);
    }

  
  useEffect(() => {
    getUserData();
  },[])

  useEffect(() => {
  
  },[userdata])

    return (
      <div 
      className=" bg-white shadow-base-shadow rounded-b-3xl sticky top-0  gap-2 px-5 z-30"
      >
      
        <div className=" 
        flex justify-between 
        md:h-[60px] md:flex md:items-center md:justify-between 

        ">

            <div className="logo 
            ">
               <a href="/AdminHome" target="_self">
                <img src="../icon/logo-1.png" alt="" className="w-[100px]
                " /></a>
            </div>
            <div className="
            md:bg-base-bg md:rounded-3xl
            ">
              <div className="link-page hidden
                md:flex md:items-center md:gap-10 md:mx-5 md:my-1
              ">   {
                      role === "Admin" ? (

                        <div >
                        <NavLink className={({ isActive }) => isActive || page == "Exchequers" ? "Nav-font-active" : "Nav-font"} to="/Exchequers" > คลังอุปกรณ์</NavLink>

                        </div>
                      )
                      :(
                        <div >
                        <NavLink className={({ isActive }) => isActive || page == "Exchequers" ? "Nav-font-active" : "Nav-font"} to="/shop" > คลังอุปกรณ์</NavLink>

                    </div>
                      )
                   }
                   {
                      role === "Admin" && (
                        <div>
                        <NavLink className={({ isActive }) => isActive || page == "Machine" ? "Nav-font-active" : "Nav-font"} to="/AdminMachine"> เครื่องซัก-อบ </NavLink>
                      </div>
                      )
                   } 
                   {
                     role === "Admin" && (
                        <div>
                        <NavLink className={({ isActive }) => isActive || page == "AdminPackage" ? "Nav-font-active" : "Nav-font"} to="/AdminPackage"> แพ็คเกจ </NavLink>
                      </div>
                     )
                   }
                    <div>
                        <NavLink className={({ isActive }) => isActive || page == "AllReport" ? "Nav-font-active" : "Nav-font"} to="/AllReport"> รายงาน </NavLink>
                      </div>
              </div>
            </div>
            <div className="flex items-center gap-3 
            md:flex md:gap-3
            ">
              <div className="flex items-center gap-3 px-4 py-1 bg-base-bg rounded-3xl
              md:flex md:items-center md:gap-3
              ">
                    </div> 

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
                    

                   

            
        </div>
        {
          showlink && (

            <div className="md:hidden w-full h-full flex justify-center">
               <div className="flex  gap-10 items-start  w-fit
              ">
                
                 {  
                  role == "Admin" && (
                    <>
                      <div >
                          <NavLink className={({ isActive }) => isActive || page == "Shop" ? "Nav-font-active" : "Nav-font"} to="/Shop" > คลังอุปกรณ์</NavLink>

                      </div>
                      
                      <div>
                          <NavLink className={({ isActive }) => isActive || page == "Reservation" ? "Nav-font-active" : "Nav-font"} to="/Viewtable"> เครื่องซัก-อบ </NavLink>
                        </div>
                      <div>
                          <NavLink className={({ isActive }) => isActive || page == "Order" ? "Nav-font-active" : "Nav-font"} to="/Order"> แพ็คเกจ </NavLink>
                        </div>
                      <div>
                          <NavLink className={({ isActive }) => isActive || page == "AllReport" ? "Nav-font-active" : "Nav-font"} to="/AllReport"> รายงาน </NavLink>
                        </div>
                    </>
                  )

                 }
                 {  
                  role == "Employee" && (
                    <>
                      <div >
                          <NavLink className={({ isActive }) => isActive || page == "Shop" ? "Nav-font-active" : "Nav-font"} to="/Shop" > คลังอุปกรณ์</NavLink>

                      </div>
                      <div>
                          <NavLink className={({ isActive }) => isActive || page == "AllReport" ? "Nav-font-active" : "Nav-font"} to="/AllReport"> รายงาน </NavLink>
                        </div>
                    </>
                  )

                 }

                    
              </div>
            </div>

           
          )
        }
        </div>
    )
}

export default EmployeeBar


