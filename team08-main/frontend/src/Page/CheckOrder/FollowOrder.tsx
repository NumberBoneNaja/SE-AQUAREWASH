
import { useEffect, useState } from "react"

import { OrderDetailInterface } from "../../interfaces/IOrderDetail"
import { AddOnInterface } from "../../interfaces/IAddOn"
import { ImageInterface } from "../../interfaces/IImage"
import { GetAddOnByOrderID, GetClothDetailByOrderID, GetImageID, UploadImageByOrderID } from "../../services/https"

import { GetOrderByID } from "../../services/https/index1"
import { Image, message } from 'antd';

import { motion } from "framer-motion"
import SteperFollow from "../../Components/Stepper/SteperFollow"
import { useNavigate } from "react-router-dom"




function FollowOrder({id}:{id:string}) {
    const [orderstatus,setOrderstatus] = useState("")
    const [dataCloth,setDatacloth] = useState<OrderDetailInterface[]>([])
    const [dataAddOn,setDataAddOn] = useState<AddOnInterface[]>([])
    const [image,setImage] = useState<ImageInterface[]>([])
    const [showAll, setShowAll] = useState(false);
    const initialDisplayCount = 2;
    const [note,setNote] = useState<string[]>([])
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [preview, setPreview] = useState<string[]>([]);
    

    const displayedImages = showAll ? image : image.slice(0, initialDisplayCount);

    async function fetchClothdetail() {
            const res = await GetClothDetailByOrderID(Number(id));    
            setDatacloth(res.data);
            // console.log("clothdetail: ", res.data);
           
        }
        async function fetchAddondetail() {
            
            const res = await GetAddOnByOrderID(Number(id));    
            setDataAddOn(res.data);
            // console.log("Addondetail: ", res.data);
        }
    
        async function fetchImageProff() {
            
            const res = await GetImageID(Number(id))
            setImage(res)
            // console.log("image: ", res);
        }

        async function fetchNote() {
            const res1 = await GetOrderByID(Number(id));
            // console.log("note: ",res1.data[0].Note)
            setNote(res1.data[0].Note)
            setOrderstatus(res1.data[0].OrderStatusID)
            // console.log("note: ", res1);
        }
         

    
        
        useEffect(() => {
            fetchClothdetail();
            fetchAddondetail();
            fetchImageProff();
            fetchNote()
        },[]);
    
        useEffect(() => {
            // console.log("image: ",image.length)
        },[dataCloth,dataAddOn,image,note]);
        

        function goback() {
            setTimeout(() => {
                navigate(`/AllOrderUser`);
            },1000)
        }

        const handleUpload = async (id: number, files: FileList | null) => {//เอาไว้อัปโหลด
                if (!files || files.length === 0) {
                    // console.error("No files selected.");
                    message.open({
                        type: 'error',
                        content: 'กรุณาเลือกรูปก่อน',
                    })
                    return;
                }
        
                const result = await UploadImageByOrderID(id, files);
        
                // ตรวจสอบผลลัพธ์จากการอัปโหลด
                if (!result) {
                    // console.error("Upload failed or no result returned.");
                    message.open({
                        type: 'error',
                        content: 'เพิ่มรูปไม่สําเร็จ',
                    })
                    return;
                }
        
                if (result.error) {
                    // console.error("Error:", result.error); // หากมี error ให้แสดงผล
                    message.open({
                        type: 'error',
                        content: 'เพิ่มรูปไม่สําเร็จ',
                    })
                } else {
                    // console.log("Upload successful:", result);
                    message.open({
                        type: 'success',
                        content: 'เพิ่มรูปสำเร็จ',
                    })
                    fetchImageProff();
                    // setSelectedFiles(null);
                    // setPreview([]);
                    
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
                    // console.log(updatedFiles);
                }
            };

        

    return (
        <>
           
           <div className="lg:w-[70%] w-full h-full rounded-lg  flex flex-col justify-between max-h-[88vh] bg-white px-5">

             <div className="stepper flex justify-center  w-full px-24 py-2 ">
                <div className="w-full">
                    <p className="text-[20px] text-center mb-4 text-base-black">สถานะ Order</p>
                 
                    {/* <Stepper status={orderstatus}/> */}
                    <SteperFollow step={Number(orderstatus) }/>
                </div>
               

             </div>
             <div className="overflow-y-auto ">
                <p className="text-[20px] m-3">รายละเอียด</p>
               <div className="w-full max-h-[300px] h-fit  overflow-y-auto rounded-[10px] 
               px-4 py-3  bg-white shadow-sm ">

                 <div className="w-full max-h-[300px] h-fit overflow-y-auto rounded-[5px]  ">

                
                    <table className="w-full text-sm text-left rtl:text-right text-base-black  ">
                                <thead className="text-[16px] text-base-black font-light bg-blue-bg-10 ">
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
        
              <p className="text-[20px] m-3">บริการเสริม</p>
             {
               dataAddOn.length > 0 ? (
                <>
                 
                    <div className="w-full max-h-[300px] h-fit overflow-y-auto rounded-[10px] px-4 py-3  bg-white shadow-sm ">
            
                        <div className="w-full max-h-[300px] h-fit overflow-y-auto rounded-[5px]  ">
                                            
                            <table className="w-full text-sm text-left rtl:text-right text-base-black   ">
                                        <thead className="text-[16px] text-base-black font-light bg-blue-bg-10  ">
                                            <tr >
                                            <th scope="col" className="px-6 py-3">
                                                    ลำดับ
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center">
                                                    การบริการ
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center">
                                                    คำอธิบาย
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-end">
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
                </>
               ):
               <p className="text-[16px] m-3 text-center text-base-black bg-white py-6 rounded-lg shadow-sm">ไม่ได้เลือกบริการเสริม</p>
             }
                
                <div className="w-full md:grid md:grid-cols-2 ">
                    <div className="">
                   
                        <p className="text-[20px] m-3">รูปภาพ</p>

                        {
                        image.length > 0 ?(
                        <>
                                <div className="w-fit h-fit flex flex-wrap justify-start gap-5 " >
                                
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
                        </>
                    ):
                        <div className="">
                            <div className="flex flex-wrap gap-5">

                          
                              {
                                    preview && preview.map((url) => 
                                (
                                    <div className=" ">
                                        <div className="relative">
                                           <img src={url} key={url} alt="preview" className="w-[150px] h-[150px] object-fit 
                                           rounded-lg 
                                        
                                        " /> 
                                            <div className=" absolute top-[-10px] right-[-13px]" onClick={() => deleteHandler(url)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                                    <linearGradient id="wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1" 
                                                    x1="9.858" x2="38.142" y1="9.858" y2="38.142" 
                                                    gradientUnits="userSpaceOnUse"><stop offset="0" 
                                                    stop-color="#f44f5a"></stop><stop offset=".443" 
                                                    stop-color="#ee3d4a"></stop><stop offset="1" 
                                                    stop-color="#e52030"></stop></linearGradient>
                                                    <path fill="url(#wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1)"
                                                    d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
                                                    
                                                    <path d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414	c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414	c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414	C33.973,30.997,33.973,29.731,33.192,28.95z" opacity=".05"></path><path d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414	c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414	c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414	c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414	C33.425,30.839,33.425,29.889,32.839,29.303z" opacity=".07"></path><path fill="#fff" d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485	c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142	C30.047,15.124,30.681,15.124,31.071,15.515z"></path><path fill="#fff" d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343	c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142	C32.876,30.047,32.876,30.681,32.485,31.071z"></path>
                                                    </svg>
                                            </div>
                                        </div>
                                      
                                    </div>
                                
                                ) )
                                }
                               </div>   

                        <div className="w-full flex justify-center">

                        
                            <input 
                            name="fileInput"
                            id= "fileInput" type="file" multiple onChange={handleFileChange} accept="image/png , image/jpeg, image/webp" 
                            className="hidden" />
                            <button className="text-[16px] m-3 text-center text-white bg-blue-bg px-3 py-1 rounded-lg shadow-sm"
                            onClick={() => document.getElementById('fileInput')?.click()}>เพิ่มรูปภาพ</button>
                            {
                                preview.length > 0 && (
                                    <div className="flex items-center">
                                        <button className="text-[16px] m-2 text-center text-white bg-blue-bg px-3 py-1 rounded-lg shadow-sm"
                                         onClick={() => handleUpload(Number(id), selectedFiles)}>บันทึก</button>
                                    </div>
                                )
                            }
                          </div>  
                        </div>
                          
                    

                  
                }
                        
                        

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
                    </div>
                    <div className="">
                        <p className="text-[20px] m-3">หมายเหตุ</p>

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
        
           <div className="w-full flex justify-start "
             
            >
                <motion.div className="bg-[#24292E]  text-white font-semibold  px-4 rounded m-2 cursor-pointer" 
                onClick={() => goback()} whileHover={{ scale: 1.1 }} whileTap={{scale: 0.9}}
                >Back</motion.div>
            </div>
           

           </div>
        
        </>
       

    )
}
export default FollowOrder


