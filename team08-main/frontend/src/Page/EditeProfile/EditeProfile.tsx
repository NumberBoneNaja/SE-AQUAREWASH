import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  Upload, 
  message, 
  Button, 
  Card, 
  Row, 
  Col 
} from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  UserSwitchOutlined 
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { GetUserById, UpdateUserByid } from '../../services/https';
import { UsersInterface } from '../../interfaces/UsersInterface';
import UserBar from "../../Components/Nav_bar/UserBar";
import { Footer } from 'antd/es/layout/layout';
import { SlSocialGithub } from "react-icons/sl";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";
const socialLinks = {
    facebook: 'https://www.facebook.com/profile.php?id=61568079718310',
    github: 'https://github.com/sut67/team08',
    email: 'mailto:jakkapanjarcunsook@gmail.com'
  };

const EditProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [fileListProfile, setFileListProfile] = useState<UploadFile[]>([]);
  const [fileListBackground, setFileListBackground] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("id");
      if (userId) {
        try {
          const response = await GetUserById(userId);
          if (response.status === 200) {
            const userData = response.data;
            form.setFieldsValue({
              UserName: userData.UserName,
              Email: userData.Email,
              Tel: userData.Tel,
              FirstName: userData.FirstName,
              LastName: userData.LastName,
              Age: userData.Age,
            });

            // Set profile and background images if they exist
            if (userData.Profile) {
              setFileListProfile([{
                uid: '-1',
                name: 'profile.png',
                status: 'done',
                url: userData.Profile,
              }]);
            }

            if (userData.ProfileBackground) {
              setFileListBackground([{
                uid: '-2',
                name: 'background.png',
                status: 'done',
                url: userData.ProfileBackground,
              }]);
            }
          }
        } catch (error) {
          message.error("Failed to fetch user data");
        }
      }
    };

    fetchUserData();
  }, [form]);

  const getImageBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (values: any) => {
    const userId = localStorage.getItem("id");
    if (userId) {
      try {
        const formData: UsersInterface = {
          ...values,
          Profile: fileListProfile[0]?.url || '',
          ProfileBackground: fileListBackground[0]?.url || '',
        };

        const res = await UpdateUserByid(userId, formData);
        if (res.status === 200) {
          message.success("Profile updated successfully");
        } else {
          message.error("Failed to update profile");
        }
      } catch (error) {
        message.error("An error occurred while updating profile");
      }
    }
  };

  const uploadProfileButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleProfileChange: UploadProps['onChange'] = async ({ fileList }) => {
    if (fileList[0]?.originFileObj) {
      const base64Image = await getImageBase64(fileList[0].originFileObj);
      fileList[0].url = base64Image;
    }
    setFileListProfile(fileList);
  };

  const handleBackgroundChange: UploadProps['onChange'] = async ({ fileList }) => {
    if (fileList[0]?.originFileObj) {
      const base64Image = await getImageBase64(fileList[0].originFileObj);
      fileList[0].url = base64Image;
    }
    setFileListBackground(fileList);
  };

  return (
    <div style={{backgroundColor:'#f0f2f5'}}> 
      <UserBar page="EditProfile"/>
      <br/>
      <div 
        style={{
            textAlign: 'center',
            fontSize: '30px',
            border: '1px solid #fff',
            background: '#fff',
            marginBottom: '20px',
            width: '800px',
            height: '80px',
            borderRadius: '15px',  // ลบมุมขอบ
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ใส่เงา
            display: 'flex',
            justifyContent: 'center',  // จัดตัวอักษรตรงกลาง
            alignItems: 'center',      // จัดตัวอักษรตรงกลางแนวตั้ง
            transition: 'all 0.3s ease',  // ทำให้มีการเปลี่ยนแปลงเมื่อ hover
            margin: '0 auto',
            
            
            
  
            
        }}
        onMouseOver={(e) => {
            (e.target as HTMLElement).style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)'; // เพิ่มเงาเมื่อ hover
            (e.target as HTMLElement).style.transform = 'scale(1.05)';  // ขยายเมื่อ hover
        }}
        onMouseOut={(e) => {
            (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';  // เงาเดิมเมื่อออกจาก hover
            (e.target as HTMLElement).style.transform = 'scale(1)';  // คืนขนาดเดิมเมื่อออกจาก hover
        }}
        >
        Edit Your Profile
        </div>
    <Card title="Edit Profile" style={{ maxWidth: 800, margin: '0 auto',fontSize:'28px' ,marginTop:'20px'}}>
        
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="UserName"
              label="Username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserSwitchOutlined />} placeholder="Username" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="FirstName"
              label="First Name"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="LastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Tel"
              label="Telephone"
              rules={[{ required: true, message: 'Please input your telephone number!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Telephone" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Age"
              label="Age"
              rules={[{ required: true, message: 'Please input your age!' }]}
            >
              <Input type="number" min={0} placeholder="Age" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Profile Picture">
              <Upload
                listType="picture-card"
                fileList={fileListProfile}
                onChange={handleProfileChange}
                maxCount={1}
              >
                {fileListProfile.length === 0 && uploadProfileButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Profile Background">
              <Upload
                listType="picture-card"
                fileList={fileListBackground}
                onChange={handleBackgroundChange}
                maxCount={1}
              >
                {fileListBackground.length === 0 && uploadProfileButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
   <Footer style={{
           textAlign: 'center', 
           background: '#24292E', 
           borderTop: '1px solid #f0f0f0',
           padding: '30px',
           height:'200px',
         }}>
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px',marginLeft:'100px',color: '#f0f0f0'  }}>
             <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
               <TiSocialFacebookCircular style={{ fontSize: '26px', margin: '0 40px', color: '#009fff' }} />
               Facebook
             </a>
             <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
               <SlSocialGithub style={{ fontSize: '26px', margin: '0 40px', color: '#c1c5c7' }} />
               Github
             </a>
             <a href={socialLinks.email} target="_blank" rel="noopener noreferrer">
               <MdOutlineEmail style={{ fontSize: '26px', margin: '0 40px', color: '#960000' }} />
               Email
             </a>
           </div>
           <div style={{ fontSize: '16px', margin: '0 40px', color: '#c1c5c7' }}>
             ©{new Date().getFullYear() } AQUA WASH Co
           </div>
         </Footer>
    </div>
  );
};

export default EditProfile;