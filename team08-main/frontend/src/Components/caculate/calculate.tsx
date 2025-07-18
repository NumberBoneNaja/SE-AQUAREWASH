
import { AddOnInterface } from "../../interfaces/IAddOn";
import { AddOnDetailInterface } from "../../interfaces/IAddOnDetail";
import { OrderInterface } from "../../interfaces/IOrder";
import { OrderDetailInterface } from "../../interfaces/IOrderDetail";
import { CreateAddOnDetail, CreateOrder, CreateOrderDetail,  GetUserById,  UpdateUserByid, UploadImageByOrderID } from "../../services/https";
import { ClothSelectedDetail } from "../PackageContent/Package";
import { message } from "antd";
import { useEffect,  useState } from "react";
// import Upload from "../../image/upload.svg"
import { Discount } from "../Discount/Discount";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { HistoryRewardInterface } from "../../interfaces/IHistoryReward";
import { PatchStateHis } from "../../services/https/index1";
import { Modal } from "antd";
import { UsersInterface } from "../../interfaces/UsersInterface";


interface CalculateProps {
    cloth: number;
    addon: number;//รับราคา
    selectedAddon:number[];
    selectedCloth:number[];
    detailsCloth:ClothSelectedDetail[];
    addonItem:AddOnInterface[];
    id:string // package 
    data:UsersInterface
    
}
interface SelectedClothType {
    clothid: number;
    price: number;
    quantity: number;
   
}


function Calculate({cloth, addon,selectedAddon,selectedCloth,detailsCloth,id,addonItem,data }: CalculateProps){
   
    //upload
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [_uploadStatus, setUploadStatus] = useState<string>("");
    const [preview, setPreview] = useState<string[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [selecreward, setSelectReward] = useState<number>();
    const [note,setNote] = useState<string>('')

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
      setIsModalVisible(true);
  };


    const navigate = useNavigate();

    function totalPrice(cloth: number, addon: number): number {
        
        return cloth + addon;
      }
      const Total = totalPrice(cloth,addon)  //ราคา Order
      let FinalScore = Total - discount //ราคาหลังกดส่วนลด
      let statusorder = 1
      let Quota = false
     
      if (FinalScore < 0) {
        FinalScore = 0
      }

    function modalfinish(){
      checkout()
      setIsModalVisible(false);
      
    }
    async function usequota(){
      setDiscount(0)
      FinalScore= 0
      Quota=true
      statusorder=2
      console.log("usequota",FinalScore)
      checkout()
      try{
        const uid = localStorage.getItem("id")
        const upquota:UsersInterface={

          QuotaOrder: Number(data?.QuotaOrder) - 1

        }
        console.log("upquota: ",upquota)
        await UpdateUserByid(uid || "",upquota)
      }
      catch(error){
        message.open(
            {
              type: "error",
              content: "เกิดข้อผิดพลาดในการใช้ Quota",
              duration: 3
            }
        )
      }

    }
  
  
    async function checkout(){
      
      try{
        if(selectedFiles && selectedFiles.length > 5){
          
          message.open({
            type: "error",
            content: "ไม่สามารถเพิ่มไฟล์เกิน 5 ไฟล์ได้",
            duration: 3
          });
        }else{
          
        
        if (detailsCloth.length !== 0 ) {
        const uid = Number(localStorage.getItem("id"))
        console.log(uid)
        const user = await GetUserById((String(uid)))
        console.log(user)
        const res1 =await GetUserById(uid.toString())
        console.log("cc",res1.data.PointRate)
        
      const ExpectedPoint =Math.round(Number(res1.data.PointRate || 0) * Number(Total || 0)) 
        const OrderData : OrderInterface = {
            Price: FinalScore,
            Discount: discount,
            OrderStatusID: statusorder,
            QuotaUsed: Quota,
            ExpecterdPoint: ExpectedPoint,
            UserID: uid,
            PackageID: Number(id),//เพราะตอนเอาเข้าเป็นstring
            HistoryRewardID: Number(selecreward),
            Note:note
        }
        // console.log("OrderData: ", OrderData);
       const res = await CreateOrder(OrderData)
       if (selecreward) {
         const state:HistoryRewardInterface = {
               State:"used"
         }
             await PatchStateHis(Number(selecreward),state)
          // await DeleteReward(Number(selecreward))
       }
     
     
          const selected: SelectedClothType[] = detailsCloth.map((item) => ({
            clothid: item.ID,
            price: item.price,
            quantity: item.quantity,
           }));
        // console.log("selected: ", selected);
          console.log("Order: ", res.data);
          for (const item of selected) {
            const Orderdetail: OrderDetailInterface = {
                Quantity: item.quantity ,
                Price: item.price,
                OrderID: res.data.ID, // Ensure `res.data.ID` is accessible before this loop
                ClothTypeID: item.clothid,
            };
            await CreateOrderDetail(Orderdetail)
              // console.log("Order Detail: ", Orderdetail);
          }
        
         if(selectedAddon.length !==0){
           const addon = addonItem.filter((item)=>
            selectedAddon.includes(item.ID || 0)).map((item)=>({
                id:item.ID,
                price:item.Price
            }))
            console.log("addon: ",addon)
             for (const item of addon){
              const OrderAddOn : AddOnDetailInterface ={
                  Price :item.price,
                  AddOnID :item.id,
                  OrderID: res.data.ID
             }
            //  console.log("Addon detail ",OrderAddOn)
              await CreateAddOnDetail(OrderAddOn)
          }  
         }
        //  console.log(Number(res.data.ID))
        if (selectedFiles !== null ) {
          handleUpload(Number(res.data.ID),selectedFiles)
        }
         
         message.open({
            type: "success",
            content: "สร้าง order สําเร็จ",
            duration: 3
          });
          console.log("res.data.ID: ",res.data.ID)
          setTimeout(() => {
            
            navigate(`/OrderDetail/${res.data.ID}`);
          }, 1000);
           
      }else{
            message.open({
            type: "error",
            content: "กรุณาเลือกประเภทผ้า ก่อนสร้าง order",
            duration: 3
          });
      }
    }
      } catch(error){
         message.open({
            type: "error",
            content: "เกิดข้อผิดพลาดในการสร้าง order",
            duration: 3
         })
         console.log("เกิดข้อผิดพลาดในการสร้าง order",error)
      } 
    }

    const handleUpload = async (id: number, files: FileList | null) => {//เอาไว้อัปโหลด
        if (!files || files.length === 0) {
            console.error("No files selected.");
            return;
        }

        const result = await UploadImageByOrderID(id, files);

        // ตรวจสอบผลลัพธ์จากการอัปโหลด
        if (!result) {
            console.error("Upload failed or no result returned.");
            return;
        }

        if (result.error) {
            console.error("Error:", result.error); // หากมี error ให้แสดงผล
        } else {
            // console.log("Upload successful:", result);
            setUploadStatus("Upload successful");
            setSelectedFiles(null);
            setPreview([]);
            
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Check if files were selected
        const files = event.target.files;
        if (files) {
          // Handle the selected files

          setSelectedFiles(files);
          const preview = Array.from(files).map((file) => {
            return URL.createObjectURL(file);
          });
          setPreview(preview);
          }
      };
      const deleteHandler = (image: string) => {   //ลบรูปตอนพรีวิวก่อน upload
        const index = preview.indexOf(image);
        if (index > -1) {
            const updatedPreview = [...preview];
            updatedPreview.splice(index, 1);
            setPreview(updatedPreview);

            const updatedFiles = selectedFiles ? Array.from(selectedFiles) : [];
            updatedFiles.splice(index, 1);
            const dt = new DataTransfer();
            updatedFiles.forEach(file => dt.items.add(file));
            setSelectedFiles(dt.files);

            URL.revokeObjectURL(image);
            console.log(updatedFiles);
        }
    };
    useEffect(() => {
    
        ()=>{

            console.log("selectedFiles",selectedFiles?.length)
      
          
        }
    }, [selectedFiles])
    useEffect(() => {
 
    })
    

   
    return(
        <div>
            {/* <p>total is {Total}</p>
            <p>selec addon is  {selectedAddon}</p>
            <p>selec Cloth is  {selectedCloth}</p> */}
            {/* <UploadImage OrderID={orderid}/> */}

          
           {
            selectedCloth.length !== 0 && (
              <>

               <p className="text-2xl text-center my-10">คูปองส่วนลด</p>
               <Discount totaprice={Total} HDiscount={setDiscount} SelectedReward={setSelectReward} />
               </>
            )
           }
           

          <div className="w-full flex justify-center">

       
           <div className="w-full h-auto my-5 bg-gradient-to-tl from-cyan-400 to-sky-400 p-3 rounded-lg">
            <p className="text-xl text-center mb-2 ">แจ้งหมายเหตุ</p>
              <div className="w-full flex justify-center">
                <textarea 
                className="w-full  rounded-sm  px-2 py-2"
                 placeholder="แจ้งหมายเหตุ" onChange={(e) => setNote(e.target.value)} 
                 rows={4}
                 />
              </div>
                
             </div>
           </div>

            <p className="text-xl font-semibold text-center my-3">แนบรูปตะกร้า</p>
             <div className="w-full flex justify-center my-5 ">

            <div className="w-full h-[200px] preview-before-upload flex items-center gap-5 shadow-sm  px-2 py-2 rounded-lg border-dashed border-2 border-[#00BBF0]">
              
            {/* <button onClick={() => handleUpload(Number(orderid), selectedFiles)}>Upload</button> */}
              <div className="w-auto flex gap-5 h-[200px] items-center">
                {
                    preview && preview.map((url) => 
                   (
                     <div className="relative">
                      <img src={url} key={url} alt="preview" className="w-auto h-[150px] rounded-lg shadow-lg" />
                      <div className="absolute top-[-10px] right-[-15px]">
                            <div onClick={() => deleteHandler(url)} className="cursor-pointer "><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                             <linearGradient id="wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"></stop><stop offset=".443" stop-color="#ee3d4a"></stop><stop offset="1" stop-color="#e52030"></stop></linearGradient><path fill="url(#wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414	c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414	c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414	C33.973,30.997,33.973,29.731,33.192,28.95z" opacity=".05"></path><path d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414	c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414	c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414	c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414	C33.425,30.839,33.425,29.889,32.839,29.303z" opacity=".07"></path><path fill="#fff" d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485	c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142	C30.047,15.124,30.681,15.124,31.071,15.515z"></path><path fill="#fff" d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343	c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142	C32.876,30.047,32.876,30.681,32.485,31.071z"></path>
                            </svg></div>  
                      </div>
                      
                     </div>
                   
                   ) )
                }
              </div>

             


              <input 
              name="fileInput"
              id= "fileInput" type="file" multiple onChange={handleFileChange} accept="image/png , image/jpeg, image/webp" className="hidden"/>
              <div
                 id="cover"
                 className="border-dashed border-2 w-[150px] h-[150px]  flex items-center justify-center rounded-lg shadow-lg cursor-pointer"
                 onClick={() => document.getElementById('fileInput')?.click()} // คลิก div เพื่อ trigger input
                >
                    <img src="../icon/image (1).png" alt="" />
                </div>
                
            </div>
             </div>
            
            <div className="w-full flex justify-center"
             
            >
              
              {data && data.QuotaOrder || 0 > 0 ? (
               <motion.div className="bg-[#24292E]  text-white font-bold py-2 px-4 rounded my-5 cursor-pointer" 
                onClick={showModal} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                >สร้าง order -{FinalScore}</motion.div>
            
                ) : (
                  <motion.div className="bg-[#24292E]  text-white font-bold py-2 px-4 rounded my-5 cursor-pointer" 
                onClick={checkout} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                >สร้าง order -{FinalScore}</motion.div>
                )}
               
                <Modal
                  title={<span style={{ fontSize: "20px", fontWeight: "bold", color: "#24292E" }}>ตรวจพบสิทธิพิเศษ!!</span>}
                  open={isModalVisible}
                  onOk={usequota}
                  onCancel={() => setIsModalVisible(false)} 
                  okText="ใช้"
                  cancelText="ข้าม"
                  okButtonProps={{ style: { backgroundColor: "#00BBF0", borderColor: "#00BBF0" } }}
                  cancelButtonProps={{
                    style: { color: "#555", borderColor: "#ccc" },
                    onClick: modalfinish, // เรียกฟังก์ชัน modalfinish เมื่อกดปุ่ม "ข้าม"
                }}
                >
                    <p className="text-[16px]">คุณสามารถซักฟรีได้ คุณต้องการใช้หรือไม่</p>
                </Modal>
                



                 


            </div>

           

           
            
           
        </div>
    )
}
export default Calculate
