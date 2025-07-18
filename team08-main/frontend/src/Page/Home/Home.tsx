import { useEffect, useState } from "react";
import Add from "../../Components/HomeCom/Add";
import Poster from "../../Components/HomeCom/Poster";
import Service from "../../Components/HomeCom/Service";
import UserBar from "../../Components/Nav_bar/UserBar";
import PostList from "../Post/Allpost";
// import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetMembershipPaymentByUserIDHistory, GetMembershipPaymentsByUserID, GetUserById, SoftDeleteMembershipPayment, UpdateUserStatus } from "../../services/https";
import { message } from "antd";

import { TiSocialFacebookCircular } from "react-icons/ti";
import { SlSocialGithub } from "react-icons/sl";
import { MdOutlineEmail } from "react-icons/md";

function Home() {
    
    const [_fade, setFade] = useState(true); 
    // const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");


    const token = localStorage.getItem("token")

    useEffect(() => {
      console.log("token is : ",token)
        if (token !== null) {
           
            fetchUserData(userIdstr || '');
            fetchPaymentData(userIdstr || '');
        } else {
            window.location.reload()
        }
    }, [userIdstr]);


    const fetchUserData = async (userIdstr: string ) => {
      console.log("token:", localStorage.getItem("token"));
        try {
            console.log("Fetching user with ID:", userIdstr);
            const res = await GetUserById(userIdstr);
            console.log("API Response:", res); // เพิ่ม log นี้
            if (res.status === 200) {
                // setUser(res.data);
                message.success("พบข้อมูลUser");
                //config ต่อ
                console.log("status in face:",res.data);

            }else {
              if(res.status === 401){
                window.location.href = '/Home';
              }
              message.error(`เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
                message.error("error");
            }
        } catch (error) {
          
          

            console.error("Error fetching user data:", error); // Debug
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
            
        }
  };

    const fetchPaymentData = async (userIdstr: string) => {
        try {
            console.log("user id:", userIdstr);
            
            const res = await GetMembershipPaymentsByUserID(userIdstr);
            const userIdInt = parseInt(userIdstr, 10); // แปลงจาก string เป็น integer
            const res2 = await GetMembershipPaymentByUserIDHistory(userIdInt);
            console.log("res GetMembershipPaymentsByUserID:", res);
            if (res2.status === 200) {
                message.success("พบข้อมูล Payment Member ship history");
                
            } else {
                message.error("ยังไม่มีการสมัครสมาชิก กรุณาสมัครก่อนใช้งาน");
            }
            
            if (res.status === 200) {
                
                message.success("พบข้อมูล Payment Member ship");
                
                // Check if there is payment data and it has expired
                if (res.data && res.data.length > 0) {
                    const payment = res.data[0]; // Assuming we're working with the most recent payment
                    
                    if (new Date() > new Date(payment.DateEnd)) {
                        console.log("หมดอายุ.");
                        message.error("หมดอายุการใช้งาน กรุณาต่ออายุ");
                        
                        // Update user status
                        try {
                            const updateStatusRes = await UpdateUserStatus(userIdstr);
                            if (updateStatusRes.status === 200) {
                                console.log("อัพเดทสถานะเรียบร้อย");
                                message.success("อัพเดทสถานะเรียบร้อย");
                            } else {
                                console.log("อัพเดทสถานะไม่สำเร็จ");
                                message.error("อัพเดทสถานะไม่สำเร็จ");
                            }
                        } catch (error) {
                            console.error("Error updating user status:", error);
                            message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
                        }
                        
                        // Soft delete the membership payment using the payment ID
                        try {
                            const softDeleteRes = await SoftDeleteMembershipPayment(payment.ID.toString());
                            if (softDeleteRes.status === 200) {
                                console.log("ลบเรียบร้อย");
                                message.success("ลบเรียบร้อย");
                            } else {
                                console.log("ลบไม่สำเร็จ");
                                message.error("ลบไม่สำเร็จ");
                            }
                        } catch (error) {
                            console.error("Error soft deleting payment:", error);
                            message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
                        }
                    } else {
                        console.log("ใช้ได้ต่อ.");
                        message.success("ยังสามารถใช้งานได้ต่อ");
                    }
                }
            } else {
                message.error("ยังไม่มีการสมัครสมาชิก กรุณาสมัครก่อนใช้งาน");
            }
        } catch (error) {
            console.error("Error fetching payment data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูล Payment");
        } 
    };
   
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
             
        }, 8000); 

        return () => clearInterval(interval);
    }, []);

    return <div>
                <div className="w-full  bg-base-blue-20 border-2">
                     <UserBar page="Home"/>
                     <Poster/>
                     <Service/>
                     <Add/>
                     <PostList/>
                      <div>
                             <footer className="footer">
                               <div className="social-links">
                                 <a href="https://www.facebook.com/profile.php?id=61568079718310" target="_blank" className="social-icon facebook">
                                   <i className="fab fa-facebook"><TiSocialFacebookCircular /></i> Facebook
                                 </a>
                                 <a href="https://github.com/sut67/team08" target="_blank" className="social-icon github">
                                   <i className="fab fa-github"><SlSocialGithub /></i> GitHub
                                 </a>
                                 <a href="mailto:jakkapanjarcunsook@gmail.com" className="social-icon email">
                                   <i className="fas fa-envelope"><MdOutlineEmail /></i> Email
                                 </a>
                               </div>
                               <p>&copy; 2021 AQUA WASH Co</p>    
                             </footer>
                           </div>
                </div>
        
        </div>;
}
export default Home