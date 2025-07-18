import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { 
    GetAllEmployees, 
    UpdateEmplyeeByid, 
    CreateEmployee, 
    ListUser, 
    DeleteEmployee, 
    UpdateUserStatusEmployee, 
    UpdateUserStatus, 
    GetEmployee,
    GetAllJob
} from "../../services/https";
import { Employee, JobInterface } from "../../interfaces/IEmployee";
import { UsersInterface } from "../../interfaces/UsersInterface";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar"
import EmSidebar from "../../Components/Nav_bar/EmSidebar"

const { Option } = Select;

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [users, setUsers] = useState<UsersInterface[]>([]);
    const [jobs, setJobs] = useState<JobInterface[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [form] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    
    useEffect(() => {
        fetchEmployees();
        fetchUsers();
        fetchJobs();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await GetAllEmployees();
            setEmployees(response.data);
        } catch (error) {
            message.error('Error fetching employees');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await ListUser();
            const availableUsers = response.data.filter((user: UsersInterface) => 
                !employees.some(emp => emp.UserID === user.ID)
            );
            setUsers(availableUsers);
        } catch (error) {
            message.error('Error fetching users');
            window.location.href = "/EmployeeManagement";
        }
    };

    // const fetchDepartments = async () => {
    //     try {
    //         const response = await GetAllDepartments();
    //         setDepartments(response.data);
    //     } catch (error) {
    //         message.error('Error fetching departments');
    //     }
    // };

    const fetchJobs = async () => {
        try {
            const response = await GetAllJob();
            setJobs(response.data);
        } catch (error) {
            message.error('Error fetching jobs');
        }
    };

    const showCreateModal = () => {
        setIsCreateMode(true);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (employee: Employee) => {
        setIsCreateMode(false);
        setSelectedEmployee(employee);
        
        // Find the department of the current job
        const currentDepartmentId = employee.Job?.Department?.ID;
        
        form.setFieldsValue({
            UserID: employee.UserID,
            DepartmentID: currentDepartmentId, // Add department selection
            JobID: employee.JobID,
            Saraly: employee.Saraly,
            TimeOffing: employee.TimeOffing,
        });
        setIsModalVisible(true);
    };
    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedEmployee(null);
        setIsCreateMode(false);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await GetEmployee(String(id));
            await UpdateUserStatus(res.data.UserID);
            await DeleteEmployee(String(id));
            message.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            message.error('Error deleting employee');
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (isCreateMode) {
                const createData: Employee = {
                    UserID: values.UserID,
                    JobID: values.JobID,
                    Saraly: Number(values.Saraly) || 0,
                    TimeOffing: Number(values.TimeOffing) || 0,
                    
                    user: {
                        ID: values.UserID,
                        UserName: users.find(u => u.ID === values.UserID)?.UserName,
                        FirstName: users.find(u => u.ID === values.UserID)?.FirstName,
                        LastName: users.find(u => u.ID === values.UserID)?.LastName,
                        Status: users.find(u => u.ID === values.UserID)?.Status
                    },
                    //Job: jobs.find(j => j.ID === values.JobID)
                };
                await CreateEmployee(createData);
                await UpdateUserStatusEmployee(Number(values.UserID));
                message.success('Employee created successfully');
            } else {
                if (selectedEmployee) {
                    const updateData: Employee = {
                        ID: selectedEmployee.ID,
                        UserID: selectedEmployee.UserID,
                        JobID: values.JobID,
                        Saraly: Number(values.Saraly),
                        TimeOffing: Number(values.TimeOffing),
                        user: selectedEmployee.user // Include the user property
                    };
                    await UpdateEmplyeeByid(Number(selectedEmployee.ID), updateData);
                    message.success('Employee updated successfully');
                }
            }
            fetchEmployees();
            handleModalCancel();
        } catch (error) {
            message.error(isCreateMode ? 'Error creating employee' : 'Error updating employee');
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            sorter: (a: Employee, b: Employee) => (a.ID || 0) - (b.ID || 0),
        },
        {
            title: 'Username',
            key: 'username',
            render: (record: Employee) => record.User?.UserName || '-',
            sorter: (a: Employee, b: Employee) => 
                (a.user?.UserName || '').localeCompare(b.user?.UserName || ''),
        },
        {
            title: 'Name',
            key: 'name',
            render: (record: Employee) => {
                const fullName = `${record.User?.FirstName || ''} ${record.user?.LastName || ''}`.trim();
                return fullName || '-';
            },
            sorter: (a: Employee, b: Employee) => {
                const aName = `${a.user?.FirstName || ''} ${a.user?.LastName || ''}`.trim();
                const bName = `${b.user?.FirstName || ''} ${b.user?.LastName || ''}`.trim();
                return aName.localeCompare(bName);
            },
        },
        {
            title: 'Job',
            key: 'job',
            render: (record: Employee) => record.Job?.Name || '-',
            
        },
        {
            title: 'Department',
            key: 'department',
            render: (record: Employee) => record.Job?.Department?.Name || '-',
        },
        {
            title: 'Salary',
            dataIndex: 'Saraly',
            key: 'salary',
            render: (salary: number) => salary ? `฿${salary.toLocaleString()}` : '-',
            sorter: (a: Employee, b: Employee) => 
                (a.Saraly || 0) - (b.Saraly || 0),
        },
        {
            title: 'Time Off (Days)',
            dataIndex: 'TimeOffing',
            key: 'timeoff',
            render: (timeOff: number) => timeOff?.toString() || '-',
            sorter: (a: Employee, b: Employee) => 
                (a.TimeOffing || 0) - (b.TimeOffing || 0),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Employee"
                        description="Are you sure you want to delete this employee?"
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
        <div className="">
             <EmployeeBar page="AllOrderUser" />
             <EmSidebar page="Adminmanagement" />
            
            <div className="flex justify-between items-center mb-1">
                <h1 className="text-2xl font-bold" style={{ color: '#0096c3', marginLeft:'130px' }}>Employee Management </h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                    style={{marginRight:'20px',marginTop:'5px' }}
                >
                    Add Employee
                </Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={employees}
                rowKey="ID"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} employees`,
                }}
                style={{ marginLeft: '120px' }}
            />
            

            <Modal
                title={isCreateMode ? "Add New Employee" : "Edit Employee"}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {isCreateMode && (
                        <Form.Item
                            name="UserID"
                            label="User"
                            rules={[{ required: true, message: 'Please select a user' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Search for a user"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {users
                                    .filter(user => user.Status === "User")
                                    .map(user => (
                                        <Option key={user.ID} value={user.ID}>
                                            {user.FirstName} {user.LastName} ({user.UserName})
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    )}

                    

                    <Form.Item
                        name="JobID"
                        label="Job"
                        rules={[{ required: true, message: 'Please select job' }]}
                    >
                        <Select 
                            onChange={(value) => {
                                // Find the department ID for the selected job
                                const selectedJob = jobs.find(job => job.ID === value);
                                if (selectedJob) {
                                    form.setFieldsValue({ 
                                        DepartmentID: selectedJob.DepartmentID 
                                    });
                                }
                            }}
                        >
                            {jobs.map(job => (
                                <Option key={job.ID} value={job.ID}>
                                    {job.Name} ({job.Department?.Name})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Hidden field to store Department ID */}
                    <Form.Item name="DepartmentID" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="Saraly"
                        label="Salary"
                        rules={[{ required: true, message: 'Please enter salary' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="TimeOffing"
                        label="Time Off Days"
                        rules={[{ required: true, message: 'Please enter time off days' }]}
                    >
                        <Input type="number" />
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
};

export default EmployeeManagement;