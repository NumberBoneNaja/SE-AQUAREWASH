
import { useEffect, useState } from 'react';
import Banner from '../../Components/Banner/Banner';
import CardPackage from '../../Components/Cardpackage/CardPackage';
import UserBar from '../../Components/Nav_bar/UserBar';
import './Order.css'
import Loading from '../../Components/Loader/Loading';
function Order(){
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
    return(
       
        <div className='w-full h-[100vh]  bg-base-blue-20 overflow-y-auto'>
            {
                loading ? (
                    <div className="flex justify-center items-center h-[100vh]">
                        {/* ใช้ Spin จาก Ant Design */}
                        <Loading  />
                    </div>
                ) : (
                    <div className='w-full '>
        
             <UserBar page="Order"/>
             
                <div className="w-full h-full flex justify-center ">
                
                    <div className="w-[95%] h-full flex justify-center">
                        <div className='w-full bottom-2'>
                            <Banner/>
                                <div className='m-[30px]'>
                                <h1 className="text-3xl font-semibold text-center">เลือกแพ็คเกจการบริการ</h1>
                                </div>
                            <div className='m-[30px]'>
                                    <CardPackage/> 
                                </div>   
                            
                        
                        </div>
                
                    </div>
                    
                </div>
      

        </div> 
                )
            }
         
       
        </div>  

    )
}
export default Order ;