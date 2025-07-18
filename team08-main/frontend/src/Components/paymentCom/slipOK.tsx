import { useEffect, useState } from "react";

import {   DecodeQRSlip, GetPaymentByOrderID, SlipOKCheckBody, UpdateStatusByOrderID, UpdateUserByid } from "../../services/https";


import { PaymentInterface } from "../../interfaces/IPayment";
import generatePayload from "promptpay-qr";
import { message, QRCode } from "antd";
import { OrderInterface } from "../../interfaces/IOrder";
import { motion } from "framer-motion";

import { CreateNotificationFromOrder, GetOrderByID, GetUserID, PatchStatus } from "../../services/https/index1";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { NotificationInterface } from "../../interfaces/INotification";


    


export interface SlipOKInterface{
    data:string,
    amount:number,
    log:Boolean,
    
}

function SLipOK({id}:{id:string}) { //id
    // const [acctoken, setAcctoken] = useState('');
   
    const [payment, setPayment] = useState<PaymentInterface | null>(null); // สำหรับ object เดี่ยว
    const [ phoneNumber, _setPhoneNumber ] = useState("062-175-0890");
    const [ amount, setAmount ] = useState(Number(0));
    const [ qrCode ,setqrCode ] = useState("sample");
    const [slip, setSlip] = useState<string | File>("");
    const [preview, setPreview] = useState<string >("");
    // const [OrderID,setOrderID] = useState('');
      const navigate = useNavigate();

  function slipchange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    setSlip(selectedFile || ""); // เก็บชื่อไฟล์
    if (selectedFile) {
        setSlip(selectedFile); // เก็บชื่อไฟล์
        setPreview(URL.createObjectURL(selectedFile)); // สร้าง URL สำหรับ preview
      } else {
        setSlip("");
        setPreview(""); // ลบ preview หากไม่มีไฟล์
      }
    
  }
    
    function handleQR(amount: number) {
        setqrCode(generatePayload(phoneNumber, { amount }));
        // console.log("qr is: ",qrCode);
      }
    
    async function getOrder() {
        const res = await GetPaymentByOrderID(Number(id));
        setPayment(res.data);
        // console.log("API Response: ", res.data.Price);
        setAmount(Number(res.data.Price))
   
        handleQR(Number(res.data.Price));
        
    }
    
    useEffect(() => {
        getOrder();
        // console.log("id payment: ", id);
        
    }, []);
    
    useEffect(() => {
        // console.log("payment:", payment);
        // //  console.log("acc: ",acctoken);
        // console.log("slip: ",slip);
        // console.log("Price",amount)
    }, [payment,qrCode,amount,slip]);
   
    async function checksubmitbody(){
        const devodedata = await DecodeQRSlip(slip as File)
        console.log("qrdata: ",devodedata)
        const slipboday :SlipOKInterface ={
            data: devodedata.rawdata,
            amount: payment?.Price ?? 0, // default to 0 if payment?.Price is null or undefined
            log: true,
        }
    
        console.log("slipbody: ",slipboday)
      
         const res = await SlipOKCheckBody(slipboday)
         console.log("res slip ok: ",res)
         if(res.success===true){
            message.open({
                type: 'success',
                content: 'ชำระเงินเรียบร้อย',
                duration: 3
               })
                const UpdateStatus1 :PaymentInterface = {
                    PaymentStatusID : 2,
                    PaymentEnd: new Date(),
                }
                
            await UpdateStatusByOrderID(Number(id),UpdateStatus1) // อัพเดท paymeny
            if (payment && payment.OrderID !== 0) {
                const UpdateStatus2 :OrderInterface={
                    OrderStatusID :2,

                 }    
                // console.log("order test: ",payment?.OrderID)
                await PatchStatus(Number(payment?.OrderID),UpdateStatus2)// อัพเดท order
            }
            //เพิ่มแต้ม
            const user = await GetUserID(Number(payment?.UserID))
            const order = await GetOrderByID(Number(payment?.OrderID))
            // console.log("point: ",user.Point)
            // console.log("user: ",order.data[0].ExpecterdPoint)
            const point:UsersInterface={
                Point:Number(user.Point) + Number(order.data[0].ExpecterdPoint)
            }
            // console.log("point: ",point)
            const uid = localStorage.getItem("id");
            await UpdateUserByid(uid || "",point)
           
            
            //ส่งข้อความ
                      const notificatin:NotificationInterface = {
                        Title:"ชำระเงินสำเร็จ!",
                        Message:"ชำระเงินสำเร็จ Order ของคุณถูกชำระเงินเรียบร้อยแล้ว! ขอบคุณที่ใช้บริการ",
                        NotificationStatusID:1,
                        OrderID:Number(payment?.OrderID),
                        UserID:Number(uid)
                    }
                    await CreateNotificationFromOrder(notificatin)
   
            // await UpdateStatusOrderByID(Number(id),UpdateStatus2)
            setTimeout(() => {
                navigate(`/AllOrderUser`);
            })

         }

         else if(res.code===1012){
            message.open({
                type: 'error',
                content: 'ส่งสลิปซ้ำ กรุณาเปลี่ยนสลิป',
                duration: 3
               })
              
              

         }
         else if(res.code===1000){
            
            message.open({
                type: 'error',
                content: 'สลิปนี้ไม่ถูกต้อง',
                duration: 3
               }) 
               
         }
         else{
            message.open({
                type: 'error',
                content: res.message,
                duration: 3
               })
         }
    
       
    }
  
    

    
   
   async function paylater(){
               
     setTimeout(() => {
         navigate(`/Main`);
     },1000)
   }
   
    
    return (
        <div className="">
           
            <div className="hidden  sm:w-[620px] sm:h-[400px] sm:flex sm:justify-center sm:items-center   
            bg-gradient-to-tl from-cyan-400 to-sky-400 mt-5 rounded-[22px]
             shadow-[0px_4px_26px_-12px_#31BBEC]"   >
                
                        <div className="w-full h-full flex justify-center items-centerm-5">
                                <div className="h-full ">
                                    
                                    <h1 className="text-[16px] font-semibold text-white text-center m-1">ตรวจสอบslip</h1>
                                    {
                                        !preview && (
                                            <div className="">
                                                 <div className="h-fit w-[230px] bg-white rounded-[10px] border-dashed-2 
                                                 
                                                 border-[#24292E] flex justify-center items-center" onClick={() => document.getElementById("slip")?.click()}>
                                                       
                                                       <div className="flex justify-center items-center w-[230px] h-[350px]">
                                                       <FaCloudUploadAlt className="text-slate-300 w-[100px] h-[100px]" />

                                                        </div>
                                                 </div>
                                            </div>
                                        )
                                    }
                                    <input type="file" onChange={slipchange} placeholder="slip" id="slip" className="hidden"/>
                                   
                                    {preview && (
                                    <div className="bg-white p-1 rounded-[10px] ">
                                     <div className="w-full h-[300px] flex justify-center overflow-auto" onClick={() => document.getElementById("slip")?.click()}>
                                         <img src={preview} alt="Preview" className="w-[230px] h-[400px] m-1 rounded-[8px]" />
                                         
                                      </div>
                                        <div className="flex justify-center mt-2">
                                            <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="cursor-pointer flex justify-center items-center  bg-[#24292E] hover:bg-blue-6 text-white font-bold py-2 px-4 rounded"
                                            onClick={checksubmitbody}>check status</motion.div>       
                                      </div>
                                    </div>
                                     
                                      
                                    )}
                                   
                                  
                                
                                </div>
                            </div>
                          {/* qrcode */}
                           <div className="w-full h-full flex justify-center  p-5 bg-white rounded-[20px] shadow-[-10px_0px_33px_-10px_rgba(0,_0,_0,_0.1)]">
                                <div className=" w-fit h-full px-6  rounded-[15px]
                                    bg-gradient-to-tl from-cyan-400 to-sky-400 flex flex-col justify-between ">
                                    <div className="flex justify-center  ">
                                     <img src="../icon/logo-1.1.png" alt="" className="w-[120px] " />
                                            
                                    </div>
                                    <div className="flex justify-center bg-white rounded-[10px]">
                                    
                                        {/* <img src={`data:image/jpeg;base64,${qrCode}`} alt="" className="w-[300px] h-[320px] my-5"/>   */}
                                        <div className="w-[250px] h-fit flex justify-center items-center overflow-hidden">
                                            <div >
                                                <QRCode value={qrCode} size={250}  />
                                            </div>
                                          
                                        </div>

                                        
                                    </div>
                                    <h1 className="text-2xl text-center font-semibold text-white mt-2"> {payment?.Price} บาท</h1>
                                </div>
                             </div>
                               

                                
                        
                            
                            
                        
                       
                        
                            
                        </div>
                        <div className="sm:hidden  
           "   >         {/* qrcode */}
                            <div className="w-full h-full flex justify-center  p-5 bg-white rounded-[20px] shadow-[-10px_0px_33px_-10px_rgba(0,_0,_0,_0.1)]">
                                    <div className=" w-fit h-full px-6  rounded-[15px]
                                        bg-gradient-to-tl from-cyan-400 to-sky-400 flex flex-col justify-between ">
                                        <div className="  flex justify-center  ">
                                                 <img src="../icon/logo-1.1.png" alt="" className="w-[120px] " />
                                        </div>
                                        <div className="flex justify-center bg-white rounded-[10px]">
                                        
                                            {/* <img src={`data:image/jpeg;base64,${qrCode}`} alt="" className="w-[300px] h-[320px] my-5"/>   */}
                                            <div className="w-[250px] h-fit flex justify-center items-center overflow-hidden">
                                                <div >
                                                    <QRCode value={qrCode} size={250}  />
                                                </div>
                                            
                                            </div>

                                            
                                        </div>
                                        <h1 className="text-2xl text-center font-semibold text-white mt-2"> {payment?.Price} บาท</h1>
                                    </div>
                                </div>
                
                        <div className="w-full h-full flex justify-center items-centerm-5">
                                <div className="h-full ">
                                    
                                    
                                    {
                                        !preview && (
                                            <div className="">
                                                 <div className="mt-2 h-fit w-[230px] bg-white rounded-[10px] border-dashed-2 
                                                 
                                                 border-[#24292E] flex justify-center items-center" onClick={() => document.getElementById("slip")?.click()}>
                                                       
                                                       <div className="flex justify-center items-center ">
                                                        แนบslip
                                                        </div>
                                                 </div>
                                            </div>
                                        )
                                    }
                                    <input type="file" onChange={slipchange} placeholder="slip" id="slip" className="hidden"/>
                                   
                                    {preview && (
                                        <div>

                                       
                                         <h1 className="text-[16px] font-semibold text-base-black text-center m-1">ตรวจสอบslip</h1>
                                    <div className="bg-white p-1 rounded-[10px] ">
                                     <div className="w-full h-fit flex justify-center" onClick={() => document.getElementById("slip")?.click()}>
                                         <img src={preview} alt="Preview" className="w-[230px] h-[400px] m-1 rounded-[8px]" />
                                         
                                      </div>
                                        <div className="flex md:justify-end mt-2 justify-center border-2 border-red-600
                                        
                                        ">
                                            <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="cursor-pointer flex justify-center items-center  bg-[#24292E] hover:bg-blue-6 text-white font-bold py-2 px-4 rounded"
                                            onClick={checksubmitbody}>check status</motion.div>       
                                      </div>
                                    </div>
                                      </div>
                                      
                                    )}
                                   
                                  
                                
                                </div>
                            </div>
                          
                               

                                
                        
                            
                            
                        
                       
                        
                            
                        </div>
                     <div className="mt-6 flex justify-end gap-4">
                       
                        <motion.div onClick={paylater} className="flex gap-2 justify-between text-white rounded-md bg-base-black  items-center  font-bold py-1 px-6  mt-2 cursor-pointer text-center"
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        >
                        ชำระเงินภายหลัง
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z"/></svg>
                       </motion.div>
                         
                       
                     </div>
                      
       

           

        </div>
    );
}
export default SLipOK