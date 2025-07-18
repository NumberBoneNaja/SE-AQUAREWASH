import React, { useEffect, useState } from 'react';
//import { NavBar } from '../Component/NavBar';
import Product from "../../assets/icon/ForPage/MainIcon/Product.png";
import Product1 from "../../assets/icon/ForPage/MainIcon/Product/PD1.png";
import Product2 from "../../assets/icon/ForPage/MainIcon/Product/PD2.png";
import Product3 from "../../assets/icon/ForPage/MainIcon/Product/PD3.png";
import Product4 from "../../assets/icon/ForPage/MainIcon/Product/PD4.png";
import { SlSocialGithub } from "react-icons/sl";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";
import { message } from "antd";
import { Modal, Table, } from 'antd';

import { } from '@ant-design/icons';
import {  Button, Typography } from 'antd';
import Member from "./members-only.png";
import washing from "./washing-machine.png";
import Booking from "./booking.png";
import reward from "./reward.png";
import setting from "./settings.png";
import { useNavigate } from "react-router-dom";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetUserById  ,GetMembershipPaymentsByUserID,GetMembershipPaymentByUserIDHistory,UpdateUserStatus,SoftDeleteMembershipPayment} from '../../services/https';
import {HistoryPaymentMembership} from '../../interfaces/MembershipPayment';
const { Title } = Typography;

//New
import Newtest from "../../assets/icon/ForPage/MainIcon/TestNew.png"
//import axios from 'axios';
import './Main.css';
import { HistoryOutlined} from '@ant-design/icons';


const Main: React.FC = () => {
    const images = [Product1, Product2, Product3, Product4, Product];
    const [_currentImageIndex, setCurrentImageIndex] = useState(0);
    const [_fade, setFade] = useState(true); 
    const navigate = useNavigate();
    // const [payment, setPayment] = useState<MembershipPayment | null>(null); // State to store user data
    const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    const [payments, setPayments] = useState<any[]>([]); // เก็บข้อมูลการชำระเงิน
    const [payments2, setPayments2] = useState<any[]>([]); // เก็บข้อมูลการชำระเงิน
    const [loading, setLoading] = useState<boolean>(true); // ใช้สำหรับสถานะโหลดข้อมูล

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [_modalContent, setModalContent] = useState<any>(null);


    

  const menuItems = [
    {
      name: 'ประวัติการสมัครสมาชิก',
      path: '/HistoryMembership',
      icon: <HistoryOutlined />
    },
  ];

  const handleButtonClick = async (item:any) => {
        setIsModalVisible(true);
        setModalContent(item);
        
        // ดึงข้อมูลการชำระเงินเมื่อคลิก
        if (userIdstr) {
          setLoading(true);
          try {
            const res = await GetMembershipPaymentsByUserID(userIdstr);
            if (res.status === 200) {
              setPayments(res.data);
            } else {
              console.log('ไม่พบข้อมูลการชำระเงิน');
            }
          } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน:', error);
          } finally {
            setLoading(false);
          }
        }
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
    
      const columns = [
        {
          title: 'Package Name',
          key: 'packageMembership',
          render: (record: HistoryPaymentMembership) => record.PackageMembership?.NamePackage || '-',
        },
        {
          title: 'Date Start',
          dataIndex: 'DateStart',
          key: 'DateStart',
          render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
          title: 'Date End',
          dataIndex: 'DateEnd',
          key: 'DateEnd',
          render: (date: string) => new Date(date).toLocaleDateString(),
        },
      ];

    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
            fetchPaymentData(userIdstr);
        } else {
            
        }
    }, [userIdstr]);

    const [_isButtonVisible, setIsButtonVisible] = useState(false);
    const [_isButtonAnimating, setIsButtonAnimating] = useState(false);

    useEffect(() => {
        // เมื่อหน้าเว็บโหลดให้ทำการ slide ปุ่มออกมาและค้างไว้ 3 วินาที
        setIsButtonVisible(true);
        setIsButtonAnimating(true);
        setTimeout(() => {
          setIsButtonVisible(false);
          setIsButtonAnimating(false);
        }, 3000); // ซ่อนปุ่มหลังจาก 3 วินาที
    
        // เพิ่ม event listener เพื่อตรวจจับการเลื่อนเมาส์
        const handleMouseMove = (event: MouseEvent) => {
          if (event.clientX > window.innerWidth - 100) {
            setIsButtonVisible(true);
          } else {
            setIsButtonVisible(false);
          }
        };
    
        document.addEventListener('mousemove', handleMouseMove);
    
        // Cleanup event listener เมื่อ component ถูก unmount
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

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
                message.success("พบข้อมูลUser");
                //config ต่อ
                console.log("status in face:",res.data);
            }else {
                message.error("error");
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Debug
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        }
    };

    const fetchPaymentData = async (userIdstr: string) => {
        try {
            console.log("user id:", userIdstr);
            
            const res = await GetMembershipPaymentsByUserID(userIdstr);
            const userIdInt = parseInt(userIdstr, 10); // แปลงจาก string เป็น integer
            const res2 = await GetMembershipPaymentByUserIDHistory(userIdInt);
            console.log("res GetMembershipPaymentsByUserID:", res);
            if (res2.status === 200) {
                setPayments2(res2.data);
                message.success("พบข้อมูล Payment Member ship history");
                
            } else {
                message.error("ยังไม่มีการสมัครสมาชิก กรุณาสมัครก่อนใช้งาน");
            }
            
            if (res.status === 200) {
                setPayments(res.data);
                message.success("พบข้อมูล Payment Member ship");
                
                // Check if there is payment data and it has expired
                if (res.data && res.data.length > 0) {
                    const payment = res.data[0]; // Assuming we're working with the most recent payment
                    
                    if (new Date() > new Date(payment.DateEnd)) {
                        console.log("หมดอายุ.");
                        message.error("หมดอายุการใช้งาน กรุณาต่ออายุ");
                        
                        // Update user status
                        try {
                            const updateStatusRes = await UpdateUserStatus(userIdstr);
                            if (updateStatusRes.status === 200) {
                                console.log("อัพเดทสถานะเรียบร้อย");
                                message.success("อัพเดทสถานะเรียบร้อย");
                            } else {
                                console.log("อัพเดทสถานะไม่สำเร็จ");
                                message.error("อัพเดทสถานะไม่สำเร็จ");
                            }
                        } catch (error) {
                            console.error("Error updating user status:", error);
                            message.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
                        }
                        
                        // Soft delete the membership payment using the payment ID
                        try {
                            const softDeleteRes = await SoftDeleteMembershipPayment(payment.ID.toString());
                            if (softDeleteRes.status === 200) {
                                console.log("ลบเรียบร้อย");
                                message.success("ลบเรียบร้อย");
                            } else {
                                console.log("ลบไม่สำเร็จ");
                                message.error("ลบไม่สำเร็จ");
                            }
                        } catch (error) {
                            console.error("Error soft deleting payment:", error);
                            message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
                        }
                    } else {
                        console.log("ใช้ได้ต่อ.");
                        message.success("ยังสามารถใช้งานได้ต่อ");
                    }
                }
            } else {
                message.error("ยังไม่มีการสมัครสมาชิก กรุณาสมัครก่อนใช้งาน");
            }
        } catch (error) {
            console.error("Error fetching payment data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูล Payment");
        } finally {
            setLoading(false);
        }
    };
    const [_form, setFormUser] = useState({
        Email: "",
        Profile: "",
        ProfileBackground: "",
        FirstName: "",
        LastName: "",
        Tel: "",
        Age: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true); 
            }, 500); 
        }, 8000); 

        return () => clearInterval(interval);
    }, []);

    const testdata = [
        {
            id: 1,
            Name: "Product advertising",
            info: "loremLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
            id: 2,
            Name: "Product advertising",
            info: "loremLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
            id: 3,
            Name: "Product advertising",
            info: "loremLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
            id: 4,
            Name: "Product advertising",
            info: "loremLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
    ]

   
      
    return(
        <>
            <div>
            
                <br />
            </div>
            <div>
                <br />
            </div>
            <div>
                <br />
            </div>
            <div>
                <br />
            </div>
            <div className="membership-payments-container">
                
                    <div className="payments-cards">
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <div key={index} className="payment-card">
                                    <p><strong>Your Package :</strong> {payment.PackageMembership?.NamePackage} </p>
                                    <p><strong>Date of start :</strong> {new Date(payment.DateStart).toLocaleDateString()}</p>
                                    <p><strong>Date of End :</strong> {new Date(payment.DateEnd).toLocaleDateString()}</p>
                                    
                                    
                                </div>
                            ))
                        ) : (
                            <div>ไม่มีข้อมูลการชำระเงิน</div>
                        )}
                    </div>

                    <div className="history-button ">
                        
                              {menuItems.map((item) => (
                                <Button
                                  key={item.path}
                                  type="default"
                                  icon={item.icon}
                                  size="large"
                                  onClick={() => handleButtonClick(item)} // แสดง Modal เมื่อคลิก
                                  style={{
                                    height: '64px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                  }}
                                >
                                  {item.name}
                                </Button>
                              ))}
                              
                              {/* Modal ที่จะแสดงข้อมูลการชำระเงิน */}
                              <Modal
                                title="ประวัติการสมัครสมาชิก"
                                visible={isModalVisible}
                                onCancel={handleCancel}
                                footer={null}
                                width={600}
                              >
                                <Title level={4} style={{ textDecoration: 'underline' }}>
                                  ประวัติการชำระเงิน
                                </Title>
                                
                                {/* แสดงข้อมูลการชำระเงินในรูปแบบตาราง */}
                                <Table
                                  columns={columns}
                                  dataSource={payments2}
                                  rowKey="ID"
                                  loading={loading}
                                  pagination={false} // ไม่ให้แสดงการแบ่งหน้า
                                />
                              </Modal>
                            </div>
                    
                
                </div>
            <div className='history-payment-container'>
                
            

            </div>
            <div className='NEWS'>
                <span></span>
                <p>Services</p>
                <span></span>
            </div>
            <div>

            </div>
            <div className='Product'>
                { user?.Status == 'User' && (
                    <div className='ProductImage1'>
                        <div className='ProductImage'>
                            <img src={Member} onClick={() => navigate("/MainPack")}/>
                        </div>
                        <br />
                        <div className='ProductText'>
                            <p>Member Services</p>
                        </div>
                    </div>
                )}
                <div className='ProductImage2'>
                    <div className='ProductImage'>
                        <img src={Booking} onClick={() => navigate("/Viewtable")}/>
                    </div>
                    <br />
                    <div className='ProductText'>
                        <p>Booking Services</p>
                    </div>
                    
                </div>
                <div className='ProductImage3'>
                <div className='ProductImage'>
                        <img src={washing} onClick={() => navigate("/Order")}/>
                    </div>
                    <br />
                    <div className='ProductText'>
                        <p>Washing Services</p>
                    </div>
                    
                </div>

                <div className='ProductImage4'>
                    <div className='ProductImage'>
                        <img src={reward} onClick={() => navigate("/Reserve")}/>
                    </div>
                    <br />
                    <div className='ProductText'>
                        <p>Reward Services</p>
                    </div>
                </div>
                { user?.Status == 'Employee' && (
                    <div className='ProductImage4'>
                    <div className='ProductImage'>
                        <img src={setting} onClick={() => navigate("/AdminManager")}/>
                    </div>
                    <br />
                    <div className='ProductText'>
                        <p>Manager</p>
                    </div>
                </div>
                )}

                
                
                
            </div>
            
            <div className='NEWS'>
                <span></span>
                <p>NEWS</p>
                <span></span>
            </div>
            <div className='NewInfo'>
                {testdata.length > 0 ? (
                    testdata.map((data) => (
                        <div className='SubInfo' key={data.id}>
                            <img src={Newtest} alt="Newtest" />
                            <span>
                                <h4>{data.Name}</h4>
                                <p>{data.id} {data.info} </p>
                            </span>
                        </div>
                    ))
                ) : (
                    <div>No data!</div>
                )}
            </div>


            <div>
                    <footer className="footer">
                      <div className="social-links">
                        <a href="https://www.facebook.com/jakkapan.jaroensook/" target="_blank" className="social-icon facebook">
                          <i className="fab fa-facebook"><TiSocialFacebookCircular /></i> Facebook
                        </a>
                        <a href="https://github.com/jakkapan1151" target="_blank" className="social-icon github">
                          <i className="fab fa-github"><SlSocialGithub /></i> GitHub
                        </a>
                        <a href="mailto:jakkapanjarcunsook@gmail.com" className="social-icon email">
                          <i className="fas fa-envelope"><MdOutlineEmail /></i> Email
                        </a>
                      </div>
                      <p>&copy; 2021 AQUA WASH Co</p>    
                    </footer>
            </div>

        </>
    );
};
export default Main;