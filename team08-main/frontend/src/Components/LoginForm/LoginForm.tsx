
import {  useNavigate } from "react-router-dom"

import {  message } from "antd";
import {  SignIn } from "../../services/https";
import { SyntheticEvent, useEffect, useState } from "react";
import { ScreenMode } from "../../Page/newSignup/newLogin";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";



type LoginFormProps = {
    onSwitchMode: (mode: typeof ScreenMode) => void;
};

function LoginForm({ onSwitchMode }: LoginFormProps) {
     const navigate = useNavigate();
     const [sign, setSign] = useState({
        UserName : '' , Password : ''
     });
     const [errors, setErrors] = useState({
        UserName: '',
        Password: ''
    });
     
    async function submit(e: SyntheticEvent){
        e.preventDefault();
      
        
        const newErrors = {
            UserName: sign.UserName ? '' : 'Username is required',
            Password: sign.Password ? '' : 'Password is required'
        };
        setErrors(newErrors);
        let res = await SignIn(sign );
    
        if (res.status === 200) {//ตรวจสอบ status ที่ส่งมาจาก API 201=สร้างสำเร็จ 200=สำเร็จ 409=มีข้อผิดพลาดที่ไม่เข้ากันกับระบบ เป็นต้น
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);
            const infotoken:any = jwtDecode(res.data.token||'');
            
            localStorage.setItem("Status", infotoken.Status);
           
            // localStorage.setItem("status",infotoken. );

            message.success("เข้าสู่ระบบเรียบร้อย"); //เก็บค่า success คือ Login successful
            //  fetchUserData(res.data.id);
            if (infotoken.Status === "Admin") {
                setTimeout(() => {
                    navigate("/AdminManager");
                })
                
            } else if (infotoken.Status === "User" ) {
                setTimeout(() => {
                     navigate("/Home");
                });
               
                navigate("/AdminManager");
            } else if (infotoken.Status === "Member") {
                setTimeout(() => {
                    navigate("/Home");
               });
            }
            else if (infotoken.Status === "Employee") {
                setTimeout(() => {
                      navigate("/EmHome");
                })
              
            }
            else if(infotoken.Status === "Member"){
                setTimeout(() => {
                    navigate("/Home"); 
                })
               
            }
           
          
            
        } else {
            message.error(res.data.error);
            message.warning("กรุณากรอกข้อความให้ครบ");
        
        }


    }
    // const fetchUserData = async (userIdstr: string ) => {
    //     try {
    //         const res = await GetUserById(userIdstr);
    //         if (res.status === 200) {
    //         //    console.log("token is ",localStorage.getItem("token"))
    //             localStorage.setItem("status", res.data.Status);
    //             message.success("พบข้อมูลUser");
    //             //config ต่อ
    //             console.log("status in face:",res.data);
    //         }else {
    //             message.error("error");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching user data:", error); // Debug
    //         message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
    //     }
    // };
    function signchange(event: { target: { name: any; value: any; }; }){
        const {name, value} = event.target;
        setSign(prevSign => {
            return{
                ...prevSign,
                [name] : value
            }
        });

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value ? '' : `${name} is required`
        }));

     }



     useEffect(() => {
        const savedMode = localStorage.getItem("screenMode");
        if (savedMode) {
            onSwitchMode(JSON.parse(savedMode)); // คืนค่า mode ที่บันทึกไว้
        }
    }, [onSwitchMode]);

    // บันทึก ScreenMode ลงใน localStorage เมื่อเปลี่ยนโหมด
    const handleSwitchMode = (mode: typeof ScreenMode) => {
        localStorage.setItem("screenMode", JSON.stringify(mode)); // บันทึกลง localStorage
        onSwitchMode(mode); // เปลี่ยนโหมด
    };
    

    return (
        <div className="h-full w-[400px] bg-white 
        pt-6 pb-24
        lg:rounded-l-[20px]
        md:rounded-l-[20px]
        sm:rounded-l-[20px]
        rounded-l-[0px]
        "
        
        >       
                <motion.div className="w-full h-full flex flex-col  items-center gap-9 justify-around "
                  initial={{ x: "20%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-20%", opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0, duration: 0.4 }}
                >
                     <div className="logo">
                        <img src="../icon/logo-1.png" alt="" className="w-[200px]"/>
                     </div>
                     <div>
                        <h1 className="text-3xl font-semibold text-center text-[#F73859]">WELLCOME!</h1>
                     </div>
                    
                     <div className=" sm:mx-auto sm:w-full sm:max-w-sm  w-full">
                         <p className="text-2xl font-semibold text-center text-base-black mt-6 mb-10">Sign - Up</p>
                        <form action="#" method="POST" className=" "  >
                            <div className="w-full flex justify-center mt-5 ">
                                <div className="w-[70%]   ">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 ">
                                        Username
                                    </label>
                                    <div className=" flex">
                                    
                                        <div className="w-full ">
                                            <input
                                            
                                            name="UserName"
                                            type="text"
                                            value={sign.UserName}
                                            onChange={signchange}
                                            placeholder="Enter Username"
                                            // autoComplete="email"
                                            className=" w-full block  rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6
                                             
                                        px-2 "
                                            />
                                            {errors.UserName && <p
                                            
                                            className="text-red-500 text-xs mt-1">Username is required</p>}
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            
                            </div>

                            <div className="w-full flex justify-center mt-3">
                                <div className="w-[70%]  ">
                                    <div className="">
                                        <label htmlFor="password" className="block 
                                    
                                        text-sm/6 font-medium text-gray-900">
                                        Password
                                        </label>
                                    
                                    </div>
                                    <div >
                                        <input
                                        type="password"
                                        value={sign.Password}
                                        name = "Password"
                                        onChange={signchange}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6
                                        w-full
                                        px-2 "
                                        />
                                       {errors.Password && <p className="text-red-500 text-xs mt-1">{errors.Password}</p>}
                                    
                                    </div>
                                </div>
                            
                            </div>

                            <div className="flex items-center justify-center mt-6">
                            <button
                                type="submit"
                                className="flex w-[70%] justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={submit}>
                                Sign in
                            </button>
                            </div>
                        </form>

                        <p className="mt-5 text-center text-sm/6 text-gray-500">
                            Not a member?{' '}
                            <div onClick={() => handleSwitchMode({ SIGN_IN: '', SIGN_UP: ScreenMode.SIGN_UP })} className="font-semibold  hover:text-pink-300 text-pink-500">
                            Rigister
                            </div>
                        </p>
                        </div>
                     
                </motion.div>

           
            
        </div>
        
    )
}

export default LoginForm