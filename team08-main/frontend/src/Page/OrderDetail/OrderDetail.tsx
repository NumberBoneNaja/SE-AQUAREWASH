import { useParams } from "react-router-dom";
import OrderALLDetail from "../../Components/OrderClothDetail.tsx/OrderALLDetail";
import UserBar from "../../Components/Nav_bar/UserBar";
import StepperOrder from "../../Components/Stepper/SteperOrder";
import Loading from "../../Components/Loader/Loading";
import { useEffect, useState } from "react";


function Orderdetail() {
        const { id } = useParams<{ id: string }>();
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

        return (
            <div className="bg-base-blue-20 ">
                 {loading ? (
                    <div className="flex justify-center items-center h-[100vh]">
                        {/* ใช้ Spin จาก Ant Design */}
                        <Loading  />
                    </div>
                ) : (<div className="w-full max-h-[100vw] min-h-[100vh] h-fit  bg-base-blue-20  ">

                    <UserBar page="Order"/>
                    <div className="mt-2 w-full flex justify-center mb-5 ">
                       
                            <StepperOrder step={2}/>
                       
                    </div>
                    <div className="w-full h-full flex justify-center">
                      
                        <OrderALLDetail  id={id || ''}/>
                   
                    </div>
                   
                       
                </div>)}
                
             

            </div>
        );
    }

export default Orderdetail