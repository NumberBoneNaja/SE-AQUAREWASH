import { useEffect, useState } from "react";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetUserID, PatchBg, PatchProfile } from "../../services/https/index1";
import {  GetMembershipPaymentsByUserID, UpdateUserByid } from "../../services/https";

import { message } from "antd";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


function ProFileCom() {
    const [user, setUser] = useState<UsersInterface | null>(null);
   
    const [proselect,setProselect] = useState<string | File>("");
    const [bgselect,setBgselect] = useState<string | File>("");
    const [preview, setPreview] = useState<string>("");
    const [bgpreview,setBgpreview] = useState<string>("");
    const [infomation,setInfomation] = useState<UsersInterface>({
        UserName: user?.UserName || "",
        Email: user?.Email || "",
        FirstName: user?.FirstName || "",
        LastName: user?.LastName || "",
        Tel: user?.Tel || "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    function gotocheck(){
      navigate("/HistoryMemberShipByUser")
    }
    function gotocheckorder(){
      navigate("/AllOrderUser")
    }
    function gotocheckbooking(){
      navigate("/BooksTable")
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInfomation((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        validateField(name as keyof UsersInterface, value);
    };
    const [errors, setErrors] = useState({
        Email: "",
        Tel: "",
      });
    

  const validateField = (name: keyof  UsersInterface, value: string) => {
    let errorMessage = "";
    if (value.trim() !== "") {
        // ตรวจสอบเฉพาะเมื่อมีการกรอกค่า
        if (name === "Email") {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (!emailRegex.test(value)) {
            errorMessage = "กรุณากรอกอีเมลให้ถูกต้อง";
          }
        } else if (name === "Tel") {
          const telRegex = /^[0-9]{10}$/;
          if (!telRegex.test(value)) {
            errorMessage = "กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง (10 หลัก)";
          }
        }
      }
    
    // ตั้งค่า errors สำหรับฟิลด์ที่ผิดพลาด
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
    

    const handleEditClick = () => {
        setIsEditing(true);
      };
    
      const  handleSaveClick = async() => {
        if (errors.Email || errors.Tel) {
            message.open(
                {
                    
                    type: "error",
                    content: "กรุณากรอกข้อมูลให้ถูกต้อง",
                    duration: 3
                }
            )
            setErrors({ Email: "", Tel: "" });
            return;
          }
        setIsEditing(false);
        const updatedFields: { [key: string]: any } = {};
      
        // เปรียบเทียบค่าปัจจุบันใน infomation กับค่าที่ได้จาก user
        for (const key in infomation) {
            // ใช้ค่าจาก user ถ้า infomation ว่างเปล่า หรือไม่เปลี่ยนแปลง
            if (
              infomation[key as keyof UsersInterface] !== user?.[key as keyof UsersInterface] &&
              infomation[key as keyof UsersInterface] !== ""
            ) {
              updatedFields[key] = infomation[key as keyof UsersInterface];
            } else if (user?.[key as keyof UsersInterface] !== undefined) {
              updatedFields[key] = user[key as keyof UsersInterface];
            }
          }
          // console.log("update",updatedFields)
      
        if (Object.keys(updatedFields).length > 0) {
            try{
                //  console.log("change data: ", updatedFields);
                const uid = localStorage.getItem("id");
                await UpdateUserByid(uid as string, updatedFields);
                message.open({
                    type: "success",
                    content: "เปลี่ยนแปลงข้อมูลสําเร็จ",
                    duration:3
                })
                getUser()
            }catch(error){
                message.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการเปลี่ยนแปลงข้อมูล",
                    duration: 3
                })
            }
         

        } else {
          // console.log("ไม่มีการเปลี่ยนแปลงข้อมูล");
        }
      };
    async function getUser() {
        const uid =localStorage.getItem("id");
        const res = await GetUserID(Number(uid))
        setUser(res)
        // console.log(res)
    }
    async function fetchMembership() {
        const uid =localStorage.getItem("id");
         await GetMembershipPaymentsByUserID(uid || "")
        // console.log("res",res)
        // setPayship(res)
    }
    useEffect(() => {
        getUser()
        fetchMembership()
    },[])
    useEffect(() => {
        console.log("pew",proselect)
        if (user) {
            setInfomation({
              UserName: user.UserName || "",
              Email: user.Email || "",
              FirstName: user.FirstName || "",
              LastName: user.LastName || "",
              Tel: user.Tel || "",
            });
          }
    },[user,proselect,preview,bgselect,bgpreview])
    
    function handleProfileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
    
        
        if (selectedFile) {
            setProselect(selectedFile); // เก็บชื่อไฟล์
            setPreview(URL.createObjectURL(selectedFile)); // สร้าง URL สำหรับ preview
          } else {
            setProselect("");
            setPreview(""); // ลบ preview หากไม่มีไฟล์
          }
        
      }
      function handleBgChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
        setBgselect(selectedFile); // เก็บชื่อไฟล์
        setBgpreview(URL.createObjectURL(selectedFile));// สร้าง URL สำหรับ preview
    } else {
        setBgselect("");
        setBgpreview(""); // ลบ preview หากไม่มีไฟล์
    }
}
 
      function reset (){
        setProselect("")
        setPreview("")
      }
      function resetBG (){
        setBgselect("")
        setBgpreview("")
      }
      async  function changeprofile(){
        try{
             const uid =localStorage.getItem("id");
            await PatchProfile(Number(uid), proselect as File)
            
            console.log("test")
            message.open({
                type: "success",
                content: "เปลี่ยน โปรไฟล์ สําเร็จ",
                duration: 3
            })
            reset()
            getUser()
            window.location.reload()
        }catch(error){
            message.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการเปลี่ยน Profile",
                duration: 3
            })
        }
           

      }
      async function changeBG(){
        try{
           const uid =localStorage.getItem("id");
            await PatchBg( Number(uid), bgselect as File)
           
            console.log("test bg") 
            message.open({
                type: "success",
                content: "เปลี่ยน พื้นหลัง สําเร็จ",
                duration: 3
            }) 
            resetBG()
            getUser()
        }catch(error){
            message.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการเปลี่ยน พื้นหลัง",
                duration: 3
            })
        }
        
      }
    //   async function changeinfo(){

    //   }
      
    return (
        <div className="lg:w-[70%] md:w-[80%]  py-2 w-full">
            <div className="h-full w-full  md:rounded-[20px] shadow-base-shadow bg-white">
                <div className="profilex p-4  h-[40%]">
                    <div className="bg-purple-500 w-full h-[80%] rounded-[10px]">
                        {
                            bgpreview ? (
                                <img src={bgpreview} alt="" className="w-full h-full object-cover rounded-[10px]" onClick={() => document.getElementById('bg-input')?.click()}/>
                            ) : (
                                <img src={user?.ProfileBackground} alt="" className="w-full h-full object-cover rounded-[10px]" />              
                            )
                        }
                          
                    </div>
                    <div className="w-full h-[20%] relative">
                        <div className="w-full h-auto flex items-end pl-5  absolute top-[-50px] justify-between">
                           <div className="flex items-end">
                                 <div className="w-[100px] h-[100px]  bg-slate-500 rounded-lg">
                                    {
                                        proselect ? (
                                            <img src={preview} alt="" className="w-full h-full object-cover object-center rounded-lg" onClick={() => document.getElementById('profile-input')?.click()} />
                                        ) : (
                                            <img src={user?.Profile} alt="" className="w-full h-full object-cover object-center rounded-lg" />
                                        )
                                    }
                                    
                                </div>
                                <div className="h-[100%] ml-2  ">
                                    <div className="flex gap-7  mr-8">
                                        <p className="text-base-black text-[20px] font-semibold">{user?.UserName}</p>
                                        <div className="flex items-center gap-1">
                                          <p>{user?.Point}</p>
                                          <img src="../icon/coin_18282762.png" alt="" className="w-[20px] h-[20px]" />
                                         </div>
                                        
                                    </div>
                                    <div>
                                        
                                    </div>
                                    <div className="flex gap-4">
                                    <input type="file" className="hidden" id="profile-input" accept="image/png , image/jpeg, image/webp"
                                     onChange={handleProfileChange}
                                    />
                                     
                                       {
                                          preview ? (
                                            <div >
                                                <button className="text-[14px] text-base-black mr-2" onClick={changeprofile}>ยืนยัน</button>
                                                <button className="text-[14px] text-base-red" onClick={reset}>ยกเลิก</button>
                                            </div>
                                            
                                            
                                          ):(
                                            <button className="text-[14px] text-base-black"
                                            onClick={() => document.getElementById('profile-input')?.click()}
                                            >แก้ไขโปรไฟล์</button> 
                                          )                                          
                                       }
                                     </div>   
                                </div>
                             </div>
                                <div className=" items-end mb-5 flex">
                                    {
                                            bgselect ? (
                                                
                                                <div className="flex gap-2">
                                                    <div>
                                                         <button className="text-[14px] text-base-black mr-2" onClick={changeBG}>ยืนยัน</button>
                                                    </div>
                                                   <div>
                                                        <button className="text-[14px] text-base-red" onClick={resetBG}>ยกเลิก</button>
                                                   </div>
                                                
                                                   
                                                </div>
                                            ):(
                                            <button className="bg-blue-bg px-2 py-[1px] text-[14px] text-white"
                                                onClick={() => document.getElementById('bg-input')?.click()}
                                                >แก้ไขพิ้นหลัง</button>
                                            )
                                        }
                                        <input type="file" className="hidden" id="bg-input" accept="image/png , image/jpeg, image/webp"
                                            onChange={handleBgChange}
                                            />
                                        
                                       
                                </div>
                      </div>
                        
                    </div>
                </div>
                <div className="information h-[60%]  px-8 py-1 overflow-auto">
                    <div className="w-full h-[10%] flex justify-end ">
                         <button className=" test-base-red text-blue-bg "
                        
                         onClick={isEditing ? handleSaveClick : handleEditClick}
                       >
                         {isEditing ? "บันทึก" : "แก้ไข"}
                         </button>
                    </div>
                   
                     <div className="w-full h-[60%] grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 grid-rows-6">
                     <div className="lg:col-span-1   h-full flex items-center text-base-black">
                            ชื่อผู้ใช้
                        </div>
                        <div className="lg:col-span-2  flex items-center text-base-black justify-between">
                          
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="UserName"
                                    value={infomation.UserName}
                                    onChange={handleInputChange}
                                    className="border-b-2  border-blue-bg lg:w-[30%] md:w-[60%] w-full bg-base-blue-20 px-2 rounded-t-sm"
                                />
                                ) : (
                                  <p>{user?.UserName}</p>
                                )}
                                
                        </div>
                        <div className="lg:col-span-1 h-full flex items-center text-base-black">
                            อีเมล
                        </div>
                        <div className="lg:col-span-2   flex items-center text-base-black">
                          
                            {isEditing ? (
                                <input
                                type="text"
                                name="Email" // ระบุ name ให้ตรงกับฟิลด์ใน state
                                value={infomation.Email} // เชื่อมต่อกับ state
                                onChange={handleInputChange}
                                    className="border-b-2 border-blue-bg lg:w-[30%] md:w-[60%] w-full bg-base-blue-20 px-2 rounded-t-sm"
                                />
                                ) : (
                                  <p>{user?.Email}</p>
                                )}
                                  {errors.Email && <p className="text-red-500 text-sm ml-2">{errors.Email}</p>}
                        </div>
                        <div className="lg:col-span-1  flex items-center text-base-black">
                            ชื่อ
                        </div>
                        <div className="lg:col-span-2   flex items-center text-base-black">
                           
                            {isEditing ? (
                                <input
                                type="text"
                                name="FirstName" // ระบุ name ให้ตรงกับฟิลด์ใน state
                                value={infomation.FirstName} // เชื่อมต่อกับ state
                                onChange={handleInputChange}
                                    className="border-b-2 border-blue-bg lg:w-[30%] md:w-[60%] w-full bg-base-blue-20 px-2 rounded-t-sm"
                                />
                                ) : (
                                  <p>{user?.FirstName}</p>
                                )}
                            
                        </div>
                        <div className="lg:col-span-1  flex items-center text-base-black">
                            นามสกุล
                        </div>
                        <div className="lg:col-span-2   flex items-center text-base-black">
                          
                            {isEditing ? (
                                <input
                                type="text"
                                name="LastName" // ระบุ name ให้ตรงกับฟิลด์ใน state
                                value={infomation.LastName} // เชื่อมต่อกับ state
                                onChange={handleInputChange}
                                    className="border-b-2 border-blue-bg lg:w-[30%] md:w-[60%] w-full bg-base-blue-20 px-2 rounded-t-sm"
                                />
                                ) : (
                                  <p>{user?.LastName}</p>
                                )}
                        </div>
                        <div className="lg:col-span-1   flex items-center text-base-black">
                            หมายโทรศัพท์
                        </div>
                        <div className="lg:col-span-2  flex items-center text-base-black">
                        
                            {isEditing ? (
                                <input
                                type="text"
                                name="Tel" // ระบุ name ให้ตรงกับฟิลด์ใน state
                                value={infomation.Tel } // เชื่อมต่อกับ state
                                onChange={handleInputChange}
                                    className="border-b-2 border-blue-bg lg:w-[30%] md:w-[60%] w-full bg-base-blue-20 px-2 rounded-t-sm"
                                />
                                ) : (
                                  <p>{user?.Tel || "-"}</p>
                                )}
                                 {errors.Tel && <p className="text-red-500 text-sm ml-2">{errors.Tel}</p>}
                        </div>
                       
                    
                       
                    </div>     
                    <div className="w-full h-[30%]   grid grid-cols-3">
                        <div className="  py-2 text-white  mx-1 md:mx-6  my-3 rounded-lg
                          bg-gradient-to-tl from-cyan-400 to-sky-400 flex flex-col items-center
                        justify-around
                        ">
                            <p className="text-truncate w-full text-xl  text-center">ประวัติการชำระ</p>
                            <motion.button 
                             whileHover={{ scale: 1.1 }} onClick={gotocheck}
                            className="border-2 border-white bg-base-black px-4">ดู</motion.button>
                        </div>
                        <div className="  py-2 text-white  mx-1 md:mx-6  my-3 rounded-lg
                          bg-gradient-to-tl from-[#484C51] to-[#24292E] flex flex-col items-center
                        justify-around
                        ">
                            <p className="text-truncate w-full text-xl text-center">รายการฝากซัก - อบ</p>
                            <motion.button 
                             whileHover={{ scale: 1.1 }} onClick={gotocheckorder}
                            className="border-2 border-white bg-base-black px-4">ดู</motion.button>
                    

                        </div>
                        <div className="  py-2 text-white mx-1 md:mx-6 my-3 rounded-lg
                          bg-gradient-to-tl from-red-400 to-[#F73859]  flex flex-col items-center
                        justify-around 
                        ">
                            <p className="text-truncate w-full text-xl text-center">จองเครื่องซัก - อบ</p>
                            <motion.button 
                             whileHover={{ scale: 1.1 }} onClick={gotocheckbooking}
                            className="border-2 border-white bg-base-black px-4">ดู</motion.button>
                        </div>
                     
                    </div>                  
                </div>
            </div>
        
        </div>
    )
      
}

export default ProFileCom