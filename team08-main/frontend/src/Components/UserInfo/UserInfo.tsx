import { UsersInterface } from "../../interfaces/UsersInterface";

import { GetUserById } from "../../services/https/index";
import { useEffect, useState } from "react";

function UserInfo() {
    const [_user, setUser] = useState<UsersInterface | null>(null); // State to store user data

    useEffect(() => {
        const fetchUser = async () => {
          const userId = localStorage.getItem("id");
          if (userId) {
            try {
              const userData = await GetUserById(userId);
              // Assuming the points field is named 'point' in your backend
              setUser(userData.data);
              console.log("User status:", userData.data.Point);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
        };
        
        fetchUser();
    }, []);

    return (
        <div>
             <div className="profileUser ">
                <div className="w-[320px] h-fit bg-white rounded-xl shadow-md">
                    <div className="background w-full h-[200px] bg-[url('../icon/Coverpackage.jpg')] bg-cover bg-center rounded-t-lg relative
                        mb-[50px]
                    ">
                
                        <div className="w-full flex justify-center absolute bottom-[-30px]  ">
                        
                            <img src="../icon/user.jpg" alt="" 
                                className="w-[100px] h-[100px] rounded-full border-[3px] border-[#80ED99]"/>
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                          <div className="" >
                            <h1>Thiradet111</h1>
                          </div>
                    </div>
                    
                    <div className="px-2 ">
                    <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">โปรไฟล์</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div> 

                         <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">แก้ไขข้อมูล</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div> 
                        <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">รายการทั้งหมด</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div> 
                        <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">การจองทั้งหมด</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div>
                        <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">ของรางวัล</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div>
                        <div className="w-full flex justify-between py-2 ">
                            <div>
                                <p className=" text-[16px] ">ออกจากระบบ</p>
                            </div>
                             <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                fill="#24292E"
                                /></svg> 
                             </div>
                        </div>
                        
                       
                    </div>
                   
                </div>
                
            </div>
           

        </div>
    )
}
export default UserInfo

//Coverpackage.jpg