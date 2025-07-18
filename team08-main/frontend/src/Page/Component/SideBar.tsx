import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import './SideBar.css';
const { Sider, Content } = Layout;//ลบ header ออก

const SidebarExample: React.FC = () => {
  return (
    <Layout>
        {/* Sidebar */}
        <Sider width={200} theme="dark">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<LaptopOutlined />}>
              Projects
            </Menu.Item>
            <Menu.Item key="3" icon={<NotificationOutlined />}>
              Notifications
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            Main Content Goes Here
          </Content>
        </Layout>
    </Layout>
  );
};

export default SidebarExample;
