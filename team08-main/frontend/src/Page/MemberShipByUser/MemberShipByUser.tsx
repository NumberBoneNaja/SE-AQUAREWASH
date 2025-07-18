import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Card, Typography, Space, Select, DatePicker} from 'antd';
import { SketchOutlined, SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { MembershipPayment } from '../../interfaces/MembershipPayment';
import {GetUserById,GetMembershipPaymentsByUserID} from '../../services/https';
import { message } from "antd";
import UserBar from "../../Components/Nav_bar/UserBar";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const PaymentHistoryTable: React.FC = () => {
  const [history, setHistory] = useState<MembershipPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const userIdstr = localStorage.getItem("id");


  useEffect(() => {
    fetchPaymentData(userIdstr || '');
    fetchUserData(userIdstr || '');
    
  }, []);

  const fetchPaymentData = async (userIdstr: string) => {
    try {
        console.log("user id:", userIdstr);
        
        const res = await GetMembershipPaymentsByUserID(userIdstr);

        console.log("res GetMembershipPaymentsByUserID:", res);
        
        if (res.status === 200) {
            
            message.success("พบข้อมูล Payment Member ship");
            setHistory(res.data);
            
        } else {
            message.error("ยังไม่มีการสมัครสมาชิก กรุณาสมัครก่อนใช้งาน");
        }
    } catch (error) {
        console.error("Error fetching payment data:", error);
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล Payment");
    } 
};

  
  const fetchUserData = async (userIdstr: string ) => {
    try {
        console.log("Fetching user with ID:", userIdstr);
        const res = await GetUserById(userIdstr);
        console.log("API Response:", res); // เพิ่ม log นี้
        if (res.status === 200) {
            
            message.success("พบข้อมูลUser");
            //config ต่อ
            console.log("status in face:",res.data);

        }else {
          if(res.status === 401){
            window.location.href = '/HistoryMemberShipByUser';
          }
          message.error(`เกิดข้อผิดพลาด: ${res.status} ${res.statusText}`);
            message.error("error");
        }
    } catch (error) {
      
      

        console.error("Error fetching user data:", error); // Debug
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูลUser");
        
    }finally {
      
      setLoading(false);
    }

    
};


  const paymentMethods = useMemo(() => {
    const methods = new Set(history.map(item => item.PaymentMethod));
    return Array.from(methods).filter(Boolean);
  }, [history]);

  

 

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Updated type for DatePicker onChange
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };

  const filteredHistory = history.filter(record => {
    let matchesSearch = true;
    let matchesPaymentMethod = true;
    let matchesDateRange = true;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      matchesSearch = (
        (record.User?.UserName || '').toLowerCase().includes(searchLower) ||
        (record.PackageMembership?.NamePackage || '').toLowerCase().includes(searchLower)
      );
    }

    if (paymentMethodFilter) {
      matchesPaymentMethod = record.PaymentMethod === paymentMethodFilter;
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day').toDate();
      const endDate = dateRange[1].endOf('day').toDate();
      const recordStartDate = record.DateStart ? new Date(record.DateStart) : new Date();
      matchesDateRange = recordStartDate >= startDate && recordStartDate <= endDate;
    }

    return matchesSearch && matchesPaymentMethod && matchesDateRange;
  });
  

  const columns = [
    {
      title: 'Username',
      key: 'username',
      render: (record: MembershipPayment) => record.User?.UserName || '-',
      sorter: (a: MembershipPayment, b: MembershipPayment) => 
              (a.User?.UserName || '').localeCompare(b.User?.UserName || ''),
    },
    {
      title: 'แพ็คเกจ',
      dataIndex: ['PackageMembership', 'NamePackage'],
      key: 'packageName',
    },
    {
      title: 'ราคา',
      dataIndex: ['PackageMembership', 'Price'],
      key: 'price',
      render: (price: number) => `${price?.toLocaleString('th-TH')} บาท`,
      sorter: (a: MembershipPayment, b: MembershipPayment) =>
        (a.PackageMembership?.Price || 0) - (b.PackageMembership?.Price || 0),
    },
    {
      title: 'วิธีการชำระเงิน',
      dataIndex: 'PaymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'วันที่เริ่มต้น',
      dataIndex: 'DateStart',
      key: 'dateStart',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      sorter: (a: MembershipPayment, b: MembershipPayment) =>
        new Date(a.DateStart || '').getTime() - new Date(b.DateStart || '').getTime(),
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'DateEnd',
      key: 'dateEnd',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      sorter: (a: MembershipPayment, b: MembershipPayment) =>
        new Date(a.DateStart || '').getTime() - new Date(b.DateStart || '').getTime(),
    },
    {
      title: 'สถานะ',
      dataIndex: 'Status',
      key: 'Status',
    }
  
    //   {
    //     title: 'สถานะ',
    //     dataIndex: 'Status',
    //     key: 'status',
    //     render: (status: string) => getStatusTag(status),
    //     filters: [
    //       { text: 'Active', value: 'Active' },
    //       { text: 'Expired', value: 'Expired' },
    //       { text: 'Pending', value: 'Pending' },
    //     ],
    //     onFilter: (value: string, record: MembershipPayment) => 
    //       record.Status === value,
    //   }
  ];

  return (
    <div>
       <UserBar page=""/>
      <Card>
        <Space direction="vertical" style={{ width: '100%', marginLeft: '80px' }} size="middle">
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <SketchOutlined style={{  color:'#18a8ff',fontSize: '24px' }} /> 
              <Title level={2} style={{ color:'#004b79',margin: 0,}}>แพ็คเกจที่คุณใช้บริการอยู่ตอนนี้</Title>
            </Space>
          </Space>

          <Space style={{ width: '100%' }} wrap>
            <Search
              placeholder="ค้นหา username หรือ แพ็คเกจ..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Select<string>
              placeholder="เลือกวิธีการชำระเงิน"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setPaymentMethodFilter(value)}
              options={paymentMethods.map(method => ({
                label: method,
                value: method,
              }))}
            />
            <RangePicker
              onChange={handleDateRangeChange}
              placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
              style={{ width: 250 }}
            />
          </Space>

          <Table
            columns={columns}
            dataSource={filteredHistory}
            loading={loading}
            rowKey="ID"
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              showTotal: (total) => `ทั้งหมด ${total} รายการ`,
            }}
            style={{ width: 1250 }}
          />
        </Space>
      </Card>

    </div>
  );
};

export default PaymentHistoryTable;