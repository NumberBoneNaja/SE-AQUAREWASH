import { useEffect, useState } from "react";
import UserBar from "../../Components/Nav_bar/UserBar";
import ProFileCom from "../../Components/ProfileCom/ProfileCom";
import Loading from "../../Components/Loader/Loading";


function UserProfile() {
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
                
                  <UserBar page="Profile"/>
                  <div className="w-full h-[calc(100vh-60px)] flex justify-center">
                       <ProFileCom />
                  </div>
               
               </div>
              
            )}
            </div>
   


</div>)
}
export default UserProfile