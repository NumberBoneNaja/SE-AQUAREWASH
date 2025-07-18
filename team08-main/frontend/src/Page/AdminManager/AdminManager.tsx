
import { useNavigate } from 'react-router-dom';
import { Card, Button, Layout, Typography} from 'antd';
import { SlSocialGithub } from "react-icons/sl";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";
import { ReconciliationOutlined,  UserOutlined,ClusterOutlined, HistoryOutlined } from '@ant-design/icons';
import EmployeeBar from '../../Components/Nav_bar/EmployeeBar';
import EmSidebar from '../../Components/Nav_bar/EmSidebar';


const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const socialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61568079718310',
  github: 'https://github.com/sut67/team08',
  email: 'mailto:jakkapanjarcunsook@gmail.com'
};

const NavigationButtons = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'จัดการหน้าที่การทำงาน',
      path: '/ManageJob',
      icon: <ReconciliationOutlined />
    },
    {
      name: 'จัดการแผนก',
      path: '/Department',
      icon: <ClusterOutlined />
    },
    {
      name: 'จัดการพนักงาน',
      path: '/EmployeeManagement',
      icon: <UserOutlined />
    },
    {
      name: 'ประวัติการสมัครสมาชิก',
      path: '/HistoryMembership',
      icon: <HistoryOutlined />
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' ,background:'#f0faff'}}>
      <EmployeeBar page="AllOrderUser" />
      <EmSidebar page="Adminmanagement" />

      {/* <Header style={{ 
        background: '#89e1ef', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Title level={4} style={{ margin: 0, display: 'flex' }}>ระบบจัดการข้อมูลของพนักงาน</Title>
      </Header> */}
       <Card 
        style={{
          
          margin: '0 auto', // ทำให้ Card อยู่กลาง
          border: 'none', // ไม่ให้มีขอบ
          padding: '0', // ไม่ให้มี Padding ของ Card
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          background: '#ffffff', 
          width: '100%', maxWidth: '1200px',maxHeight: '350px'
        }}
      >
        <Header
          style={{
            background: '#ffffff', 
            //borderBottom: '1px solid #e6f7ff',
            
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center',
            
            textAlign: 'center',
            
          }}
        >
          <Title 
      level={4} 
      style={{ 
        margin: 0, 
        width: '100%', 
        textAlign: 'center',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      ระบบจัดการข้อมูลของพนักงาน
    </Title>
        </Header>
      </Card>

      <Content style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        background:'#f0faff' // เพิ่มพื้นหลังให้สว่างขึ้น
      }}>
        <Card style={{ width: '100%', maxWidth: '600px',maxHeight: '350px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
            เลือกเมนูการจัดการ
          </Title>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            padding: '16px'
          }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                type="default"
                icon={item.icon}
                size="large"
                onClick={() => navigate(item.path)}
                style={{
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  backgroundColor: '#e6f7ff', // สีพื้นหลังปุ่ม
                  borderRadius: '8px', // มุมโค้ง
                  fontWeight: 'bold'
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </Card>
      </Content>

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
    </Layout>
  );
};

export default NavigationButtons;
