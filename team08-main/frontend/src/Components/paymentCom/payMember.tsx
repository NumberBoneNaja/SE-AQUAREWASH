import { useEffect, useState } from "react";

import {  DecodeQRSlip, GetPackageMembershipById, SlipOKCheckBody, UpdateUserByid } from "../../services/https";


import generatePayload from "promptpay-qr";
import { message, QRCode } from "antd";

import { motion } from "framer-motion";

import { GetPayMemberShipByID, UpdateNameMemberShip, UpdateSlipMemberShip, UpdateStatusMemberShip } from "../../services/https/index1";
import { MembershipPayment, PackageMembershipInterface } from "../../interfaces/MembershipPayment";
import {  useNavigate } from "react-router-dom";

import { FaCloudUploadAlt } from "react-icons/fa";
import { UsersInterface } from "../../interfaces/UsersInterface";
export interface SlipOKInterface{
    data:string,
    amount:number,
    log:Boolean,
    
}

function PayMember({id}:{id:string}) { //id
    // const [acctoken, setAcctoken] = useState('');
   
    const [payment, setPayment] = useState<MembershipPayment | null>(null); // สำหรับ object เดี่ยว
    const [ phoneNumber, _setPhoneNumber ] = useState("062-175-0890");
    const [ amount, setAmount ] = useState(Number(0));
    const [ qrCode ,setqrCode ] = useState("sample");
    const [slip, setSlip] = useState<string | File>("");
    const [preview, setPreview] = useState<string >("");
    const [selecpack,setSelecpack] = useState<PackageMembershipInterface | null>(null);
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
        const res = await GetPayMemberShipByID(Number(id));
        setPayment(res.PackageMembership);
        // console.log("API Response: ", res.PackageMembership.Price);
        setAmount(Number(res.PackageMembership.Price))
        // setOrderID(res)
        handleQR(Number(res.PackageMembership.Price));
        
        const res1 = await GetPackageMembershipById(res.PackageMembershipID);
  
        setSelecpack(res1.data);
        // setAmount(res.Price);
    
    }
    
    
    useEffect(() => {
        getOrder();
     
    }, []);
    
    useEffect(() => {
        // console.log("payment: ",slip);
        
    }, [payment,qrCode,amount,slip]);
  
       
    async function checksubmitbody(){
        const devodedata = await DecodeQRSlip(slip as File)
        console.log("qrdata: ",devodedata)
        const slipboday :SlipOKInterface ={
            data: devodedata.rawdata,
            amount: payment?.PackageMembership?.Price ?? 0, // default to 0 if payment?.Price is null or undefined
            log: true,
        }
    
        // console.log("slipbody: ",slipboday)
      
         const res = await SlipOKCheckBody(slipboday)
         console.log("res slip ok: ",res)
         if(res.success===true){
            message.open({
                type: 'success',
                content: 'ชำระเงินเรียบร้อย',
                duration: 3
               })
               //ใส่  update สถารนะตรงนี้
            
             
              await UpdateStatusMemberShip(Number(id))
              const data:MembershipPayment = {
                PicPayment:(slip as File).name,
                
               }
               await UpdateNameMemberShip(Number(id),data)
               await UpdateSlipMemberShip(slip as File,Number(id))
              
               const uid = localStorage.getItem("id");
                // console.log("datapatch: ",selecpack);
                const update:UsersInterface ={
                    Status:"Member",
                    QuotaOrder :selecpack?.QuotaOrder,
                    QuotaBooking :selecpack?.QuotaBooking,
                    PointRate :selecpack?.PointRate,
                    DiscountRate:selecpack?.DiscountRate

                }
                await UpdateUserByid((uid as string),update)
                localStorage.setItem("Status","Member")
                // console.log("slip: ");

               //เปลี่ยนค่า point
              setTimeout(() => {
                navigate(`/MainPack`);
              }, 1000);
              



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
    // async function fetchtest(){
    //     const uid = localStorage.getItem("id");
    //     console.log("datapatch: ",selecpack);
    //     const data:UsersInterface ={
    //         Status:"Member",
    //         QuotaOrder :selecpack?.QuotaOrder,
    //         QuotaBooking :selecpack?.QuotaBooking,
    //         PointRate :selecpack?.PointRate,
    //         DiscountRate:selecpack?.DiscountRate

    //     }
    //     await UpdateUserByid((uid as string),data)
    //     // console.log("slip: ");

    // }
  
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
                                    bg-gradient-to-tl from-cyan-400 to-sky-400  ">
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
                                    <h1 className="text-2xl text-center font-semibold text-white mt-2"> {amount} บาท</h1>
                                </div>
                             </div>
                               
                        </div>

                  


                        <div className="sm:hidden  
           "   >         {/* qrcode */}
                            <div className="w-full h-full flex justify-center  p-5 bg-white rounded-[20px] shadow-[-10px_0px_33px_-10px_rgba(0,_0,_0,_0.1)]">
                                    <div className=" w-fit h-full px-6  rounded-[15px]
                                        bg-gradient-to-tl from-cyan-400 to-sky-400  ">
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
                                        <h1 className="text-2xl text-center font-semibold text-white mt-2"> {amount} บาท</h1>
                                    </div>
                                </div>
                
                        <div className="w-full h-full flex justify-center items-centerm-5">
                                <div className="h-full ">
                                    
                                    
                                    {
                                        !preview && (
                                            <div className="">
                                                 <div className=" mt-2 cursor-pointer flex justify-center items-center  bg-[#24292E] 
                                                 hover:bg-blue-6 text-white font-bold py-2 px-4 rounded" 
                                                 onClick={() => document.getElementById("slip")?.click()}>
                                                       
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
                                        <div className="flex justify-center mt-2">
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
        </div>
    );
}
export default PayMember