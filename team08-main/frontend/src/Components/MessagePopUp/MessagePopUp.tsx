import { useEffect, useState } from "react";
import { GetNotificationByUserID, UpdateStatusNotification } from "../../services/https/index1";
import { NotificationInterface } from "../../interfaces/INotification";

import { AnimatePresence, motion } from "framer-motion";
import { useUnreadNotification } from "../NotificationContax/UnreadNotificationContext ";

interface MessagePopUpProps {
    show: boolean
    close: (close :boolean) => void
    
}

function MessagePopUp({show, close}: MessagePopUpProps) {
      const [message,setMessage] = useState<NotificationInterface[]>([]);
      const [backmessage, setBackMessage] = useState<NotificationInterface[]>([]);
      const [count, setCount] = useState<number>(0);
      const { setUnreadCount } = useUnreadNotification();
      async function Notification(){
        const res = await GetNotificationByUserID(Number(localStorage.getItem("id")));
        const sortedMessages = res.data.sort(
            (a: NotificationInterface, b: NotificationInterface) => 
              (b.CreatedAt ? new Date(b.CreatedAt).getTime() : 0) - (a.CreatedAt ? new Date(a.CreatedAt).getTime() : 0)
          );

        setMessage(sortedMessages); // กำหนดข้อมูลที่เรียงแล้วลงใน state
        setBackMessage(sortedMessages);
        // console.log(sortedMessages);
      }
      
      useEffect(() => {
        Notification();
        
        // console.log('Count: ',count);
        
      },[])
      useEffect(() => {
        CountUnread();
      },[message])
    
     
     
      
      
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

    function filterMessageByRead() {
      
        const read= backmessage.filter((message) => message.NotificationStatusID === 2);
        setMessage(read);
    }
    function filterMessageByUnread() {
       
        const read= backmessage.filter((message) => message.NotificationStatusID === 1);
        setMessage(read);
    }

    function filterMessageByAll() {
        setMessage(backmessage);
    }

    async function makeRead(id:number){ {
        const status:NotificationInterface = {NotificationStatusID:2}
        await UpdateStatusNotification(id,status);
        Notification();

    }
   
  }
  function CountUnread(){
    const unread = backmessage.filter((message) => message.NotificationStatusID === 1);
    
    // console.log('unread:',unread.length);
    setCount(unread.length);
  
    setUnreadCount(unread.length);


  }
    return (
         
    
            <AnimatePresence > 
             {show && 
              (
           
                <div className="fixed z-[10] h-[100vh] inset-0 w-[100vw]" >
                   
                      <motion.div className="w-[370px] max-h-[450px] h-fit  bg-white absolute top-[62px] right-[80px] rounded-[10px] shadow-base-shadow
                      pt-4  flex flex-col justify-between
                      "
                      initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              
                              transition={{ duration: 0.1, ease: "easeOut",type : "spring",bounce : 0.25,
                                  stiffness : 100,mass : 0.5,damping : 10,velocity : 0,restDelta : 0.01
                                  ,restSpeed : 0
                               }}                      
                              
                      >
                        <div className="notification-header border-b-[1px] pb-1  flex flex-col justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                           <div className="flex  ">
                            <p className="text-[16px] font-semibold pl-2 ">การแจ้งเตือน</p>
                            <div className="flex items-center ml-4">
                                <p className="text-[12px] text-white px-2  bg-base-red rounded-full">{count}</p>
                            </div>
                           </div>
                            
                            <div className="flex gap-4 pl-2">
                                <p className="text-[14px] text-base-black" onClick={filterMessageByAll}>ทั้งหมด</p>
                                <p className="text-[14px] text-base-black" onClick={filterMessageByUnread}>ยังไม่อ่าน</p>
                                <p className="text-[14px] text-base-black" onClick={filterMessageByRead}>อ่านแล้ว</p>
                            </div>
                        </div>
                        <div className="notification-message overflow-y-auto bg-base-blue-20 px-1">
                            {
                                message.map((item) => (
                                    <div className={`w-full h-[70px] flex flex-col rounded-[10px] my-1 px-1 relative 
                                        ${(item as any).NotificationStatusID === 2 ? "text-base-black-10 " : "bg-white shadow-sm  "}`}
                                    key={item.ID}
                                    >  
                                    
                                        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
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
                                        
                                    </div>
                                ))
                            }
                                 
                        </div>
                        <div className="notification-footer border-t-[1px] w-full flex justify-center" onClick={() => close(false)}>
                           <p className="text-[14px] text-base-black py-1 w-fit hover:text-blue-bg duration-300 cursor-pointer">ปิด</p>
                        </div>
                          
                      </motion.div>
                      
                </div>
              
              )
             } </AnimatePresence>
          
         
    )
}export default MessagePopUp