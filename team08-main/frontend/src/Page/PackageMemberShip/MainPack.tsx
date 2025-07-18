import React, { useEffect, useState } from "react";
import "./MainPack.css";
import { ListPackageMemberships, CreateMemberShipPayment,CreateMembershipPaymentHistory } from "../../services/https";
import { PackageMembershipInterface } from "../../interfaces/MembershipPayment";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { GetUserById,GetMembershipPaymentsByUserID,SoftDeleteMembershipPayment } from "../../services/https";
import { Button, Form, Input, Select, message } from "antd";
import { SlSocialGithub } from "react-icons/sl";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import UserBar from "../../Components/Nav_bar/UserBar";



const { Option } = Select;

const MainPack: React.FC = () => {
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [packages, setPackages] = useState<PackageMembershipInterface[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageMembershipInterface | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Changed to use fileList
  const navigate = useNavigate();
  
  
      

  const userIdstr = localStorage.getItem("id");

  useEffect(() => {
    if (userIdstr) fetchUserData(userIdstr);
    fetchAllPackages();
    const body = document.querySelector(".main-pack");
    body?.classList.add("fade-in");
  }, [userIdstr]);

  const fetchUserData = async (userIdstr: string) => {
    try {
      const res = await GetUserById(userIdstr);
      if (res.status === 200) {
        setUser(res.data);
        message.success("พบข้อมูล User");
        
        try{
          const res2 = await GetMembershipPaymentsByUserID(userIdstr);
          if(res2.status === 200){
            message.success("ดึงข้อมูล Payment สำเร็จ");
            if (res2.data && res2.data.length > 0) {
              const payment = res2.data[0]; // Assuming we're working with the most recent payment
              console.log("check id:",payment.UserID);
              message.warning("พบบัญชีม้า");
              message.loading("กำลังลบบัญชีม้า");
              const deletedPayment = await SoftDeleteMembershipPayment(payment.ID);
              if (deletedPayment && deletedPayment.status === 200) {
                message.success("ลบบัญชีม้าสำเร็จ");
                window.location.href = '/MainPack';
                
              } else {
                message.error("เกิดข้อผิดพลาดในการลบบัญชีม้า");
              }
            }else{
              message.success("ไม่พบบัญชีม้า");
            }
            
            
            
          }else{
            message.error("ไม่พบแพคเกจที่มีการใช้งาน 100 เปอร์เซ็น");
          }

        }catch (error){
          console.error("Error fetching user data:", error);
          message.error("เกิดข้อผิดพลาดในการดึงข้อมูล User");

        }
      } else {
        message.error("Error fetching user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล User");
    }
  };

  const fetchAllPackages = async () => {
    try {
      const res = await ListPackageMemberships();
      if (res.status === 200) {
        setPackages(res.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      setPackages([]);
      console.error("Error fetching all packages:", error);
    }
  };

  const handleCardClick = (pkg: PackageMembershipInterface) => {
    setSelectedPackage(pkg);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleFormSubmit = async () => {
    
    if (!selectedPackage) {
      message.error("กรุณาเลือกแพ็กเกจ");
      return;
    }

    if(form.getFieldValue("paymentMethod") === undefined){
      message.error("กรุณาเลือกวิธีการชำระเงิน");
      return;
    }
    

    try {
      const values = await form.validateFields();
      if(values.paymentMethod === "Cash"){
      
        values.Status = "Success";
        

      }else{
        values.Status = "Processing";
      }
      const hisdata = {
        UserID: user?.ID,
        PackageMembershipID: selectedPackage.ID,
        PaymentMethod: values.paymentMethod,
        DateStart: new Date(),
        DateEnd: new Date(new Date().setDate(new Date().getDate() + selectedPackage.HowLongTime)),
        Status: values.Status,
        packageMembership: selectedPackage, // Added packageMembership property
      }
      const paymentData = {
        UserID: user?.ID,
        PackageMembershipID: selectedPackage.ID,
        PaymentMethod: values.paymentMethod,
        DateStart: new Date(),
        DateEnd: new Date(new Date().setDate(new Date().getDate() + selectedPackage.HowLongTime)),
        PicPayment: fileList[0]?.thumbUrl || "", // Use thumbUrl for preview or the base64 if needed
        Status: values.Status,
      };
      const createdhispayment = await CreateMembershipPaymentHistory(hisdata)
      if (createdhispayment && createdhispayment.status === 201) {
        message.success("สร้าง History สำเร็จ!");
        closePopup();

      } else {
        message.error("เกิดข้อผิดพลาดในการบันทึก History");
      }

      

      const createdPayment = await CreateMemberShipPayment(paymentData)
      if (createdPayment && createdPayment.status === 201) {
        message.success("สร้าง Payment สำเร็จ!");
        
        closePopup();
        gotoPayment(createdPayment.data.ID)
        // setPayID(createdPayment.data.ID.toString());
        // console.log("Payment ID:", createdPayment.data.ID);
      } else {
        message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล Payment");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  
  };

 

  
  function gotoPayment(payID: string) {
    setTimeout(() => {
      navigate(`/PaymentMember/${payID}`);
    }, 1000);
  }


  return (
    <div >
      <UserBar page="MainPack" />
    <div className="main-pack">

      
      <div className="header-section">
        <br />
        <h1 className="header-title">กรุณาเลือกแพ็คเกจที่ต้องการสมัครสมาชิก</h1>
        <p className="header-subtitle">ไม่ต้องคิดแล้ว รีบสมัครแล้วมาเป็นครอบครัวเดียวกัน</p>
      </div>

      <div className="package-container">
        {packages.map((pkg) => (
          <div
            className={`package-card ${selectedPackage?.ID === pkg.ID ? "selected" : ""}`}
            key={pkg.ID}
            onClick={() => handleCardClick(pkg)}
          >
            <div className="card-info">
              <p className="package-name">{pkg.NamePackage}</p>
              
              <p className="package-price">{pkg.Price} Bath</p>
              <p className="package-duration">{pkg.HowLongTime} Days</p>
              <p className="package-description">{pkg.Description}</p>
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
      <div>
        <footer className="footer">
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61568079718310" target="_blank" className="social-icon facebook">
              <i className="fab fa-facebook"><TiSocialFacebookCircular /></i> Facebook
            </a>
            <a href="https://github.com/sut67/team08" target="_blank" className="social-icon github">
              <i className="fab fa-github"><SlSocialGithub /></i> GitHub
            </a>
            <a href="mailto:jakkapanjarcunsook@gmail.com" className="social-icon email">
              <i className="fas fa-envelope"><MdOutlineEmail /></i> Email
            </a>
          </div>
          <p>&copy; 2021 AQUA WASH Co</p>    
        </footer>
      </div>





      {isPopupVisible && selectedPackage && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closePopup}>
              &times;
            </button>
            <h2>ตรวจสอบแพคเกจที่ท่านเลือก</h2>
            <h3>แล้วกดเลือกวิธีการชำระเงิน</h3>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item label="Package Name">
                <Input value={selectedPackage.NamePackage} disabled />
              </Form.Item>

              <Form.Item label="Payment Method" name="paymentMethod">
                <Select placeholder="Select Payment Method">
                  <Option value="Cash">Cash</Option>
                  <Option value="PromptPay">PromptPay</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit"
                // onClick={gotoPayment}
                >
                  Confirm Payment
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default MainPack;
