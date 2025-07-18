
import { OrderInterface } from "../../interfaces/IOrder"
import { useEffect, useState } from "react"
import { FindID, GetALLOrderByUserID, PatchStateHis } from "../../services/https/index1"

import {   CancelOrder, CancelPaymentByOrderID, DeleteAddOnByOrderID, DeleteImageByOrderID, DeleteOrderDetailByOrderID, GetAddOnByOrderID, GetImageID, GetPaymentByOrderID} from "../../services/https"

import { message } from "antd"

import { AddOnInterface } from "../../interfaces/IAddOn"
import { ImageInterface } from "../../interfaces/IImage"
import { PaymentInterface } from "../../interfaces/IPayment"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import { HistoryRewardInterface } from "../../interfaces/IHistoryReward"



export const baseUrl = "https://api.aqua-wash.online/"
// export const baseUrl = "http//localhost:8000/"
function TableOrder() {

    const [orderdata,setOrderdata] = useState<OrderInterface[]>([])
    const [orderback,setOrderback] = useState<OrderInterface[]>([])
    const [imageCounts, setImageCounts] = useState<{ [key: number]: number }>({});
    const [showSolve, setShowSolve] = useState<{ [key: number]: boolean }>({});
    const [addondetail,setAddondetail] = useState<AddOnInterface[]>([]);
    const [image,setImage] = useState<ImageInterface[]>([])
    const [payment, setPayment] = useState<PaymentInterface | null>(null);
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    async function getallorder() {
        const uid = localStorage.getItem("id");
        const res = await GetALLOrderByUserID(Number(uid));
      

        const sortedData = res.data.sort((a: OrderInterface, b: OrderInterface) => 
            new Date(b.CreatedAt ?? 0).getTime() - new Date(a.CreatedAt ?? 0).getTime()
        );
        
        setOrderdata(sortedData);
        setOrderback(sortedData);
    }

    useEffect(() => {
        getallorder();
        
        // console.log("orderdata: ", orderdata);
    }, [])

    useEffect(() => {
        if (orderdata.length > 0) {
            fetchImageCounts();
        }
     
    }, [orderdata])

  
    async function fetchImageCounts() {
        const counts: { [key: number]: number } = {};
        for (const item of orderdata) {
            if (item.ID !== undefined) {
                counts[item.ID] = await countImage(item.ID);
            }
        }
        setImageCounts(counts);
    }

    async function countImage(id: number) {
        const res = await GetImageID(id);
        return res.length;
    }
    function filterMessageByProgress() {
      
        const fileters= orderback.filter((order) => order.OrderStatusID === 3);
        setOrderdata(fileters);
        setSelected(2);
    }
    function filterMessageByNotPaid() {
      
        const fileters= orderback.filter((order) => order.OrderStatusID === 1);
        setSelected(1);
        setOrderdata(fileters);
    }
    function filterMessageByDone() {
      
        const fileters= orderback.filter((order) => order.OrderStatusID === 4);
        setOrderdata(fileters);
        setSelected(3);
    }
    function filterMessageByAll() {
        setOrderdata(orderback);
        setSelected(0);
    }
    function toggleShowSolve(id: number) {
        setShowSolve((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    
    async function fetchDetail(id:number){
        const res = await GetAddOnByOrderID(Number(id));    
        setAddondetail(res.data);
        const res1 = await GetImageID(Number(id));
        setImage(res1);
        const res2 = await GetPaymentByOrderID(Number(id));
        setPayment(res2.data);
        
        
    }
   
    async function cancelOrder(id:number){// order id
            fetchDetail(id);
            try{
       
            
               if(addondetail.length !==0){
                   await DeleteAddOnByOrderID(Number(id));
               } 
               if(image.length !=0){
                   await DeleteImageByOrderID(Number(id))
               }
               await DeleteOrderDetailByOrderID(Number(id));
               await CancelOrder(Number(id));
               if(payment !== null){
                await CancelPaymentByOrderID(Number(id))
               }
               // คืนค่า
             const order = orderback.filter((order) => order.ID === id);
             const state :HistoryRewardInterface ={
                 State:"claimed"
             }
             await PatchStateHis(Number(order[0].HistoryRewardID),state)
      
                   message.open({
                       type: "success",
                       content: "ยกเลิก Order เรียบร้อย",
                       duration: 3
                   });
                   
                   
                      
               } catch(error) {
                   
                   message.open({
                       type: "error",
                       content: "ไม่สามารถยกเลิก Order ได้" ,
                       duration: 3
                   });
               }
               getallorder();
               setShowSolve((prev) => ({ ...prev, [id]: false }));
       
           }


    function gotoFollow(id:number){
       setTimeout(() => {
           navigate(`/FollowOrder/${id}`);
       },1000)
    }
    async function findpaymentIDFromOrder(id: number) {
        const res = await FindID(Number(id));
        if (res === 404 ) {
             setTimeout(() => {
                navigate(`/OrderDetail/${id}`);
             })
        }
        else{
            const payID = res.data.ID
            setTimeout(() => {
                navigate(`/Sliok/${payID}`);
            })
        }
 }   

    

    


    return (
        <div className="w-full flex justify-center">
            <div className="bg-white lg:w-[70%] h-[85vh] w-full
            
             mt-5 shadow-base-shadow rounded-lg flex flex-col items-center ">
                <p className="text-xl font-semibold text-center mt-5">รายการฝากซัก - อบ ทั้งหมด</p>
                    <div className="filter-data  w-[400px]  flex justify-between gap-5 mt-5  px-4 py-1 rounded-[10px]
                     bg-slate-400 relative
                     ">

                        <motion.div onClick={filterMessageByAll} className=""
                        initial={{ color: 0 === selected ? "#fff" : "#222" }}
                        animate={{ color: 0 === selected ? "#fff" : "#222" }}
                        transition={{ duration: 0.3 }}
                        >
                            ทั้งหมด
                        </motion.div>
                        <motion.div onClick={filterMessageByProgress}
                        initial={{ color: 2 === selected ? "#fff" : "#222" }}
                        animate={{ color: 2 === selected ? "#fff" : "#222" }}
                        transition={{ duration: 0.3 }}
                        >
                            กำลังดำเนินการ
                        </motion.div>
                        <motion.div onClick={filterMessageByNotPaid}
                         initial={{ color: 1 === selected ? "#fff" : "#222" }}
                         animate={{ color: 1 === selected ? "#fff" : "#222" }}
                         transition={{ duration: 0.3 }}
                        >
                            รอชําระเงิน
                        </motion.div>
                        <motion.div onClick={filterMessageByDone}
                        initial={{ color: 3 === selected ? "#fff" : "#222" }}
                        animate={{ color: 3 === selected ? "#fff" : "#222" }}
                        transition={{ duration: 0.3 }}
                        >
                            เสร็จสิ้น
                        </motion.div>

                  </div>
                 <div className="container-order md:w-[90%] w-full max-h-full h-fit mt-3 bg-[#F0FCFF] rounded-[10px] shadow-sm overflow-auto px-5 py-2
                  mb-5
                 ">
                    <div className="Card-order w-full">
                         <AnimatePresence>
                        {
                        
                            orderdata.map((item) => 
                            {
                                const status =(item as any).OrderStatusID == 1
                                ? "bg-[#FCCED6] text-base-red " 
                                : (item as any).OrderStatusID == 3
                                ? "bg-[#C0ECFC] text-blue-bg " 
                                : (item as any).OrderStatusID ==2
                                ? "bg-[#DED1FD] text-base-puple " 
                                : (item as any).OrderStatusID == 4
                                ? "bg-[#DDFFE5]  text-green-500 " 
                                :"bg-red-100 text-base-black "
                               
                               
                               const line =(item as any).OrderStatusID == 1
                               ? "border-base-red" 
                               : (item as any).OrderStatusID == 3
                               ? "border-blue-bg" 
                               : (item as any).OrderStatusID ==2
                               ? "border-base-puple"
                               :  (item as any).OrderStatusID == 4
                               ? "border-base-green"
                                : "border-base-black"
                              
                                const imageCount = imageCounts[Number(item.ID)] || 0;
                                return (
                                  
                                <motion.div key = {item.ID} className={`w-full max-h-[150px] h-fit bg-white my-2 px-4 py-2 rounded-[10px] shadow-sm border-l-[7px]
                                 ${line}
                                
                                `}
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1,y: 0 }}
                                exit={{ opacity: 0, x: -200 }}
                                transition={{ duration: 0.3 }}
                                > 
                                <div className=" flex justify-between h-full items-center">

                               
                                <div className="flex gap-4 ">
                                    <div className="h-full flex items-center ml-6">
                                        <img src={`${baseUrl}` +"images/packageimage/"+(item as any).Package.PackagePic} alt="" className="w-[80px] h-[80px] drop-shadow-md"/>{
                                       
                                        }
                                    </div>
                                    <div className="mt-2 w-[200px]">
                                       <p className="text-xl font-semibold text-base-black cursor-pointer hover:text-blue-bg duration-300" onClick={() => gotoFollow(Number(item.ID))}>{(item as any).Package.PackageName}</p>
                                       <p className="text-sm text-base-black-10 mt-[4px]">รหัสคำสั่ง : #{item.ID}</p>
                                       <p className="text-sm text-base-black-10 ">{(item as any).CreatedAt ? new Date((item as any).CreatedAt).toLocaleDateString('th-TH', {
                                                    day: '2-digit',   // วันที่ (2 หลัก)
                                                    month: '2-digit', // เดือน (2 หลัก)
                                                    year: 'numeric',  // ปี ค.ศ.
                                                }) : ""}</p>

                                       
                                    </div>
                                </div>
                                    
                                    <div className="h-full w-[15%]">
                                        <div className="flex flex-col gap-1">
                                            <p className={` ${status} w-fit px-2 rounded-[4px] 
                                         text-sm`
                                         }>
                                            {(item as any).OrderStatus.Status}</p>
                                            {imageCount === 0 && 
                                            <p className=" rounded px-2 py-0 w-fit 
                                         bg-[#A6A6A7]  text-base-black 
                                        text-sm">ไม่พบรูป</p>}
                                        </div>
                                        
                                    </div>
                                    
                                    <div className="h-full flex items-center mr-2">

                                     <p className="text-lg font-semibold text-base-black">${item.Price}</p>
                                   
                                    <div className="ml-4">
                                       <div className="flex justify-end gap-5">
                                            <div className="relative ">
                                                <button className="text-sm text-base-black" onClick={() => toggleShowSolve(Number(item.ID))}>⋮</button>
                                                {
                                                    showSolve[Number(item.ID)] && <div className="absolute right-0 mt-1 w-[100px] z-20  bg-white  rounded shadow-sm">
                                                    
                                                    {
                                                        (item as any).OrderStatusID == 1 ? (
                                                            <p className="text-sm text-base-red px-4 py-2 cursor-pointer"
                                                            onClick={() => cancelOrder(Number(item.ID))}>ยกเลิก</p>
                                                        ):(
                                                            <p className="text-sm text-base-black px-4 py-2 cursor-pointer"
                                                            onClick={() => gotoFollow(Number(item.ID))}>ติดตาม</p>
                                                        )
                                                    }
                                                    {imageCount === 0 && (
                                                        <p className="text-sm text-base-black px-4 py-2 cursor-pointer" onClick={() => gotoFollow(Number(item.ID))}>เพิ่มรูป</p>
                                                    )}
                                                    {(item as any).OrderStatusID == 1 && (
                                                        <p className="text-sm text-base-black px-4 py-2 cursor-pointer" onClick={()=>findpaymentIDFromOrder(Number(item.ID))}>ชำระเงิน</p>
                                                    )}

                                                </div>
                                                }
                                            
                                            </div>
                                        </div> 
                                    </div>
                                    </div>
                                 </div> 
                                 
                                 
                            
                                 
                                </motion.div>
                               
                            )})
                        }</AnimatePresence>
                    </div>
                </div> 
            </div>
            
            
        </div>
    )
}
export default TableOrder