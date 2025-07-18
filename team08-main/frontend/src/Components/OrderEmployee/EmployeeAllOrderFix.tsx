import { useEffect, useState } from "react";
import { OrderInterface } from "../../interfaces/IOrder";
import { GetAllOrder } from "../../services/https/index1";
import { CancelOrder, CancelPaymentByOrderID, DeleteAddOnByOrderID, DeleteImageByOrderID, DeleteOrderDetailByOrderID, GetAddOnByOrderID, GetImageID, GetPaymentByOrderID } from "../../services/https";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { ImageInterface } from "../../interfaces/IImage";
import { PaymentInterface } from "../../interfaces/IPayment";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { baseUrl } from "../ShowALLOrder/TableOrder";
function EmployeeAllOrderFix() {
    const [order,setOrder] = useState<OrderInterface[]>([]);
    const [imageCounts, setImageCounts] = useState<{ [key: number]: number }>({});
    const [addondetail,setAddondetail] = useState<AddOnInterface[]>([]);
    const [image,setImage] = useState<ImageInterface[]>([])
    const [payment, setPayment] = useState<PaymentInterface | null>(null);
  
    const [orderback,setOrderback] = useState<OrderInterface[]>([])
    // const [selected, setSelected] = useState(0);
    const navigate = useNavigate();
     async function fetchAllOrder() {
         const res = await GetAllOrder()
         const sortedData = res.data.sort((a: OrderInterface, b: OrderInterface) => 
            new Date(b.CreatedAt ?? 0).getTime() - new Date(a.CreatedAt ?? 0).getTime()
        );
        
         setOrder(sortedData);
         setOrderback(sortedData);
     }
     useEffect(() => {
        fetchAllOrder();
      
     }, []);

     useEffect(() => {
        if (order.length > 0) {
            fetchImageCounts();
        }
       
     }, [order]);
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

         
     function gotoFollow(id:number){
         setTimeout(() => {
             navigate(`/EmployeeFollowOrder/${id}`);
         })
     }
     function filterMessageByNotPaid() {
      
      const fileters= orderback.filter((order) => order.OrderStatusID === 1);
      setOrder(fileters);
  }
  function filterMessageByDone() {
    
      const fileters= orderback.filter((order) => order.OrderStatusID === 4);
      setOrder(fileters);
  }
  function filterMessageByAll() {
    setOrder(orderback);
  }
  
  function filterMessageByProgress() {
      
    const fileters= orderback.filter((order) => order.OrderStatusID === 3);
    setOrder(fileters);
}
  
    return (
        <div className="w-full flex justify-center">
        <div className="bg-white lg:w-[80%] w-full mt-2 shadow-base-shadow rounded-lg flex flex-col items-center pb-5">
          <div className="py-2">
            <h1 className="text-xl font-semibold text-center">รายการฝากซัก-อบ ทั้งหมด</h1>
          </div>
          <div className="filter-data flex justify-center gap-5 mb-4 ">
                        <div onClick={filterMessageByAll}>
                            ทั้งหมด
                        </div>
                        <div onClick={filterMessageByProgress}>
                            กำลังดำเนินการ
                        </div>
                        <div onClick={filterMessageByNotPaid}>
                            รอชําระเงิน
                        </div>
                        <div onClick={filterMessageByDone}>
                            เสร็จสิ้น
                        </div>
          </div>
      
          <div className="w-[90%] overflow-auto max-h-[70vh] sm:rounded-t-lg"
          
          >
            <table className="w-full text-sm text-left text-base-black">
              <thead className="text-sm bg-blue-bg-10 sticky top-0 z-10">
                <tr>
                  {/* <th scope="col" className="px-4 py-3 text-center">เลือก</th> */}
                  <th scope="col" className="px-4 py-3 text-center">วันที่</th>
                  <th scope="col" className="px-4 py-3 text-center">รหัสคำสั่ง</th>
                  <th scope="col" className="px-4 py-3 text-center">Package</th>
                  <th scope="col" className="px-4 py-3 text-center">สถานะ</th>
                  <th scope="col" className="px-4 py-3 text-center">ราคา</th>
                  <th scope="col" className="px-4 py-3 text-center">ดูรายละเอียด</th>
                  <th scope="col" className="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
              <AnimatePresence>
                {order.map((item) => {
                     const status =(item as any).OrderStatusID == 1
                     ? "bg-[#FCCED6] text-base-red " 
                     : (item as any).OrderStatusID == 3
                     ? "bg-[#C0ECFC] text-blue-bg " 
                     : (item as any).OrderStatusID ==2
                     ? "bg-[#DED1FD] text-base-puple " 
                     : (item as any).OrderStatusID == 4
                     ? "bg-[#DDFFE5]  text-green-500 " 
                     :"bg-red-100 text-base-black "


      
                  const imageCount = imageCounts[Number(item.ID)] || 0;
      
                  return (
                    <motion.tr key={item.ID} className="odd:bg-white even:bg-gray-50"
                               initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1,y: 0 }}
                                exit={{ opacity: 0, x: -200 }}
                                transition={{ duration: 0.4 }}
                    >
                      {/* <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(Number(item.ID))}
                          onChange={() => handleCheckboxChange(Number(item.ID))}
                        />
                      </td> */}
                      <td className="px-4 py-3 text-center">
                        {item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString('th-TH') : ""}
                      </td>
                      <td className="px-4 py-3 text-center">{item.ID}</td>
                      <td className="px-4 py-3 text-center flex  gap-2 items-center">

                        <img src={`${baseUrl}` +"images/packageimage/"+(item as any).Package.PackagePic} alt="" className="w-8 h-8" />
                        {(item as any).Package.PackageName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col gap-1">
                          <p className={` ${status}  px-2 rounded-[4px]
                                                       text-sm`
                                                       }>{(item as any).OrderStatus.Status}</p>
                        {imageCount === 0 && (
                          <p className="rounded px-2 w-fit 
                          bg-[#A6A6A7]  text-base-black 
                            text-sm ">ไม่พบรูป</p>
                        )}  
                        </div>
                        
                      </td>
                      <td className="px-4 py-3 text-center">{item.Price}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="bg-blue-bg text-white px-4 rounded"
                          onClick={() => gotoFollow(Number(item.ID))}
                        >
                          ดู
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="text-base-red px-4"
                          onClick={() => cancelOrder(Number(item.ID))}
                        >
                          ลบ
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
               </AnimatePresence>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      
    );
}export default EmployeeAllOrderFix