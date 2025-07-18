import { useEffect, useState } from "react"
import { OrderInterface } from "../../interfaces/IOrder"
import { CreateNotificationFromOrder, GetAllOrder, GetOrderByID, PatchStatus } from "../../services/https/index1"
import { useNavigate } from "react-router-dom"
import { message } from "antd"
import { GetImageID } from "../../services/https"
import { motion } from "framer-motion"
import { NotificationInterface } from "../../interfaces/INotification"
import { baseUrl } from "../ShowALLOrder/TableOrder"

function Work(){
    const [orderdata,setOrderdata] = useState<OrderInterface[]>([])
    const [orderWork,setOrderWork] = useState<OrderInterface[]>([])
    const [orderProcess,setOrderProcess] = useState<OrderInterface[]>([])
    const [orderFinish,setOrderFinish] = useState<OrderInterface[]>([])

    const navigate = useNavigate();
    async function fetchAllOrder() {
        const res = await GetAllOrder();
        const sortedData = res.data.sort((a: OrderInterface, b: OrderInterface) => 
            new Date(b.CreatedAt ?? 0).getTime() - new Date(a.CreatedAt ?? 0).getTime()
        );
    
        setOrderdata(sortedData);
        filterOrderByDone(sortedData);
        filterOrderByProgress(sortedData);
    
        // รอให้ imageCounts โหลดเสร็จก่อนเรียกกรองข้อมูล
      
       console.log("fetchAllOrder:", sortedData);
        filtertOrderByPaid(sortedData);
    }
    
         function filterOrderByProgress(data: OrderInterface[]) {
            const fileters1 = data.filter((order: OrderInterface) => order.OrderStatusID === 3);
            setOrderProcess(fileters1);
        }
        
        async function filtertOrderByPaid(data: OrderInterface[]) {
            // รอให้ข้อมูล imageCounts ถูกอัปเดต
            const counts = await fetchImageCounts(data);
            
            const filtered = data.filter(
                (order: OrderInterface) =>
                    order.OrderStatusID === 2 && counts[Number(order.ID)] > 0
            );
        
            // console.log("filtertOrderByPaid:", filtered);
            setOrderWork(filtered);
        }
        async function countImage(id: number) {
            const res = await GetImageID(id);
            // console.log(`Images for Order ID ${id}:`, res); // ตรวจสอบข้อมูล
            return res.length;
        }

        
        async function fetchImageCounts(data: OrderInterface[]) {
            const counts: { [key: number]: number } = {};
        
            for (const item of data) {
                if (item.ID !== undefined) {
                    counts[item.ID] = await countImage(item.ID);
                }
            }
        
            // ส่งค่า counts กลับไปแทนที่จะ setState ทันที
            return counts;
        }

        function filterOrderByDone(data: OrderInterface[]) {
            const sortedData = data.sort((a: OrderInterface, b: OrderInterface) => 
                new Date((b as any).UpdatedAt ?? 0).getTime() - new Date((a as any).UpdatedAt ?? 0).getTime()
            );
            const fileters3 = sortedData.filter((order: OrderInterface) => order.OrderStatusID === 4);
            setOrderFinish(fileters3);
        }

        
        async function toprogress(id:number){
            try{
              const data :OrderInterface = {
                 OrderStatusID:3
             }
             await PatchStatus(Number(id),data)
             message.open({
                type: 'success',
                content: 'กําลังดําเนินการ คำสั่งนี้',
                duration: 3
             })
             const uid = await GetOrderByID(Number(id))
              const notificatin:NotificationInterface = {
                                     Title:"รายการฝากซัก-อบ กำลังดำเนินการ!",
                                     Message:"ตอนนี้พนักงานได้ทำการับตะกร้าผ้าของท่านเรียบร้อยแล้ว ขั้นตอนต่อไปจะเป็นการดำเนินการ ขอบคุณที่ใช้บริการ",
                                     NotificationStatusID:1,
                                     OrderID:Number(id),
                                     UserID:Number(uid.data[0].UserID)
                                 }
                                 await CreateNotificationFromOrder(notificatin)
            }
            catch(error){
                message.open({
                    type: 'error',
                    content: 'เกิดข้อผิดพลาดในการดําเนินการ',
                    duration: 3
                })
            }finally{
                fetchAllOrder()
            }
          }
          async function tofinish(id:number){
            try{
              const data :OrderInterface = {
                 OrderStatusID:4
             }
             await PatchStatus(Number(id),data)
             message.open({
                type: 'success',
                content: 'กําลังดําเนินการ คำสั่งนี้',
                duration: 3
             })
              const uid = await GetOrderByID(Number(id))
              

              const notificatin:NotificationInterface = {
                                     Title:"รายการฝากซัก-อบ ดำเนินการเสร็จสิ้น!",
                                     Message:"ตอนนี้รายการฝากซัก-อบของท่านได้ดำเนินการเสร็จสิ้นแล้ว สามารถมารับตะกร้าของท่านตามจุดที่ทางร้านกำหนด ขอบคุณที่ใช้บริการ",
                                     NotificationStatusID:1,
                                     OrderID:Number(id),
                                     UserID:Number(uid.data[0].UserID)
                                 }
                                 await CreateNotificationFromOrder(notificatin)
            
            }
            catch(error){
                message.open({
                    type: 'error',
                    content: 'เกิดข้อผิดพลาดในการดําเนินการ',
                    duration: 3
                })
            }finally{
                fetchAllOrder()
            }
          }

    useEffect(() => {
         fetchAllOrder();  
        
       
         }, []);
   useEffect(() => {
    if (orderdata.length > 0) {
        fetchImageCounts(orderdata);
    }
   }, [orderdata]);

         function gotoFollow(id:number){
            setTimeout(() => {
                navigate(`/EmployeeFollowOrder/${id}`);
            })
        }
    return(
        <div className="w-full h-full flex justify-center">
            <div className="bg-white lg:w-[80%] w-full mt-2 shadow-base-shadow rounded-lg flex flex-col
            h-[87%] py-2 px-2
            items-center ">
               <p className="text-xl mb-6">กระดานทำงาน </p>
               <div className="w-[100%]  h-[100%] grid grid-cols-3 gap-5">

                   <div className="w-full h-[100%] "
                   
                   >  <div className="bg-base-puple px-2 py-1 rounded-t-[5px]">
                          <p className="text-white">งาน</p>
                      </div>
                       <div className="bg-base-blue-20 w-full h-[72vh] rounded-b-[5px] px-2  overflow-y-auto"
                       > 
                             {
                                 orderWork.map((item) => (
                                    <motion.div className="w-full h-[70px] bg-white rounded-[5px] mt-2 
                                    border-l-4 border-x-base-puple" key={item.ID}
                                    initial={{ opacity: 0, y: -100 }}
                                    animate={{ opacity: 1,y: 0 }}
                                    exit={{ opacity: 0, x: -200 }}
                                    transition={{ duration: 0.3 ,delay:0.1}}
                                    >
                                         <div className=" flex justify-between h-full items-center">

                               
                                     <div className="flex gap-4 h-full ">
                                        <div className="h-full flex items-center ml-6">
                                            <img src={`${baseUrl}` +"images/packageimage/"+(item as any).Package.PackagePic} alt="" className="w-[50px] h-[50px] drop-shadow-md"/>
                                        </div>
                                        <div className="mt-2 w-[200px]">
                                        <p className="text-md font-semibold text-base-black cursor-pointer hover:text-blue-bg duration-300" onClick={() => gotoFollow(Number(item.ID))}>{(item as any).Package.PackageName}</p>
                                        <p className="text-[10px] text-base-black-10 mt-[4px]">รหัสคำสั่ง : #{item.ID}</p>
                                        <p className="text-[10px] text-base-black-10 ">{(item as any).CreatedAt ? new Date((item as any).CreatedAt).toLocaleDateString('th-TH', {
                                                        day: '2-digit',   // วันที่ (2 หลัก)
                                                        month: '2-digit', // เดือน (2 หลัก)
                                                        year: 'numeric',  // ปี ค.ศ.
                                                    }) : ""}</p>

                                        
                                            </div>
                                        </div>
                                                
                                             <div className="h-full flex items-center justify-center ">
                                                       
                                                       <div className=" flex  bg-[#DED1FD] rounded-full items-center justify-center w-[31px] h-[31px]">
                                                           <button className="text-[10px] text-base-black-10 ml-1  " onClick={() => toprogress(Number(item.ID))}
                                                           ><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                           width="24pt" height="24pt" viewBox="0 0 512.000000 512.000000"
                                                           preserveAspectRatio="xMidYMid meet">
                                                          
                                                          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                          fill="#7540EE" stroke="none">
                                                          <path d="M1855 3986 c-97 -45 -152 -139 -142 -244 2 -33 13 -74 22 -93 9 -19
                                                          254 -271 543 -561 l527 -528 -527 -527 c-289 -291 -534 -543 -543 -562 -27
                                                          -53 -31 -142 -10 -197 53 -138 209 -202 340 -140 71 34 1294 1259 1324 1326
                                                          13 28 21 66 21 100 0 34 -8 72 -21 100 -30 67 -1253 1292 -1324 1326 -67 32
                                                          -143 32 -210 0z"/>
                                                          </g>
                                                          </svg></button>
                                                       </div>
                                                       
                                                   </div>
                                                
                                                <div className="h-full flex items-center mr-2">

                                               
                                            
                                                <div className="ml-4">
                                                <div className="flex justify-end gap-5">
                                                        <div className="relative ">
                                                        
                                                        
                                                        
                                                        </div>
                                                    </div> 
                                                </div>
                                                </div>
                                            </div> 
                                    </motion.div>
                                 ))
                             }
                       </div>
                   </div>
                   <div className="w-full h-[100%] ">
                   <div className="bg-blue-bg px-2 py-1 rounded-t-[5px]">
                          <p className="text-white">กำลังดำเนินการ</p>
                      </div>
                     
                        <motion.div className="bg-base-blue-20 w-full h-[72vh] rounded-[5px] px-2  overflow-y-auto"
                        
                        >
                                {
                                    orderProcess.map((item) => (
                                        <motion.div className="w-full h-[70px] bg-white rounded-[5px] mt-2 
                                        border-l-4 border-x-blue-bg" key={item.ID}
                                        initial={{ opacity: 0, y: -100 }}
                                        animate={{ opacity: 1,y: 0 }}
                                        exit={{ opacity: 0, x: -200 }}
                                        transition={{ duration: 0.3,delay:0.1} }
                                        >
                                            <div className=" flex justify-between h-full items-center">

                                
                                        <div className="flex gap-4 h-full ">
                                            <div className="h-full flex items-center ml-6">
                                                <img src="../icon/sneakers_1334203.png" alt="" className="w-[50px] h-[50px] drop-shadow-md"/>
                                            </div>
                                            <div className="mt-2 w-[200px]">
                                            <p className="text-md font-semibold text-base-black cursor-pointer hover:text-blue-bg duration-300" onClick={() => gotoFollow(Number(item.ID))}>{(item as any).Package.PackageName}</p>
                                            <p className="text-[10px] text-base-black-10 mt-[4px]">รหัสคำสั่ง : #{item.ID}</p>
                                            <p className="text-[10px] text-base-black-10 ">{(item as any).CreatedAt ? new Date((item as any).CreatedAt).toLocaleDateString('th-TH', {
                                                            day: '2-digit',   // วันที่ (2 หลัก)
                                                            month: '2-digit', // เดือน (2 หลัก)
                                                            year: 'numeric',  // ปี ค.ศ.
                                                        }) : ""}</p>

                                            
                                                </div>
                                            </div>
                                                    
                                                    <div className="h-full flex items-center justify-center ">
                                                       
                                                        <div className=" flex  bg-[#C0ECFC] rounded-full justify-center items-center w-[31px] h-[31px]">
                                                            <button className="text-[10px] text-base-black-10 ml-1  " onClick={() => tofinish(Number(item.ID))}
                                                            ><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                            width="24pt" height="24pt" viewBox="0 0 512.000000 512.000000"
                                                            preserveAspectRatio="xMidYMid meet">
                                                           
                                                           <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                           fill="#00BBF0" stroke="none">
                                                           <path d="M1855 3986 c-97 -45 -152 -139 -142 -244 2 -33 13 -74 22 -93 9 -19
                                                           254 -271 543 -561 l527 -528 -527 -527 c-289 -291 -534 -543 -543 -562 -27
                                                           -53 -31 -142 -10 -197 53 -138 209 -202 340 -140 71 34 1294 1259 1324 1326
                                                           13 28 21 66 21 100 0 34 -8 72 -21 100 -30 67 -1253 1292 -1324 1326 -67 32
                                                           -143 32 -210 0z"/>
                                                           </g>
                                                           </svg></button>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                    <div className="h-full flex items-center mr-2">
                                                    </div>
                                                </div> 
                                        </motion.div>
                                    ))
                                }
                       
                       </motion.div>
                   </div>
                   <div className="w-full h-[100%] ">
                        <div className="bg-base-green px-2 py-1 rounded-t-[5px]">
                                <p className="text-white">งาน</p>
                            </div>
                       <div className="bg-base-blue-20 w-full h-[72vh] rounded-[5px] px-2  overflow-y-auto"
                       
                       >
                                {
                                    orderFinish.map((item) => (
                                        <motion.div className="w-full h-[70px] bg-white rounded-[5px] mt-2 
                                        border-l-4 border-x-base-green" key={item.ID}
                                           initial={{ opacity: 0, y: -100 }}
                                            animate={{ opacity: 1,y: 0 }}
                                            exit={{ opacity: 0, x: -200 }}
                                            transition={{ duration: 0.3 ,delay:0.1}}
                                        >
                                            <div className=" flex justify-between h-full items-center">

                                
                                        <div className="flex gap-4 h-full ">
                                            <div className="h-full flex items-center ml-6">
                                                <img src="../icon/sneakers_1334203.png" alt="" className="w-[50px] h-[50px] drop-shadow-md"/>
                                            </div>
                                            <div className="mt-2 w-[200px]">
                                            <p className="text-md font-semibold text-base-black cursor-pointer hover:text-blue-bg duration-300" onClick={() => gotoFollow(Number(item.ID))}>{(item as any).Package.PackageName}</p>
                                            <p className="text-[10px] text-base-black-10 mt-[4px]">รหัสคำสั่ง : #{item.ID}</p>
                                            <p className="text-[10px] text-base-black-10 ">{(item as any).CreatedAt ? new Date((item as any).CreatedAt).toLocaleDateString('th-TH', {
                                                            day: '2-digit',   // วันที่ (2 หลัก)
                                                            month: '2-digit', // เดือน (2 หลัก)
                                                            year: 'numeric',  // ปี ค.ศ.
                                                        }) : ""}</p>

                                            
                                                </div>
                                            </div>
                                                    
                                                    <div className="h-full flex items-center">
                                                        <div className=" flex jusutify-center rounded-full bg-base-green-10">
                                                            <button className="text-[10px] text-base-black-10 m-1 " 
                                                            ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="23" height="23" viewBox="0 0 24 24" fill="#80ED99">
                                                            <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
                                                            </svg></button>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                    <div className="h-full flex items-center mr-2">
                                                    </div>
                                                </div> 
                                        </motion.div>
                                    ))
                                }
                       
                       </div>
                   </div>
               </div>
            </div>
        </div>
    )
}export default Work