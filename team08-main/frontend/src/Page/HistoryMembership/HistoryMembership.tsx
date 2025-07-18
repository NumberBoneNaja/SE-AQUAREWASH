import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Card, Typography, Space,  Select, DatePicker } from 'antd';//Modal,
import { HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { HistoryPaymentMembership } from '../../interfaces/MembershipPayment';
import { GetMembershipPaymentsHistory } from '../../services/https';
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const PaymentHistoryTable: React.FC = () => {
  const [history, setHistory] = useState<HistoryPaymentMembership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [selectedRecord, setSelectedRecord] = useState<HistoryPaymentMembership | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await GetMembershipPaymentsHistory();
      if (response && response.data) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = useMemo(() => {
    const methods = new Set(history.map(item => item.PaymentMethod));
    return Array.from(methods).filter(Boolean);
  }, [history]);

  // const showModal = (record: HistoryPaymentMembership) => {
  //   setSelectedRecord(record);
  //   setIsModalVisible(true);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Updated type for DatePicker onChange
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    // dateStrings: [string, string]
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
      const recordStartDate = new Date(record.DateStart);
      matchesDateRange = recordStartDate >= startDate && recordStartDate <= endDate;
    }

    return matchesSearch && matchesPaymentMethod && matchesDateRange;
  });

  const columns = [
    {
      title: 'Username',
      key: 'username',
      render: (record: HistoryPaymentMembership) => record.User?.UserName || '-',
      sorter: (a: HistoryPaymentMembership, b: HistoryPaymentMembership) => 
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
      sorter: (a: HistoryPaymentMembership, b: HistoryPaymentMembership) =>
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
      sorter: (a: HistoryPaymentMembership, b: HistoryPaymentMembership) =>
        new Date(a.DateStart).getTime() - new Date(b.DateStart).getTime(),
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
      sorter: (a: HistoryPaymentMembership, b: HistoryPaymentMembership) =>
        new Date(a.DateEnd).getTime() - new Date(b.DateEnd).getTime(),
    }
  ];

  return (
    <div>
       <EmployeeBar page="AllOrderUser" />
       <EmSidebar page="Adminmanagement" />
      <Card>
        <Space direction="vertical" style={{ width: '100%', marginLeft: '80px' }} size="middle">
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <HistoryOutlined style={{ fontSize: '24px' }} />
              <Title level={2} style={{ margin: 0 }}>ประวัติการชำระเงิน</Title>
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

      {/* <Modal
        title="รายละเอียดการชำระเงิน"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Paragraph>
              <strong>แพ็คเกจ:</strong> {selectedRecord.packageMembership.NamePackage}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>รายละเอียดแพ็คเกจ:</strong> {selectedRecord.packageMembership.Description}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>ระยะเวลา:</strong> {selectedRecord.packageMembership.HowLongTime} วัน
            </Typography.Paragraph>
            {selectedRecord.packageMembership.PicPayment && (
              <>
                <Typography.Paragraph>
                  <strong>หลักฐานการชำระเงิน:</strong>
                </Typography.Paragraph>
                <img
                  src={selectedRecord.packageMembership.PicPayment}
                  alt="Payment proof"
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              </>
            )}
          </Space>
        )}
      </Modal> */}
    </div>
  );
};

export default PaymentHistoryTable;