import { useEffect, useState } from "react";
import { OrderDetailInterface } from "../../interfaces/IOrderDetail";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { CancelOrder, CreatePayment, DeleteAddOnByOrderID, DeleteImageByOrderID, DeleteOrderDetailByOrderID, DeleteReward, GetAddOnByOrderID, GetClothDetailByOrderID, GetImageID, GetUserById, UpdateUserByid } from "../../services/https";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { message } from "antd";
import { ImageInterface } from "../../interfaces/IImage";
import { PaymentInterface } from "../../interfaces/IPayment";
import { CreateNotificationFromOrder, GetOrderByID, GetUserID, PatchStateHis} from "../../services/https/index1";
import { OrderInterface } from "../../interfaces/IOrder";
import { NotificationInterface } from "../../interfaces/INotification";

import { UsersInterface } from "../../interfaces/UsersInterface";
import { HistoryRewardInterface } from "../../interfaces/IHistoryReward";

function OrderALLDetail({id}:{id:string}) { //order ID
   
    const [clothdetail, setClothdetail] = useState<OrderDetailInterface[]>([]);
    const [addondetail,setAddondetail] = useState<AddOnInterface[]>([]);
    const [image,setImage] = useState<ImageInterface[]>([])
    const [Order,setOrder] = useState<OrderInterface | null>(null);
    const navigate = useNavigate();
    
    async function fetchClothdetail() {
      

        const res = await GetClothDetailByOrderID(Number(id));    
        setClothdetail(res.data);
        // console.log("clothdetail: ", res.data);
       
    }
    async function fetchAddondetail() {
     
        const res = await GetAddOnByOrderID(Number(id));    
        setAddondetail(res.data);
        // console.log("Addondetail: ", res.data);
    }

    async function fetchImageProff() {
       
        const res = await GetImageID(Number(id))
        setImage(res)

        
    }

    async function fetchorder(){
        const res = await GetOrderByID(Number(id));
        // console.log("order: ",res.data[0])
        setOrder(res.data[0])
    }

    
    useEffect(() => {
        fetchClothdetail();
        fetchAddondetail();
        fetchImageProff();
        fetchorder();
       
    },[]);

    useEffect(() => {
  
    },[clothdetail,addondetail,image,Order]);

    useEffect(() => {
        // if (Order) {
        //     console.log("Order test: ",Order.Price);
        // }
    }, [Order]);
    
    
    async function Cancel() {
       
        

     try{

     
        if(addondetail.length !==0){
            await DeleteAddOnByOrderID(Number(id));
        } 
        if(image.length !=0){
            await DeleteImageByOrderID(Number(id))
        }
        await DeleteOrderDetailByOrderID(Number(id));
        await CancelOrder(Number(id));
        // await CancelPaymentByOrderID(Number(id))
    
            message.open({
                type: "success",
                content: "ยกเลิก Order เรียบร้อย",
                duration: 3
            });

            if (Order?.HistoryRewardID !== 0) {
                // console.log("hisID",Order?.HistoryRewardID)
                const state:HistoryRewardInterface = {
                    State:"claimed"
                }
                await PatchStateHis(Number(Order?.HistoryRewardID),state)
               
                
            }
            // console.log("QuotaUsed: ",Order?.QuotaUsed)
             if (Order?.QuotaUsed === true) {
                const uid =localStorage.getItem("id");
                const res = await GetUserById(uid || "");
                // console.log("res: ", res);
                const plusQuota:UsersInterface = {
                    QuotaOrder:Number(res.data.QuotaOrder) + 1
                } 
               
                await UpdateUserByid(uid || "",plusQuota);
            //  console.log("res: ", res);
            }
            setTimeout(() => {
                navigate(`/Order`);
              }, 1000);
            
            
        } catch(error) {
            
            message.open({
                type: "error",
                content: "ไม่สามารถยกเลิก Order ได้" ,
                duration: 3
            });
        }
     

    }

    function checkPrice(){
        if(Order?.Price===0){
            return 2
        }else{
            return 1
        }
    }
    async function NextPage(){
        // console.log("price: ",Order?.Price)
            const uid = Number(localStorage.getItem("id"))
            const PayID = checkPrice()
            // console.log("payID",PayID)
            const PaymentData:PaymentInterface = {
                Price: Number(Order?.Price) - Number(Order?.Discount),
                PaymentStart:new Date(),
               
                PaymentStatusID: PayID,
                OrderID:Number(id),
                UserID:uid
            }
            // console.log("payment",PaymentData)
          const res = await CreatePayment(PaymentData)
          if(Order?.HistoryRewardID !== 0){
              await DeleteReward(Number(Order?.HistoryRewardID))
          }
           

          //ส่งข้อความ
          const notificatin:NotificationInterface = {
            Title:"ยืนยัน Order ของคุณถูกสร้างเรียบร้อยแล้ว!",
            Message:"ยืนยัน Order ของคุณถูกสร้างเรียบร้อยแล้ว! ขอบคุณที่ใช้บริการ",
            NotificationStatusID:1,
            OrderID:Number(id),
            UserID:uid
        }
        await CreateNotificationFromOrder(notificatin)
            setTimeout(() => {
                if(Order?.Price !== 0){
                 

                   navigate(`/Sliok/${res.data.ID}`); 
                }
                else{
                    Patchpoint()
                    navigate(`/AllOrderUser`);
                }
                
              }, 1000);

           
        
    }
    async function Patchpoint(){
        
        const uid = localStorage.getItem("id");
        const user = await GetUserID(Number(uid))
        const order = await GetOrderByID(Number(id))
        // console.log("point: ",user.Point)
        console.log("user: ",order.data[0].ExpecterdPoint)
        const point:UsersInterface={
                    Point:Number(user.Point) + Number(order.data[0].ExpecterdPoint)
        }
        console.log("point: ",point)
       
        await UpdateUserByid(uid || "",point)
        }
         
         function checktext(){
            if (Order?.Price === 0) {
                return "เสร็จสิ้น"
            }else{
                return "ชำระเงิน"
            }
         }

        return (
            <div className="w-full h-full flex justify-center">
                <div className="w-[810px] max-h-[800px] h-fit  rounded-lg  bg-white">
                    <div className="w-full h-[70px] bg-gradient-to-tl from-cyan-400 to-sky-400 rounded-t-lg ">
                        <div className="w-full h-full flex justify-center items-center">
                            <img src="../icon/logo-1.1.png" alt="" className="w-[140px] " />
                            
                        </div>

                    </div>
              
                    <p className="text-xl text-center my-3 text-base-black">ประเภทผ้า</p>
                    <div className="w-full flex justify-center">
                        <div className="w-full max-w-[730px] overflow-x-auto  sm:rounded-t-lg ">
                            <table className="w-full text-sm text-left rtl:text-right text-base-black  table-auto">
                                <thead className="text-xs text-base-black uppercase bg-blue-bg-10 ">
                                    <tr >
                                        <th scope="col" className="px-6 py-3">
                                            ลำดับ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            ชนิดผ้า
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            จำนวน
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-end">
                                            ราคา
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clothdetail.map((item, index) => (
                                        <tr
                                            key={item.ID}
                                            className=" odd:bg-white even:bg-[#FBFBFB]  "
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium "
                                            >
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4 text-center">
                                                {(item as any).ClothType?.TypeName || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center">{item.Quantity}</td>
                                            <td className="px-6 py-4 text-end">{item.Price!}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="text-xl text-center my-3">บริการเสริม</p>
                    {
                        addondetail.length === 0 ? (
                            <p className="text-xl text-center text-gray-400">
                                ไม่มีการเลือกบริการ
                            </p>
                        ) : (
                            <div className="w-full flex justify-center">
                        <div className="w-full max-w-[730px] overflow-x-auto  sm:rounded-t-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-base-black  table-auto">
                                <thead className="text-xs text-base-black uppercase bg-blue-bg-10 ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            ลำดับ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                        ประเภทการบริการ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                        รายละเอียด
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-end">
                                        ราคา
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addondetail.map((item, index) => (
                                        <tr
                                            key={item.ID}
                                            className=" odd:bg-white even:bg-[#FBFBFB]"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4 text-center">
                                               {(item as any).AddOn?.AddOnName || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center">{(item as any).AddOn?.Description || "N/A"}</td>
                                            <td className="px-6 py-4 text-end">{item.Price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        )
                    }
                    

                 <div className="w-full px-5 mt-4 ">
                    <div className="w-full flex flex-col items-end">
                    <p>ส่วนลด: {Order?.Discount || 0} บาท</p>
                    <p>ราคาสุทธิ: {Order?.Price || 0} บาท</p>    
                    </div>
                   
                 </div>
                   
                 <div className="flex justify-center gap-5 mt-1">
                 <motion.div className="text-base-red  font-bold py-2 px-12  my-3 cursor-pointer" 
                whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                onClick={Cancel}
                >ยกเลิก Order</motion.div>
                
                  <motion.div className="bg-base-black  text-white font-bold py-2 px-12 rounded my-3 cursor-pointer" 
                whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                onClick={NextPage}
                >{checktext()}</motion.div>
                 </div>
                </div>
              
                

            </div>
        );
    }

export default OrderALLDetail