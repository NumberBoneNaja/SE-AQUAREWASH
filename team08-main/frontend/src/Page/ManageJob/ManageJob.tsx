import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { 
    CreateJob,
    UpdateJob,
    SoftDeleteJob,
    GetAllJob,
    GetAllDepartments
} from "../../services/https";
import { JobInterface ,Department} from "../../interfaces/IEmployee";

import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";

const { Option } = Select;

function ManageJob() {
    const [jobs, setJobs] = useState<JobInterface[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [form] = Form.useForm();
    const [selectedJob, setSelectedJob] = useState<JobInterface | null>(null);
    
    useEffect(() => {
        fetchJobs();
        fetchDepartments();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await GetAllJob();
            setJobs(response.data);
        } catch (error) {
            message.error('Error fetching jobs');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await GetAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            message.error('Error fetching departments');
        }
    };

    const showCreateModal = () => {
        setIsCreateMode(true);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (job: JobInterface) => {
        setIsCreateMode(false);
        setSelectedJob(job);
        
        form.setFieldsValue({
            Name: job.Name,
            Explain: job.Explain,
            DepartmentID: job.DepartmentID
        });
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedJob(null);
        setIsCreateMode(false);
    };

    const handleDelete = async (id: number) => {
        try {
            await SoftDeleteJob(id);
            message.success('Job deleted successfully');
            fetchJobs();
        } catch (error) {
            message.error('Error deleting job');
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const selectedDepartment = departments.find(d => d.ID === values.DepartmentID);
    
            if (isCreateMode) {
                const createData: JobInterface = {
                    ID: 0,  // Default ID for new job
                    Name: values.Name,
                    Explain: values.Explain,
                    DepartmentID: values.DepartmentID,
                    Department: selectedDepartment,  // Make sure you provide the full Department object
                    department: {
                        ID: values.DepartmentID,
                        Name: selectedDepartment?.Name || '',
                    }
                };
    
                const response = await CreateJob(createData);
                if (response.status === 200) {
                    message.success('Job created successfully');
                    fetchJobs();
                    handleModalCancel();
                } else {
                    message.error('Failed to create job');
                }
            } else {
                if (selectedJob) {
                    const updateData: JobInterface = {
                        ID: selectedJob.ID,
                        Name: values.Name,
                        Explain: values.Explain,
                        DepartmentID: values.DepartmentID,
                        Department: selectedDepartment,  // Include full Department object
                        department: {
                            ID: values.DepartmentID,
                            Name: selectedDepartment?.Name || '',
                        }
                    };
    
                    const response = await UpdateJob(selectedJob.ID, updateData);
                    if (response.status === 200) {
                        message.success('Job updated successfully');
                        fetchJobs();
                        handleModalCancel();
                    } else {
                        message.error('Failed to update job');
                    }
                }
            }
        } catch (error) {
            message.error(isCreateMode ? 'Error creating job' : 'Error updating job');
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            sorter: (a: JobInterface, b: JobInterface) => (a.ID || 0) - (b.ID || 0),
        },
        {
            title: 'Job Name',
            dataIndex: 'Name',
            key: 'name',
            sorter: (a: JobInterface, b: JobInterface) => 
                (a.Name || '').localeCompare(b.Name || ''),
        },
        {
            title: 'Description',
            dataIndex: 'Explain',
            key: 'explain',
        },
        {
            title: 'Department',
            key: 'department',
            render: (record: JobInterface) => record.Department?.Name || record.department?.Name || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: JobInterface) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Job"
                        description="Are you sure you want to delete this job?"
                        onConfirm={() => handleDelete(record.ID!)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button 
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <EmployeeBar page="AllOrderUser" />
            <EmSidebar page="Adminmanagement" />
            
            <Card 
                style={{
                    margin: '0 auto',
                    border: 'none',
                    padding: '0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    background: '#ffffff',
                    width: '60%',
                    height: '80px',
                    maxWidth: '1200px',
                    maxHeight: '350px',
                }}
            >
                <h1 className="text-2xl font-bold" style={{ textAlign: 'center', fontSize: '30px', color: '#0096c3', fontWeight: 'bold' }}>
                    Job Management
                </h1>
            </Card>
            
            <div className="flex justify-between items-center mb-1">
                <h1 className="text-2xl font-bold" style={{ color: '#0096c3', marginLeft:'130px' }}>
                    Job List
                </h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    style={{marginRight:'20px', marginTop:'5px' }}
                >
                    Add Job
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={jobs}
                rowKey="ID"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} jobs`,
                }}
                style={{ marginLeft: '120px' }}
            />

            <Modal
                title={isCreateMode ? "Add New Job" : "Edit Job"}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="Name"
                        label="Job Name"
                        rules={[{ required: true, message: 'Please enter job name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="Explain"
                        label="Job Description"
                        rules={[{ required: true, message: 'Please enter job description' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="DepartmentID"
                        label="Department"
                        rules={[{ required: true, message: 'Please select department' }]}
                    >
                        <Select>
                            {departments.map(dept => (
                                <Option key={dept.ID} value={dept.ID}>
                                    {dept.Name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {isCreateMode ? 'Create' : 'Save'}
                            </Button>
                            <Button onClick={handleModalCancel}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManageJob;