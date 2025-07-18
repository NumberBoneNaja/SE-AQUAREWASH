import React, { useState } from 'react';
import './Login.css'
import { Form, Input ,message} from 'antd';
import {SignInInterface} from "../../interfaces/SignIn";
import { SignIn } from '../../services/https';
// import Arrow from '../../assets/icon/ForPage/LoginIcon/Arrow.png';
import User from '../../assets/icon/ForPage/LoginIcon/User.png';
import Lock from '../../assets/icon/ForPage/LoginIcon/Lock.png';

import { useNavigate } from "react-router-dom";

import {IntroWeb} from '../Component/NavBar';
const Login: React.FC = () => {
    const navigate = useNavigate();
    const onFinish = async (values: SignInInterface) => {
        let res = await SignIn(values);
    
        if (res.status === 200) {//ตรวจสอบ status ที่ส่งมาจาก API 201=สร้างสำเร็จ 200=สำเร็จ 409=มีข้อผิดพลาดที่ไม่เข้ากันกับระบบ เป็นต้น
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);

            message.success("Login successful"); //เก็บค่า success คือ Login successful
            introToMain();
            
            
        } else {
            message.error(res.data.error);
            message.warning("กรุณากรอกข้อความให้ครบ");
        }
        
    };
    const [intro, setIntro] = useState(false);
    const introToMain = async () => {
        setIntro(true);
        setTimeout(() => {
            location.href = "/Main";
        }, 9000);
    };
    const close = async () => {
        setIntro(false);
        location.href = "/Main";
    }
    return(
        <>
            {intro && 
                <div onClick={close}><IntroWeb /></div>
            }
            <div className='backgroud'></div>
            <div className='Logincontanner'>
                <div className='Loginsub'>
                <span className='LoginLeft'><p>Welcome</p><p>สะอาดสดใส ใส่ใจทุกขั้นตอน</p></span>
                <span className='Loginrigth'>
                    <div className='formLogin'>
                        <div style={{color: '#1d1d1d'}}>Login</div>
                        <Form
                            name="login"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            <p style={{color: '#1d1d1d'}}>UserName</p>
                            <img className='iconuser' src={User} alt="User" />
                            <Form.Item
                                className='username'
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                
                                <Input placeholder="username" />
                            </Form.Item>
                            <p style={{color: '#1d1d1d'}}>Password</p>
                            <img className='iconuser' src={Lock} alt="Lock" />
                            <Form.Item
                                className='password'
                                name="password"
                                
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                
                                <Input.Password placeholder="password" />
                            </Form.Item>
                            <div>
                                <a
                                    style={{ color: "#2dba4e", fontWeight: "400", cursor: "pointer" }}
                                    onClick={() => navigate("/signup")}
                                >
                                    Create A New Account?
                                </a>
                            </div>
                            <div className="LoginButton">
                            <Form.Item>
                                <button>
                                    LOGIN
                                    
                                </button>
                            </Form.Item>
                            </div>
                        </Form>
                    </div>
                </span>
                </div>
            </div>
        </>
    );
};
export default Login;