import React, { useState } from "react";
import { SignUp } from "../../services/https";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { useNavigate } from "react-router-dom";
import myImage from "../SignUp/add-user.png";

import "./SignUp.css";

const SignUpPage: React.FC = () => {
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
  
      return updatedForm;
    });
  };
  

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;
  //   if (files && files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormData({
  //         ...formData,
  //         [name]: reader.result as string, // Store image as base64 string
  //       });
  //     };
  //     reader.readAsDataURL(files[0]); // Convert image to base64
  //   }
  // };

  const handleSubmit = async () => {
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
  

  return (
    <div className="SignUpPage">
      <div className="SignUpCard">
      <img
      src={myImage}
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "10px",
      }}
      />
        <h1>Create Account</h1>
        <form className="SignUpForm">
  <div className="form-row">
    <div className="form-group">
      <label>UserName</label>
      <input
        type="text"
        name="UserName"
        placeholder="JSON"
        value={formData.UserName}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input
        type="password"
        name="Password"
        placeholder="more 5 characters"
        value={formData.Password}
        onChange={handleChange}
      />
    </div>
  </div>
  
  <div className="form-row">
    <div className="form-group">
      <label>Your Email</label>
      <input
        type="email"
        name="Email"
        placeholder="Example@gmail.com"
        value={formData.Email}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Phone Number</label>
      <input
        type="text"
        name="Tel"
        placeholder="09x-xxx-xxxx"
        value={formData.Tel}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) {
            setFormData({ ...formData, Tel: value });
          }
        }}
      />
    </div>
  </div>
  
  <div className="form-row">
    <div className="form-group">
      <label>First Name</label>
      <input
        type="text"
        name="FirstName"
        placeholder="JSON"
        value={formData.FirstName}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Last Name</label>
      <input
        type="text"
        name="LastName"
        placeholder="BORN"
        value={formData.LastName}
        onChange={handleChange}
      />
    </div>
  </div>
  
  <div className="form-row">
    <div className="form-group">
      <label>Age</label>
      <input
        type="number"
        name="Age"
        placeholder="15"
        value={formData.Age || " "}
        onChange={handleChange}
      />
    </div>
  </div>
  
  <button type="button" onClick={handleSubmit}>
    Sign Up
  </button>
</form>

      </div>
    </div>
  );
};

export default SignUpPage;
