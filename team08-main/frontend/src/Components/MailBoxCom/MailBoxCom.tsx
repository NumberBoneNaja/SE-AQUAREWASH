import { useEffect, useState } from "react";
import { NotificationInterface } from "../../interfaces/INotification";
import { GetNotificationByID, GetNotificationByUserID, UpdateStatusNotification } from "../../services/https/index1";
import { motion } from "framer-motion";
import { useUnreadNotification } from "../NotificationContax/UnreadNotificationContext ";

function MailBoxCom() {
    const [messagedata,setMessagedata] = useState<NotificationInterface[]>([]);
    const [readdata,setReaddata] = useState<NotificationInterface | null>(null);
    const { setUnreadCount } = useUnreadNotification();
    async function Notification(){
            const res = await GetNotificationByUserID(Number(localStorage.getItem("id")));
            const sortedMessages = res.data.sort(
                (a: NotificationInterface, b: NotificationInterface) => 
                  (b.CreatedAt ? new Date(b.CreatedAt).getTime() : 0) - (a.CreatedAt ? new Date(a.CreatedAt).getTime() : 0)
              );
    
              setMessagedata(sortedMessages); // กำหนดข้อมูลที่เรียงแล้วลงใน state
            // setBackMessage(sortedMessages);
            const unreadCount = sortedMessages.filter((item: NotificationInterface) => item.NotificationStatusID !== 2).length;
             setUnreadCount(unreadCount);
          
          }

    useEffect(() => {
        Notification();
      
    },[])
    useEffect(() => {
        
    },[messagedata,readdata])
    async function ReadMessage(id:number){
        const res = await GetNotificationByID(id)
        
        setReaddata(res.data);
        // console.log("setdata");

    }
    function formatTimeDifference(createdAt: Date): string {
        const createdDate = new Date(createdAt); // แปลงเวลาเป็น Date object
        const now = new Date(); // เวลาปัจจุบัน
        const diffMs = now.getTime() - createdDate.getTime(); // ความต่างหน่วยมิลลิวินาที
        const diffMinutes = Math.floor(diffMs / (1000 * 60)); // แปลงเป็นนาที
        const diffHours = Math.floor(diffMinutes / 60); // แปลงเป็นชั่วโมง
        const diffDays = Math.floor(diffHours / 24); // แปลงเป็นวัน
    
        // เงื่อนไขการแสดงผล
        if (diffMinutes < 60) {
            return `${diffMinutes} นาทีที่แล้ว`; // น้อยกว่า 1 ชั่วโมง
        } else if (diffHours < 24) {
            return `${diffHours} ชั่วโมงที่แล้ว`; // น้อยกว่า 24 ชั่วโมง
        } else {
            return `${diffDays} วันที่แล้ว`; // มากกว่า 24 ชั่วโมง
        }
    }
    async function makeRead(id:number){ 
            const status:NotificationInterface = {NotificationStatusID:2}
            await UpdateStatusNotification(id,status);
            Notification();
          
            ReadMessage(id);
        }
    

    return (
        <div className="w-full  flex justify-center">
           <div className="w-[80%]  bg-white h-[85vh] mt-5 rounded-lg 
           shadow-base-shadow p-3 grid grid-cols-3 gap-2" >
              <motion.div className="col-span-1  bg-base-blue-20 px-1 rounded-sm overflow-auto"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1,y: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.4 }}
              >
                     
                     {
                         messagedata.map((item) => (
                             <div className={`w-full h-[70px]  rounded-sm mt-2 
                             flex justify-between items-center px-2  ${(item as any).NotificationStatusID === 2 ? "" : "bg-white shadow-sm "}
                              `} key={item.ID}>
                                 <div className="flex items-center">
                                               <img src="../icon/support_1155232.png" alt="" className="w-[50px] rounded-full" />
                                            </div>
                                            <div className="my-2 w-[80%]" 
                                            onClick={(e) => e.stopPropagation()}>
                                               <p className={`text-[16px]  truncate
                                                hover:underline  duration-300 
                                               transition ease-in-out cursor-pointer 
                                               ${(item as any).NotificationStatusID === 2 ? "text-base-black-10" : "text-base-black hover:text-blue-bg font-semibold"} `}
                                              
                                              onClick={() => makeRead(Number(item.ID))}
                                              >{item.Title}</p>
                                               <p className="text-[10px] text-base-black-10 truncate
                                             ">{item.Message}</p> 
                                        <div className="flex justify-between w-full">
                                           <p className="text-[10px] text-base-black-10">
                                            {item.CreatedAt
                                                ? new Date(item.CreatedAt).toLocaleDateString('th-TH', {
                                                    day: '2-digit',   // วันที่ (2 หลัก)
                                                    month: '2-digit', // เดือน (2 หลัก)
                                                    year: 'numeric',  // ปี ค.ศ.
                                                })
                                                : ''}
                                            </p>
                                            <p className="text-[10px] text-base-black-10">
                                             {item.CreatedAt ? formatTimeDifference(item.CreatedAt) : ''}</p>
                                            </div> 
                                            </div>
                             </div>
                         ))
                     }
              </motion.div>
              <div className="col-span-2">
               
                        {readdata ? (
                            <div className="w-full h-full p-2 ">

                              <div className="flex gap-3 items-end border-b-[1px] pb-2">
                              <img src="../icon/support_1155232.png" alt="" className="w-[50px] rounded-full" />
                                <div>
                                    <p>AQAREWASH.CO</p>
                                    <p className="text-[10px] text-base-black-10">
                                    {readdata.CreatedAt ? formatTimeDifference(readdata.CreatedAt) : ''}</p>
                                </div>
                              </div>
                              <div>
                              <p className="text-[16px] font-bold my-3">เรื่อง {readdata.Title}</p>
                              </div>
                              <div>
                                <p>{readdata.Message}</p>
                              </div>
                            
                            </div>
                        ) : (
                            <div className="w-full h-full flex justify-center items-center">
                            <p className="text-2xl text-base-black-10 ">เลือกข้อความที่ต้องการอ่าน</p>
                            </div>
                        )}
                        </div>

           </div>
        </div>
    )
}export default MailBoxCom