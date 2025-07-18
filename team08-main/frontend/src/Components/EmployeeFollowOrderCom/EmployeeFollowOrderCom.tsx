import { useEffect, useState } from "react";
import { OrderDetailInterface } from "../../interfaces/IOrderDetail";
import { GetAddOnByOrderID, GetClothDetailByOrderID, GetImageID } from "../../services/https";
import SteperFollow from "../Stepper/SteperFollow";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { ImageInterface } from "../../interfaces/IImage";
import { CreateNotificationFromOrder, GetEMOrderByID, PatchStatus } from "../../services/https/index1";
import { Image, message } from 'antd';
import { OrderInterface } from "../../interfaces/IOrder";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NotificationInterface } from "../../interfaces/INotification";

function EmployeeFollowOrderCom({id}:{id:string}) {
     const [dataCloth,setDatacloth] = useState<OrderDetailInterface[]>([])
     const [dataAddOn,setDataAddOn] = useState<AddOnInterface[]>([])
     const [image,setImage] = useState<ImageInterface[]>([])
     const [note,setNote] = useState<string[]>([])
     const [showAll, setShowAll] = useState(false);
     const initialDisplayCount = 2;
     const displayedImages = showAll ? image : image.slice(0, initialDisplayCount);
    //  const [orderstatus,setOrderstatus] = useState(0);
     const [order,setOrder] = useState<OrderInterface | null>(null);
     const navigate = useNavigate();

      const [step, setStep] = useState(1);
     
   async function fetchClothdetail() {
               const res = await GetClothDetailByOrderID(Number(id));    
               setDatacloth(res.data);
               console.log("clothdetail: ", res.data);
              
           }
           async function fetchAddondetail() {
               
               const res = await GetAddOnByOrderID(Number(id));    
               setDataAddOn(res.data);
               console.log("Addondetail: ", res.data);
           }
            async function fetchNote() {
                       const res1 = await GetEMOrderByID(Number(id));
                       console.log("note: ",res1.data)
                       setNote(res1.data.Note)
                    
                       setOrder(res1.data)
                       stepper(res1.data.OrderStatusID)
                       // console.log("note: ", res1);
                   }
          function stepper(id:number){
            setStep(id); 
            console.log("step: ", id); 
          }
          async function toprogress(){
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
             
                           const notificatin:NotificationInterface = {
                            Title:"รายการฝากซัก-อบ กำลังดำเนินการ!",
                            Message:"ตอนนี้พนักงานได้ทำการับตะกร้าผ้าของท่านเรียบร้อยแล้ว ขั้นตอนต่อไปจะเป็นการดำเนินการ ขอบคุณที่ใช้บริการ",
                            NotificationStatusID:1,
                            OrderID:Number(id),
                            UserID:Number((order as any)?.User.ID)
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
                fetchNote()
            }
          }
           async function fetchImageProff() {
               
               const res = await GetImageID(Number(id))
               setImage(res)
               console.log("image: ", res);
           }
            useEffect(() => {
                       fetchClothdetail();
                       fetchAddondetail();
                       fetchImageProff();
                       fetchNote()
                   },[]);
               
                   useEffect(() => {
                   console.log("order: ", (order as any)?.User.UserName);
                   console.log("id: ", id);
                //    console.log("orderstatus: ", orderstatus);
                   },[dataCloth,dataAddOn,image,note,step]);

           
        function goback() {
            setTimeout(() => {
                navigate(`/EmployeeOrder`);
            })
        }
        async function stepfinish() {
            try{
                const data :OrderInterface = {
                   OrderStatusID:4
               }
               await PatchStatus(Number(id),data)
               message.open({
                  type: 'success',
                  content: 'คำสั่งนี้เสร็จสิ้น',
                  duration: 3
               })
              
              const notificatin:NotificationInterface = {
                                     Title:"รายการฝากซัก-อบ ดำเนินการเสร็จสิ้น!",
                                     Message:"ตอนนี้รายการฝากซัก-อบของท่านได้ดำเนินการเสร็จสิ้นแล้ว สามารถมารับตะกร้าของท่านตามจุดที่ทางร้านกำหนด ขอบคุณที่ใช้บริการ",
                                     NotificationStatusID:1,
                                     OrderID:Number(id),
                                     UserID:Number((order as any)?.User.ID)
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
                  fetchNote()
              }
        }
        const status =(order as any)?.OrderStatusID == 1
        ? "bg-[#FCCED6] text-base-red " 
        : (order as any)?.OrderStatusID == 3
        ? "bg-[#C0ECFC] text-blue-bg " 
        : (order as any)?.OrderStatusID ==2
        ? "bg-[#DED1FD] text-base-puple " 
        : (order as any)?.OrderStatusID == 4
        ? "bg-[#DDFFE5]  text-green-500 " 
        :"bg-red-100 text-base-black "
    return (
       <div className="w-full  flex justify-center">
        <div className="EmployeeFollowOrderCom lg:w-[80%] w-full mt-2 bg-white rounded-[10px] shadow-base-shadow">
            <div className="w-full md:flex hidden flex-col items-center py-2 ">
                <p className="text-xl">สถานะ</p>
                <div className="w-full md:flex justify-center hidden">
                    <SteperFollow step={step}/>
                </div>
             

                
            </div>

            <div className="md:hidden flex flex-col items-center justify-center w-full gap-2 mt-2 ">
                <div className="flex justify-center w-full gap-5">
                    <p>รหัสคําสั่ง #{id}</p> 
                    <div className={` ${status}  px-2 rounded-[4px]
                                                       text-sm`
                                                       }>
                        <p>{(order as any)?.OrderStatus.Status}</p>
                    </div>
                    
                </div>
             
                   <div className="
                      sm:w-[90%] w-full  bg-white rounded-[10px] p-2 shadow-sm border-l-4 border-base-green flex justify-center">
                    
                      <div className=" w-full h-full flex  items-center gap-5">
                        <img src="../icon/user.jpg" alt="" className="w-[60px] h-[60px] rounded-full object-cover "/>
                       <div className="text-[14px] mr-4">
                        <p>ชื่อ: {(order as any)?.User.UserName }</p>
                        <p>Email: {(order as any)?.User.Email }</p>
                        <p>เบอร์โทร: {(order as any)?.User.Tel }</p>
                       </div>
                      </div>
                       
                      
                   </div>
                </div>

           <div className="grid md:grid-cols-2 gap-5 grid-cols-1
            md:px-4 py-2">
             <div className="">
                <div>
                   <p className="md:text-start text-center">รายละเอียด Order</p>
                   <div className="w-full max-h-[300px] h-fit overflow-y-auto rounded-[5px]  ">
                        <table className="w-full text-sm text-left rtl:text-right text-base-black  ">
                                    <thead className="text-[14px] text-base-black font-light bg-blue-bg-10 ">
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
                                        {dataCloth.map((item, index) => (
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
                <div>
                   <p className="md:text-start text-center mt-2">รายละเอียด AddOn</p>
                   {
                        dataAddOn.length > 0 ? (
                            <>
                            
                              
                        
                                    <div className="w-full max-h-[300px] h-fit overflow-y-auto table-auto rounded-[5px]">
                                                        
                                        <table className=" text-sm text-left rtl:text-right text-base-black    ">
                                                    <thead className="text-[14px] text-base-black font-light bg-blue-bg-10  ">
                                                        <tr >
                                                        <th scope="col" className="px-6 py-3 w-[50px]">
                                                                ลำดับ
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 w-[150px] text-center">
                                                                การบริการ
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 w-[200px] text-center">
                                                                คำอธิบาย
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 w-[80px] text-end">
                                                                ราคา
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                
                                                    <tbody>
                                                    {dataAddOn.map((item, index) => (
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
                                                                    <td className="px-6 py-4 text-start text-wrap ">
                                                                    {(item as any).AddOn?.AddOnName || "N/A"}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-start text-wrap">{(item as any).AddOn?.Description || "N/A"}</td>
                                                                    <td className="px-6 py-4 text-end">{item.Price}</td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                    
                                        </table>
                                        </div>  
                                     
                            </>
                        ):
                        <p className="text-[16px] m-3 text-center text-base-black bg-white py-6 rounded-lg shadow-sm">ไม่ได้เลือกบริการเสริม</p>
                        }
                </div>
             </div>
             <div className="Image-side max-h-[60vh] h-fit overflow-auto">
                <div className="card-user hidden md:flex md:flex-col">
                   <p>รหัสคําสั่ง #{id}</p>
                   <div className="
                      md:w-[90%]  md:max-w-full md:bg-white md:rounded-[10px] md:p-2 md:shadow-sm md:border-l-4 md:border-base-green">
                    
                      <div className="hidden  w-full h-full md:flex  items-center gap-5">
                        <img src="../icon/user.jpg" alt="" className="w-[60px] h-[60px] rounded-full object-cover "/>
                       <div className="text-[14px] mr-4">
                        <p>ชื่อ: {(order as any)?.User.UserName }</p>
                        <p>Email: {(order as any)?.User.Email }</p>
                        <p>เบอร์โทร: {(order as any)?.User.Tel }</p>
                       </div>
                      </div>
                       
                      
                   </div>
                </div>
                <div className="">
                    
                    <p className="text-[16px] my-2 md:text-start text-center">รูปภาพ</p>

                    {
                    image.length > 0 ?(
                    <>
                            <div className="md:w-fit w-full  h-fit flex flex-wrap md:justify-start gap-5 justify-center " >
                            
                                {displayedImages.map((item, index) => (
                                    <div key={index}> 
                                    <Image.PreviewGroup
                                        items={image.map(img => img?.ImagePath ?? '')}
                                        >
                                        <Image
                                            className="h-full rounded-lg"
                                            src={item.ImagePath}
                                            width={150}
                                            height={150}
                                            alt=""
                                        />
                                        </Image.PreviewGroup>
                                    </div>

                                ))} 
                                
                                {!showAll && image.length > initialDisplayCount && (
                                    <div
                                        className="text-center w-[150px] h-[150px]  rounded-lg
                                        relative
                                        cursor-pointer flex items-center justify-center"
                                        onClick={() => setShowAll(true)} // กดเพื่อแสดงรูปที่เหลือ
                                    >   
                                        <img src={image[initialDisplayCount].ImagePath} className="w-[150px] h-[150px] rounded-lg" alt="" />
                                        <div className="w-full h-full absolute bg-black bg-opacity-50 flex items-center justify-center
                                        rounded-lg
                                        ">

                                        </div>
                                        <div className="w-full h-full absolute flex items-center justify-center ">
                                            <p className="text-white text-[20px]  ">
                                            เพิ่มเติม ({image.length - initialDisplayCount} รูป)
                                        </p>
                                        </div>
                                        
                                    </div>
                                )}
                                
                            </div>
                            {

                                showAll && image.length > initialDisplayCount && (
                                    <div
                                        className="m-2 text-center cursor-pointer"
                                        onClick={() => setShowAll(false)} // กดเพื่อแสดงรูปที่เหลือ
                                    >
                                        <p className="text-base-black hover:text-blue-bg text-[16px] 
                                        duration-300">
                                            แสดงน้อยลง 
                                        </p>
                                    </div>
                                )

                                }
                    </>
                ):(
                    <p className="text-[16px] m-3 text-center text-base-black bg-white py-6 rounded-lg shadow-sm">ไม่ได้เลือกรูปภาพ</p>
                )}
                </div>
                <div className="">
                        <p className="text-[16px] my-3 md:text-start text-center">หมายเหตุ</p>

                        <div className=" max-h-[150px] h-fit overflow-y-auto border-[1px]  py-3 px-3 bg-gradient-to-tl 
                        from-cyan-400 to-sky-400 rounded-lg">

                            {
                                note.length > 0 ?(
                                    <p className="text-[16px] p-3 rounded-lg bg-white">{note}</p>
                                ):
                                <p className="text-[16px] p-3 rounded-lg bg-white">ไม่ได้แจ้งหมายเหตุ</p>
                            }
                          
                        </div>
                    </div>
             </div>
           </div>
           <div className="w-fit flex gap-2">
           <motion.div className="bg-[#24292E]  text-white font-medium  px-4 rounded m-2 cursor-pointer" 
                onClick={() => goback()} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                >กลับ</motion.div>

            

            { order?.OrderStatusID === 2 &&(
             <motion.div className="bg-blue-bg text-white font-medium  px-4 rounded m-2 cursor-pointer" 
                onClick={() => toprogress()} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                >ดำเนินการ</motion.div>)
                }  
             {
                order?.OrderStatusID === 3 &&(
                    <motion.div className="bg-green-500 text-white font-medium  px-4 rounded m-2 cursor-pointer" 
                    onClick={() => stepfinish()} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                    >เสร็จสิ้น</motion.div>
                )
             }
           </div>
        </div>
        </div>
    );
}export default EmployeeFollowOrderCom