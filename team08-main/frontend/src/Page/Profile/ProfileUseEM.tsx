import { useEffect, useState } from "react";

import Loading from "../../Components/Loader/Loading";
import ProfileEmCom from "../../Components/ProfileCom/ProfileEmCom";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";


function ProfileUseEM() {
     const [loading, setLoading] = useState(true);
        useEffect(() => {
            // สมมติว่าคุณดึงข้อมูลก่อนแสดง TableOrder
            const fetchData = async () => {
                setLoading(true);
                try {
                    // จำลองการโหลดข้อมูล (แทนที่ด้วย API จริง)
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error("Error loading data:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
        }, []);
    return (<div >
        <div className="w-full h-[100vh]  bg-[#F0FCFF] ">
          
            {loading ? (
                
                <div className="flex justify-center items-center h-[80vh]">
                    {/* ใช้ Spin จาก Ant Design */}
                    <Loading  />
                </div>
            ) : (
               <div className="w-full h-full">
                  <EmployeeBar page="*"/>
                  <EmSidebar page="Profile"/>
                  <div className="w-full h-[calc(100vh-60px)] flex justify-center">
                       <ProfileEmCom />
                  </div>
               
               </div>
              
            )}
            </div>
   


</div>)
}
export default ProfileUseEM