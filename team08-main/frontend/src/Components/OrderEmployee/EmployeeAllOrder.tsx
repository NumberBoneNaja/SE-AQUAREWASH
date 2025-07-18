import { useEffect, useState } from "react";
import { OrderInterface } from "../../interfaces/IOrder";
import { GetAllOrder } from "../../services/https/index1";
import { CancelOrder, CancelPaymentByOrderID, DeleteAddOnByOrderID, DeleteImageByOrderID, DeleteOrderDetailByOrderID, GetAddOnByOrderID, GetImageID, GetPaymentByOrderID } from "../../services/https";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { ImageInterface } from "../../interfaces/IImage";
import { PaymentInterface } from "../../interfaces/IPayment";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function EmployeeAllOrder() {
    const [order,setOrder] = useState<OrderInterface[]>([]);
    const [imageCounts, setImageCounts] = useState<{ [key: number]: number }>({});
    const [addondetail,setAddondetail] = useState<AddOnInterface[]>([]);
    const [image,setImage] = useState<ImageInterface[]>([])
    const [payment, setPayment] = useState<PaymentInterface | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const navigate = useNavigate();
     async function fetchAllOrder() {
         const res = await GetAllOrder()
         const sortedData = res.data.sort((a: OrderInterface, b: OrderInterface) => 
            new Date(b.CreatedAt ?? 0).getTime() - new Date(a.CreatedAt ?? 0).getTime()
        );
        
         setOrder(sortedData);
     }
     useEffect(() => {
        fetchAllOrder();
        
     }, []);

     useEffect(() => {
        if (order.length > 0) {
            fetchImageCounts();
        }
     }, [order,selectedItems]);
     async function fetchImageCounts() {
        const counts: { [key: number]: number } = {};
        for (const item of order) {
            if (item.ID !== undefined) {
                counts[item.ID] = await countImage(item.ID);
            }
        }
        setImageCounts(counts);
    }
    async function fetchDetail(id:number){
            const res = await GetAddOnByOrderID(Number(id));    
            setAddondetail(res.data);
            const res1 = await GetImageID(Number(id));
            setImage(res1);
            const res2 = await GetPaymentByOrderID(Number(id));
            setPayment(res2.data);
            
            
        }
    async function countImage(id: number) {
            const res = await GetImageID(id);
            return res.length;
        }
        async function cancelOrder(id:number){
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
               fetchAllOrder();
            
       
           }

           const handleCheckboxChange = (id: number) => {
             setSelectedItems((prevSelectedItems) => {
              const updatedItems = prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((itemId) => itemId !== id)
                : [...prevSelectedItems, id];//ใช้เก็บค่าที่ถูกเลือก
              
              return updatedItems; // Add this return statement
            });
          };
     function gotoFollow(id:number){
         setTimeout(() => {
             navigate(`/EmployeeFollowOrder/${id}`);
         })
     }

    return (
        <div className="w-full flex justify-center" >
        <div className="bg-white lg:w-[70%] h-[85vh] w-full   shadow-base-shadow rounded-lg flex flex-col items-center">
           <div className="py-4">
               <h1 className="text-xl font-semibold text-center">รายการฝากซัก-อบ ทั้งหมด</h1>
           </div>
           <div className="filter-data  flex justify-center gap-5">
               <p>ทั้งหมด</p>
               <p>รอชำระเงิน</p>
               <p>ชำระเงินแล้ว</p>
               <p>เสร็จสิ้น</p>
            </div>
            <div className="table-all-data mt-5 w-full flex justify-center border-2 overflow-y-auto ">
               <div className=" h-[400px] w-[90%]  sm:rounded-t-lg " >
                   <table className="w-full text-sm text-left rtl:text-right text-base-black  table-auto ">
                                       <thead className="text-sm  text-base-black  bg-blue-bg-10 ">
                                       <tr>
                                           <th scope="col" className="w-[2%] px-6 py-3  sticky top-0 bg-blue-bg-10 z-10">เลือก </th>
                                           <th scope="col" className="w-[15%] px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> วันที่ </th>
                                           <th scope="col" className="w-[15%] px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> รหัสคำสั่ง </th>
                                           <th scope="col" className="w-[35%] px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> package </th>
                                           <th scope="col" className="w-[15%] px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> สถานะ </th>
                                           <th scope="col" className="w-[7%] px-6 py-3 text-end sticky top-0 bg-blue-bg-10 z-10"> ราคา </th>
                                           <th scope="col" className="w-[7%] px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> ดูรายละเอียด </th>
                                           <th scope="col" className="w-[3%]px-6 py-3 text-center sticky top-0 bg-blue-bg-10 z-10"> ปุ่ม </th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                           {order.map((item) => {

                                               const status =(item as any).OrderStatusID == 1
                                               ? "bg-[#FCCED6] text-base-red border-base-red" 
                                               : (item as any).OrderStatusID == 3
                                               ? "bg-[#C0ECFC] text-blue-bg border-blue-bg" 
                                               : (item as any).OrderStatusID ==2
                                               ? "bg-[#DED1FD] text-base-puple border-base-puple" 
                                               : (item as any).OrderStatusID == 4
                                               ? "bg-[#DDFFE5]text-base-green" 
                                               :"bg-red-100 text-base-black border-base-black"

                                               const imageCount = imageCounts[Number(item.ID)] || 0;
                                       
                                               return(


                                               <tr
                                                   key={item.ID}
                                                   className=" odd:bg-white even:bg-[#FBFBFB]  "
                                               >
                                                   <th
                                                       scope="row"
                                                       className="px-6 py-4 font-medium "
                                                   >
                                                       <div className="checkbox-wrapper-33">
                                                           <label className="checkbox">
                                                           <input className="checkbox__trigger visuallyhidden" type="checkbox" 
                                                           checked={selectedItems.includes(item.ID || 0)} 
                                                           onChange={() => handleCheckboxChange(item.ID || 0)}/>
                                                           <span className="checkbox__symbol">
                                                           <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                                               <path d="M4 14l8 7L24 7"></path>
                                                               </svg>
                                                                   </span>
                                                               
                                                       </label>
                                                           </div>
                                                   
                                                   </th>
                                                   <th
                                                       scope="row"
                                                       className="px-6 py-4 font-medium text-center "
                                                   >
                                                   {(item as any).CreatedAt ? new Date((item as any).CreatedAt).toLocaleDateString('th-TH', {
                                                       day: '2-digit',   // วันที่ (2 หลัก)
                                                       month: '2-digit', // เดือน (2 หลัก)
                                                       year: 'numeric',  // ปี ค.ศ.
                                                   }) : ""}
                                                   </th>
                                                   <td className="px-6 py-4 text-center">
                                                       {item.ID}
                                                   </td>
                                                   <td className="px-6 py-4 text-center flex items-center gap-5">
                                                   <img src="../icon/socks_2315131.png" alt="" className="w-[40px] h-[40px] " /> {(item as any).Package.PackageName}
                                                   </td>
                                                   <td className="px-6 py-4 text-center">
                                                   <div className="flex flex-col gap-1">
                                                           <p className={` ${status} w-fit px-2 rounded-[4px] border-[1px]
                                                       text-sm`
                                                       }>
                                                           {(item as any).OrderStatus.Status}</p>
                                                           {imageCount === 0 && 
                                                           <p className="border-[1px] rounded px-2 py-0 w-fit 
                                                       bg-[#A6A6A7]  text-base-black border-base-black
                                                       text-sm">ไม่พบรูป</p>}
                                                       </div>
                                                   </td>
                                                   <td className="px-6 py-4 text-end">{item.Price!}</td>
                                                   <td className="px-6 py-4 text-center">
                                                       <button className="bg-blue-bg text-white px-4 "
                                                       onClick={() =>gotoFollow(Number(item.ID))}
                                                       >ดู</button>
                                           
                                                   </td>
                                                   <td className="px-6 py-4 text-center">
                                                       <button onClick={() => cancelOrder(Number(item.ID))}
                                                       className=" text-base-red px-4 ">ลบ</button>
                                           
                                                   </td>
                                               </tr>
                                           )})}
                                   </tbody>  
                   </table>  
               </div>    
               </div>
        </div>
   </div>
    )
}
export default EmployeeAllOrder