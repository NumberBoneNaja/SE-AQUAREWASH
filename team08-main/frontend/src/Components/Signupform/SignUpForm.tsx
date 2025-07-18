import { useEffect, useState } from "react";
import { ScreenMode } from "../../Page/newSignup/newLogin";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { useNavigate } from "react-router-dom";
import { SignUp } from "../../services/https";
import { motion } from "framer-motion";

type LoginFormProps = {
    onSwitchMode: (mode: typeof ScreenMode) => void;
};
function SignupForm({ onSwitchMode }: LoginFormProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const navigate = useNavigate();
     const [formData, setFormData] = useState<UsersInterface & { Tel: string }>({
       UserName: "",
       Password: "",
       Email: "",
       Profile: "",
       ProfileBackground: "",
       FirstName: "",
       LastName: "",
       Age: 0,
       Tel: "",
       Status: "User",
     });
   
     const createImageFromText = (text: string, bgColor: string, textColor: string): string => {
       const canvas = document.createElement("canvas");
       canvas.width = 100;
       canvas.height = 100;
       const ctx = canvas.getContext("2d");
   
       if (ctx) {
         // Fill background
         ctx.fillStyle = bgColor;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
   
         // Draw text
         ctx.fillStyle = textColor;
         ctx.font = "bold 40px Arial";
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         ctx.fillText(text, canvas.width / 2, canvas.height / 2);
       }
   
       return canvas.toDataURL(); // Convert canvas to base64 image
     };
   
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target;
     
       setFormData((prev) => {
         const updatedForm = {
           ...prev,
           [name]: name === "Age" ? (value === "" ? 0 : parseInt(value, 10)) : value,
         };
     
         // ตรวจสอบเฉพาะกรณีที่ผู้ใช้กรอก Username และไม่ได้อัปโหลดรูป
         if (
           name === "UserName" &&
           value.length >= 3 &&
           (!prev.Profile || !prev.ProfileBackground)
         ) {
           const initials = value.substring(0, 3).toUpperCase();
           const profileImage = createImageFromText(initials, "#4caf50", "#ffffff");
           const backgroundProfileImage = createImageFromText(
             initials,
             "#2196f3",
             "#ffffff"
           );
     
           updatedForm.Profile = profileImage;
           updatedForm.ProfileBackground = backgroundProfileImage;
         }
         validateForm(updatedForm);
         return updatedForm;
       });
     };


     const onSubmitform = async () => {
        if (!validateForm(formData)) {
            alert("Please fix the errors before submitting.");
            return; // หยุดการ Submit ถ้า Validation ล้มเหลว
        }
       
        try {
          const result = await SignUp(formData);
          if (result.message == "Sign-up successful") {
            navigate("/"); // Redirect on success
            alert("Sign-up successful!");
            
          } else {
            alert(`Error: ${result.message}`); // 7แสดงข้อความข้อผิดพลาด
          }
        } catch (error) {
          console.error("Error during sign-up:", error);
          alert("An unexpected error occurred.");
        }
      };
      const validateForm = (formData: UsersInterface & { Tel: string }) => {
        let newErrors: { [key: string]: string } = {};

        if (!formData?.UserName?.trim()) {
            newErrors.UserName = "Username is required";
        }
        if (!formData?.Password?.trim()) {
            newErrors.Password = "Password is required";
        } else if (formData.Password.length < 6) {
            newErrors.Password = "Password must be at least 6 characters";
        }

        if (!formData?.Email?.trim()) {
            newErrors.Email = "Email is required";
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.Email)) {
            newErrors.Email = "Invalid email address";
        }

        if (!formData.Tel.trim()) {
            newErrors.Tel = "Telephone number is required";
        } else if (!/^\d{10}$/.test(formData.Tel)) {
            newErrors.Tel = "Telephone number must be 10 digits";
        }

        if (!formData?.FirstName?.trim()) {
            newErrors.FirstName = "First name is required";
        }

        if (!formData?.LastName?.trim()) {
            newErrors.LastName = "Last name is required";
        }

        if ((formData.Age ?? 0) <= 0) {
            newErrors.Age = "Age must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


      



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
        const ErrorMessage = ({ error }: { error?: string }) => (
            <span className="text-red-500 text-xs mt-1 text-wrap">{error}</span>
          );



    return (
        <div className="h-full w-[400px] bg-white 
        py-6
        lg:rounded-l-[20px]
        md:rounded-l-[20px]
        sm:rounded-l-[20px]
        rounded-l-[0px]
        "
        
        >   
         <motion.div
         initial={{ x: "20%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-20%", opacity: 0, transition: { duration: 0.2 } }}
        transition={{ delay: 0, duration: 0.4 }}
        className="w-full h-full flex flex-col items-center "
         >
            <div className="logo ">
                        <img src="../icon/logo-1.png" alt="" className="w-[200px]"/>
                     </div>
            <div>
                <h1 className="text-3xl font-semibold text-center text-[#F73859] mb-5">Create Account</h1>
            </div>

            <div className="px-2 max-w-[350px]">
                <form action="#" method="POST" className=" ">
                <div className="grid grid-cols-2 gap-3">
                    <div  className="relative flex flex-col items-start min-h-[50px] h-fit">
                  
                        <input
                            type="text"
                            name="UserName"
                            placeholder=""
                            id="UserName"
                            value={formData.UserName}
                            onChange={handleChange}
                            className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                            text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                            focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                            />   
                            
                            <label className="absolute text-sm text-gray-500  duration-300 transform 
                            -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        htmlFor="UserName"
                        >Username</label>
                         {errors.UserName && <ErrorMessage error={errors.UserName} />}
                        
                      
                      
                    </div>
                    <div className="relative flex flex-col items-start min-h-[50px] h-fit">
                      
                        <input
                            type="password"
                            name="Password"
                            placeholder=""
                            id="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                            text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                            focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                            />   
                            <label className="absolute text-sm text-gray-500  duration-300 transform 
                            -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        htmlFor="Password"
                        >Password</label>
                         {errors.Password && <ErrorMessage error={errors.Password} />}
                    </div>
                  
                    <div className="relative flex flex-col items-start min-h-[50px] h-fit">
                      
                        <input
                            type="email"
                            name="Email"
                            placeholder=""
                            id="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                            text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                            focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                            />   
                            <label className="absolute text-sm text-gray-500  duration-300 transform 
                            -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        htmlFor="Email"
                        >Email</label>
                        {errors.Email && <ErrorMessage error={errors.Email} />}
                    </div>
                    <div className="relative flex flex-col items-start h-[50px]">
                      
                      <input
                          type="text"
                          name="Tel"
                          placeholder=""
                          id="Tel"
                          value={formData.Tel}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setFormData({ ...formData, Tel: value });
                            }
                          }}
                          className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                          text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                          focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                          />   
                          <label className="absolute text-sm text-gray-500  duration-300 transform 
                          -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                          peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      htmlFor="Tel"
                      >Tel.</label>
                      {errors.Tel && <ErrorMessage error={errors.Tel} />}
                  </div>
                  <div className="relative flex flex-col items-start min-h-[50px] h-fit">
                      
                      <input
                          type="text"
                          name="FirstName"
                          placeholder=""
                          id="FirstName"
                          value={formData.FirstName}
                          onChange={handleChange}
                          className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                          text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                          focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                          />   
                          <label className="absolute text-sm text-gray-500  duration-300 transform 
                          -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                          peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      htmlFor="FirstName"
                      >First Name</label>
                      {errors.FirstName && <ErrorMessage error={errors.FirstName} />}
                  </div>

                  <div className="relative flex flex-col items-start min-h-[50px] h-fit">
                      
                      <input
                          type="text"
                          name="LastName"
                          placeholder=""
                          id="LastName"
                          value={formData.LastName}
                          onChange={handleChange}
                          className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                          text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                          focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                          />   
                          <label className="absolute text-sm text-gray-500  duration-300 transform 
                          -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                          peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      htmlFor="LastName"
                      >First Name</label>
                      {errors.LastName && <ErrorMessage error={errors.LastName} />}
                  </div>

                  <div className="relative flex flex-col items-start min-h-[50px] h-fit">
                      
                      <input
                          type="number"
                          name="Age"
                          placeholder=""
                          id="Age"
                          value={formData.Age || " "}
                          onChange={handleChange}
                          className="block rounded-t-lg  pb-1  pt-5 w-full text-sm 
                          text-gray-900  h-full  border-0 border-b-2 border-blue-bg appearance-none 
                          focus:outline-none focus:ring-0 focus:border-text-base-black peer"
                          />   
                          <label className="absolute text-sm text-gray-500  duration-300 transform 
                          -translate-y-4 scale-75 top-5 z-10 origin-[0]  peer-focus:text-blue-bg
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 
                          peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                      htmlFor="Age"
                      >Age</label>
                        {errors.Age && <ErrorMessage error={errors.Age} />}
                  </div>
            
                </div>

                 
               
         
                <div className="flex justify-center">
                    <button type="button" onClick={onSubmitform}
                    className="mt-9 flex w-[50%] justify-center rounded-md bg-base-black px-3 py-1.5 text-sm/6 font-semibold 
                    text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Create Account
                </button>
                </div>
                
                </form>
                <div className="flex justify-center mt-3">
                    <div>
                        <p className="text-sm text-gray-500">Already have an account? </p>
                    </div>
                    <div
                        className="w-fit  text-[#F73859] text-sm font-semibold  cursor-pointer ml-2"
                        onClick={() => handleSwitchMode({ SIGN_IN: ScreenMode.SIGN_IN, SIGN_UP: '' })}>
                        Sign In
                    </div>
                </div>
                 
            </div>

           
            </motion.div>
            </div>
        
    )
}export default SignupForm