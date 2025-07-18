import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import { Department } from "../../interfaces/IEmployee";
import { 
  GetAllDepartments,
  UpdateDepartment,
  CreateDepartment,
  SoftDeleteDepartment,
  // RestoreDepartment,
} from "../../services/https";
import './Department.css';
import EmployeeBar from '../../Components/Nav_bar/EmployeeBar';
import EmSidebar from '../../Components/Nav_bar/EmSidebar';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllDepartments();
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการดึงข้อมูลแผนก');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (values: Department) => {
    setIsLoading(true);
    try {
      if (selectedDepartment?.ID) {
        await UpdateDepartment(selectedDepartment.ID, values);
        message.success('อัพเดทข้อมูลแผนกสำเร็จ');
      } else {
        await CreateDepartment(values);
        message.success('สร้างแผนกใหม่สำเร็จ');
      }
      handleModalCancel();
      fetchDepartments();
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
    setIsLoading(false);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    form.setFieldsValue({
      Name: department.Name,
      Explain: department.Explain
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await SoftDeleteDepartment(id);
      message.success('ลบแผนกสำเร็จ');
      fetchDepartments();
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการลบแผนก');
    }
    setIsLoading(false);
  };

  // const handleRestore = async (id: number) => {
  //   setIsLoading(true);
  //   try {
  //     await RestoreDepartment(id);
  //     message.success('กู้คืนแผนกสำเร็จ');
  //     fetchDepartments();
  //   } catch (error) {
  //     message.error('เกิดข้อผิดพลาดในการกู้คืนแผนก');
  //   }
  //   setIsLoading(false);
  // };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedDepartment(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'ลำดับ',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'ชื่อแผนก',
      dataIndex: 'Name',
      key: 'name',
      sorter: (a: Department, b: Department) => 
        (a.Name || '').localeCompare(b.Name || ''),
    },
    {
      title: 'คำอธิบาย',
      dataIndex: 'Explain',
      key: 'explain',
    },
    {
      title: 'จัดการ',
      key: 'actions',
      render: (_: any, record: Department) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="ลบแผนก"
            description="คุณต้องการลบแผนกนี้ใช่หรือไม่?"
            onConfirm={() => record.ID && handleDelete(record.ID)}
            okText="ใช่"
            cancelText="ไม่"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
       <EmployeeBar page="AllOrderUser" />
       <EmSidebar page="Adminmanagement" />
      <div className="flex justify-between items-center mb-1" style={{marginLeft:'20px' }}>
        <h1 className="department-title" style={{ color: '#0096c3', marginLeft:'105px' }}>จัดการแผนก</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          className="action-button"
          style={{marginRight:'20px',marginTop:'5px' }}
          
        >
          เพิ่มแผนก
        </Button>
      </div>

      <div className="department-card" >
        <Table
          columns={columns}
          dataSource={departments}
          rowKey="ID"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `ทั้งหมด ${total} รายการ`,
          }}
          style={{ marginLeft: '120px' }}
        />
      </div>

      <Modal
        title={selectedDepartment ? "แก้ไขแผนก" : "เพิ่มแผนก"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="department-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="department-form"
        >
          <Form.Item
            name="Name"
            label="ชื่อแผนก"
            rules={[{ required: true, message: 'กรุณากรอกชื่อแผนก' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Explain"
            label="คำอธิบาย"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleModalCancel}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {selectedDepartment ? 'บันทึก' : 'สร้าง'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;