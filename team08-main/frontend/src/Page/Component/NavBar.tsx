import React, { useEffect, useState } from 'react';
import { message , Upload} from "antd";
import type {  UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import LOGO from "./logo.png";
import './NavBar.css';
// import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

//API
import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetUserById  , UpdateUserByid} from '../../services/https';




export const NavBar: React.FC = () => {
    const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
            
        } else {
            
        }
    }, [userIdstr]);

    const fetchUserData = async (userIdstr: string ) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200) {
                setUser(res.data);
                setFormUser({
                    Email: res.data.Email,
                    Profile: res.data.Profile,
                    ProfileBackground: res.data.ProfileBackground,
                    FirstName: res.data.FirstName,
                    LastName: res.data.LastName,
                    Tel: res.data.Tel,
                    Age: res.data.Age,
                });
                //message.success("พบข้อมูลUser");
                console.log("status",res.data.Status);
            }else {
                message.error("error");
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Debug
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        }
    };
    

    //=====================Menu on Profile======================
    const [isMenuOpen, setMenu] = useState(false);
    const OpenMenu = () => {
        setMenu(!isMenuOpen);
    };

    //=====================Logout======================
    const Logout = () => {
        localStorage.clear();
        message.success("Logout successful");
        setTimeout(() => {
          location.href = "/";
        }, 1000);
    };
 
    //====================profile==============================
    const [isProfile, setProfile] = useState(false);
    const [_card ,setcard] = useState(0);
    const OpenProfile = () => {
        setProfile(true);
        if (user?.Status == 'Admin') {
            setcard(3);
        }else if (user?.Status == 'Employee'){
            setcard(2);
        }else{
            setcard(1);
        }
    };
    const CloseProfile = () => {
        setProfile(false);
        closeCard();
        setEditProfile(false);
        
    };
    const closeCard = () => {
        setcard(0);
    };
    //=========================================Edit profile===========================
    const [isEditProfile, setEditProfile] = useState(false);
    const OpenEditProfile = () => {
        setEditProfile(!isEditProfile)
    };
    const [formUser, setFormUser] = useState({
        Email: "",
        Profile: "",
        ProfileBackground: "",
        FirstName: "",
        LastName: "",
        Tel: "",
        Age: 0,
    });
    
    const [fileListProfile, setFileListProfile] = useState<UploadFile[]>([]);
    const [fileListBackground, setFileListBackground] = useState<UploadFile[]>([]);

    const getImageURLEDIT = async (file?: File): Promise<string> => {
        if (!file) return '';
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
        });
    };

    const onPreviewEDIT = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await getImageURLEDIT(file.originFileObj);
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChangeEditUser = (e : any) => {
        const { name, value } = e.target;
        setFormUser({ ...formUser, [name]: name === "Age" ? Number(value) : value });
    };

    const onChangeProfile: UploadProps['onChange'] = ({ fileList }) => {
        setFileListProfile(fileList);
        // Update Profile image URL in formUser
        if (fileList.length > 0 && fileList[0].originFileObj) {
            getImageURLEDIT(fileList[0].originFileObj).then((url) => {
                setFormUser({ ...formUser, Profile: url });
            });
        }
    };

    const onChangeBackground: UploadProps['onChange'] = ({ fileList }) => {
        setFileListBackground(fileList);
        // Update Background image URL in formUser
        if (fileList.length > 0 && fileList[0].originFileObj) {
            getImageURLEDIT(fileList[0].originFileObj).then((url) => {
                setFormUser({ ...formUser, ProfileBackground: url });
            });
        }
    };

    const handleSubmitEdit = async (e : any) => {
        e.preventDefault();
        try {
            const res = await UpdateUserByid(String(userIdstr), formUser);
            if (res.status === 200) {
                message.success(res.data.message);
            } else {
                message.error(res.data.error);
            }
        } catch (error) {
            message.error("การอัพเดทข้อมูลไม่สำเร็จ");
        }
    };
    //=========================================Add Store==============================
    const [_messageApi, contextHolder] = message.useMessage();
    const [_fileList, _setFileList] = useState<UploadFile[]>([]);
    // const getImageURL = async (file?: File): Promise<string> => {
    //     if (!file) return '';
    //     return new Promise((resolve) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //     });
    // };

   
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    // const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    // };
    

    
    
   
    
    
    return (
        <>
            {contextHolder}
            
                <>
                    <div className={`back ${isProfile ? 'fade-in' : 'fade-out'}`} onClick={CloseProfile} ></div>
                    <div className={`ProfileContaner ${isProfile ? 'fade-in' : 'fade-out'}`}>
                        <div><img src={user?.ProfileBackground} alt="ProfileBackground" /></div>
                        <div><img src={user?.Profile} alt="Profile" /></div>
                        <div>{user?.Status}</div>
                        <div>{user?.UserName}</div>
                        <div>Gmail : {user?.Email}</div>
                        <div>Name : {user?.FirstName}{user?.LastName}</div>
                        <div>Age : {user?.Age} Tel : {user?.Tel || 'No Phone Number'}</div>
                        <div onClick={CloseProfile}>back to main</div>
                        <div onClick={OpenEditProfile}>✏️</div>
                       
                    </div>
                    <div className={`EditProfileContaner ${isEditProfile ? 'fade-in' : 'fade-out'}`}>
                        <div className='EditContaner'>
                            <h1 style={{textAlign: "center"}}>Edit Your Profile</h1>
                            <form onSubmit={handleSubmitEdit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div className='uploadEdit'>
                                    <Upload
                                        fileList={fileListProfile}
                                        onChange={onChangeProfile}
                                        onPreview={onPreview}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Profile</div>
                                        </div>
                                    </Upload>

                                    <Upload
                                        fileList={fileListBackground}
                                        onChange={onChangeBackground}
                                        onPreview={onPreviewEDIT}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Background</div>
                                        </div>
                                    </Upload><div></div>
                                </div>
                                <label>Email</label>
                                <input type="email" name="Email" value={formUser.Email} onChange={handleChangeEditUser} required />

                                <label>First Name</label>
                                <input type="text" name="FirstName" value={formUser.FirstName} onChange={handleChangeEditUser} required />

                                <label>Last Name</label>
                                <input type="text" name="LastName" value={formUser.LastName} onChange={handleChangeEditUser} required />

                                <label>Tel</label>
                                <input type="tel" name="Tel" value={formUser.Tel} onChange={handleChangeEditUser} />

                                <label>Age</label>
                                <input type="text" name="Age" value={formUser.Age} onChange={handleChangeEditUser} />

                                <button type="submit" className='Editsubmit'>Save Changes</button>
                            </form>
                            <div onClick={OpenEditProfile} className='EditBtn'>❌</div>
                        </div>
                    </div>

                    
                    
                        
                    

                    

                    
                </>
            
            <nav className='positionNav'>
                <nav className='NavComponent'>
                    <span className='SubNab3'>
                        
                    <img style={{ height: '60px', marginLeft:'15px' }} className='Clock' src={LOGO} alt="Clock" onClick={() => window.location.reload}/>
                        <span className='welcome'>Hello! {user?.UserName} Welcome to ICON WASH</span>
                        
                        <img style={{ width: '45px', height: '45px', borderRadius: '50px', cursor: 'pointer' }} className='profileButton' src={user?.Profile} alt="User" onClick={OpenMenu}></img>
                        
                            <div className={`dropboxMenu ${isMenuOpen ? 'fade-in' : 'fade-out'}`}>
                                <a onClick={OpenProfile} ><p className='dropboxMenuP'>Your Profile</p></a>
                                
                                {/* {user?.Status === 'User' && 
                                    <a href="/MainPack" ><p className='dropboxMenuP'>Membership</p></a>
                                }
                                {user?.Status === 'Admin' && 
                                    <a href="/Admin" ><p className='dropboxMenuP'>Management</p></a>
                                } */}
                                <div className='lineMenu'></div>
                                <p className='dropboxMenuP' onClick={Logout}>Log Out</p>
                            </div>
                        
                    </span>
                </nav> 
                <nav className='NavComponentMenu'>
                    <div></div>
                    <div>
                                {user?.Status === 'User' && 
                                    <a href="/MainPack" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>Membership</span></a>
                                }
                                {user?.Status === 'Employee' && 
                                    <a href="/MainPack" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>Membership</span></a>
                                }
                                {user?.Status === 'Admin' && 
                                    <a href="/Admin" ><span className={`MenuHover ${location.pathname === "/Admin" ? "active" : ""}`}>Admin Management</span></a>
                                }
                                {user?.Status === 'Member' && 
                                    <a href="/Main" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>Booking</span></a>
                                }
                                {user?.Status === 'Member' && 
                                    <a href="/Main" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>Payment</span></a>
                                }
                                {user?.Status === 'Member' && 
                                    <a href="/Main" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>History</span></a>
                                }
                                {user?.Status === 'Member' && 
                                    <a href="/Main" ><span className={`MenuHover ${location.pathname === "/MainPack" ? "active" : ""}`}>Check status</span></a>
                                }
                        <a href="/Main" ><span className={`MenuHover ${location.pathname === "/Main" ? "active" : ""}`}>NEWS</span></a>
                        <a href="/Main" ><span className={`MenuHover ${location.pathname === "/Main" ? "active" : ""}`}>About Us</span></a>

                        <a href="/Order" ><span className={`MenuHover ${location.pathname === "/Order" ? "active" : ""}`}>Order</span></a>
                        <a href="/Viewtable" ><span className={`MenuHover ${location.pathname === "/Viewtable" ? "active" : ""}`}>Booking</span></a>
                        
                        {/* {(user?.Status === 'Admin' || user?.Status === 'Employee') && 
                            <a href="/Hall" ><span className={`MenuHover ${location.pathname === "/Hall" ? "active" : ""}`}>BOOK A HALL</span></a>
                        }
                        {(user?.Status === 'Repairman' || user?.Status === 'Admin'|| user?.Status === 'Employee') &&
                            <a href="#" ><span className='MenuHover'>SERVICEREQUEST</span></a>
                        }
                        {(user?.Status === 'Cleaning' || user?.Status === 'Admin'|| user?.Status === 'Employee') &&
                            <a href="#" ><span className='MenuHover'>CLEANING</span></a>
                        } */}
                    </div>
                    <div></div>
                </nav>
            
            </nav>
        </>
    );
};



export const IntroWeb: React.FC = () => {
    const [_user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
        } else {
            
        }
    }, [userIdstr]);

    const fetchUserData = async (userIdstr: string ) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200) {
                setUser(res.data);
                //message.success("พบข้อมูลUser");
            } else {
                
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        }
    };
  
    const [intro, setIntro] = useState(true);

    
    useEffect(() => {
        setTimeout(() => {
            setIntro(false)
        }, 10000);
    }, []);

    const [showFinalText, _setShowFinalText] = useState(false);
    // const handleAnimationEnd = () => {
    //     setShowFinalText(true);
    // };


    return (
        <>
          {intro && (
            <div className="introMainWeb">
              {!showFinalText ? (
                <div className="introAnimation">
                  {/* แสดงการโหลด (Spin) */}
                  <Spin size="large" />
                  
                </div>
              ) : (
                <div className="introContent">
                  <h1 className="finalText">Welcome to Our Amazing World!</h1>
                </div>
              )}
            </div>
          )}
        </>
      );
    
    

};
