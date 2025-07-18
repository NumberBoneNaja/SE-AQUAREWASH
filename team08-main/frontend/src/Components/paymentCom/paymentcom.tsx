import { useEffect, useState } from "react";

import { CheckStatusPayment, CreateQRCode, GetPaymentByOrderID, GetSCBToken, UpdateStatusByOrderID } from "../../services/https";
import { message  } from "antd";
import { OrderInterface } from "../../interfaces/IOrder";
import { PaymentInterface } from "../../interfaces/IPayment";
import { motion } from "framer-motion";
import { PatchStatus } from "../../services/https/index1";



export const apikey = 'l72ed2137c85724b61be9eee4dcef83734'

export const apisecret = '776221e9c2204ccb9c92b52ea0728829'

export const billerID ='261664370863177'

export interface formqr {
    qrType : string,
    ppType : string,    
    ppId : string,
    amount : string,
   
    ref3 : string
}
function PaymentCom({id}:{id:string}) {
    const [acctoken, setAcctoken] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [transactionID, setTransactionID] = useState('');
    const [payment, setPayment] = useState<PaymentInterface | null>(null); // สำหรับ object เดี่ยว
    const [OrderID,setOrderID] = useState('');
    // const [loading, setLoading] = useState(false);  // เพิ่ม loading state

    async function getOrder() {
        
        const res = await GetPaymentByOrderID(Number(id));
        // console.log("id Response: ", );
        setOrderID(res.data.OrderID)
        setPayment(res.data);
        
        // await getToken();
        //  console.log("payment: ", res);
    
        getTokeninit(res.data);
        // แสดงค่า Ref1 และ Ref2
        // console.log("Ref1: ", res.Ref1);
        // console.log("Ref2: ", res.Ref2);
    }
    
    useEffect(() => {
        getOrder();
      
    

    }, []);
    
    useEffect(() => {
        // console.log("payment:", payment);
        // console.log("acc: ",acctoken);
       
    }, [payment,acctoken]);
    

    async function getToken() {
     
        const res = await GetSCBToken();
      

        // console.log("data token: ",res);
        // console.log("access_token: ",res.data.accessToken);
        getQrCode(res.data.accessToken);
        setAcctoken(res.data.accessToken);
    }
    async function getTokeninit(payment:PaymentInterface) {
     
        const res = await GetSCBToken();
      
        // console.log("data token: ",res);
        // console.log("access_token: ",res.data.accessToken);
        getQrCodeInit(res.data.accessToken,payment);
        setAcctoken(res.data.accessToken);
    }
    async function getQrCodeInit(access_token : string,payment:PaymentInterface) {
        console.log("acctoken is: ",access_token);
        console.log("ref1: ",payment?.Price);
        const dataforqr:formqr = {
                qrType: "PP",
                ppType: "BILLERID",
                ppId: "261664370863177",
                amount: payment && payment.Price ? payment.Price.toString() : "0",
                //   amount : "10",
               
                ref3: "UJE"

        }
        const res = await CreateQRCode(access_token,dataforqr);
        // console.log("data: ",res.data.qrImage);
        setQrCode(res.data.qrImage);
        setAcctoken(access_token);
    }
   

    async function getQrCode(access_token : string) {
        console.log("acctoken is: ",access_token);
        console.log("ref1: ",payment?.Price);
        const dataforqr:formqr = {
                qrType: "PP",
                ppType: "BILLERID",
                ppId: "261664370863177",
                amount: payment && payment.Price ? payment.Price.toString() : "0",
                //   amount : "10",
             
                ref3: "UJE"

        }
      
        const res = await CreateQRCode(access_token,dataforqr);
        // console.log("data: ",res.data.qrImage);
        
        setQrCode(res.data.qrImage);
        setAcctoken(access_token);
        
    }
    async function checkStatus( ) {
        console.log("acctoken for check status: ",acctoken);
        console.log("transactionID: ",transactionID);
        
        try{
        const res = await CheckStatusPayment(transactionID ,acctoken);
       
       
      
        if (res.status.description === "Success") {
           message.open({
            type: 'success',
            content: 'payment success',
            duration: 3
           })
           const UpdateStatus1 :PaymentInterface = {
            PaymentStatusID: 2,
           }
           const UpdateStatus2 :OrderInterface={
            OrderStatusID: 2,
            }            
           await UpdateStatusByOrderID(Number(OrderID),UpdateStatus1)
           await PatchStatus(Number(id),UpdateStatus2)
        //    await UpdateStatusOrderByID(Number(id),UpdateStatus2)

        }else{
            console.log("ref1 is: ",res.data.ref1)
            message.open({
                type: 'error',
                content: 'payment fail',
                duration: 3
               })
        }}
        catch(e){
            console.log("error: ",e);
            message.open({
                type: 'error',
                content: 'payment fail',
                duration: 3
               })
        }
            

    }
    
    return (
        <div>
             {/* {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
                    <Spin size="large" />
                </div>
            )} */}
            <div className="w-full h-full flex justify-center items-center"  >
                <div>
                   <div className="py-2 w-[420px] h-auto px-6 rounded-[15px]
                     bg-gradient-to-tl from-cyan-400 to-sky-400 my-5 ">
                       <div className="flex justify-center items-end  mb-2">
                            <img src="../icon/washing-liquid (1).png" alt=""  className="w-10 h-10"/>
                            <div className="h-full flex items-end">
                                <h1 className=" text-2xl font-semibold  text-white">verWash</h1>
                            </div>
                            
                       </div>
                       <div className="flex justify-center mb-3 bg-white rounded-[10px]">
                       
                         <img src={`data:image/jpeg;base64,${qrCode}`} alt="" className="w-[300px] h-[320px] my-5"/>   
                       </div>
                       <h1 className="text-2xl text-center font-semibold text-white"> {payment?.Price} บาท</h1>
                   </div>
                   
                    <div className="flex justify-center " >
                        <div className="flex justify-center items-center mb-5 " onClick={() => getToken()}>
                             <div className="flex justify-center items-center mx-2 cursor-pointer ">
                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="15" height="15"><path d="M12,0C7.973,0,4.213,2.036,2,5.365V0H1V5.5c0,.827,.673,1.5,1.5,1.5h5.5v-1H2.779C4.801,2.9,8.275,1,12,1c6.065,0,11,4.935,11,11s-4.935,11-11,11S1,18.065,1,12H0c0,6.617,5.383,12,12,12s12-5.383,12-12S18.617,0,12,0Z"/></svg>

                            </div>
                            โหลด QR-CODE</div>
                        </div>
                       
                 <input type="text" className="border border-base-black-10 rounded-md w-full px-2 py-1" placeholder ="Transaction ID" onChange={(e) => setTransactionID(e.target.value)}/>
                 <div className="flex justify-center ">
                        <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer flex justify-center items-center my-3 bg-[#24292E] hover:bg-blue-6 text-white font-bold py-2 px-4 rounded"
                        onClick={checkStatus}>check status</motion.div>       
                 </div>
                 
               
                </div>
                
            </div>
            
           

        </div>
    );
}
export default PaymentCom