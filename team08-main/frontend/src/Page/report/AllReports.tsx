import React, { useState, useEffect } from "react";
import {
  GetAllReports,
  GetReportDetailByReportID,
  GetReportResultByReportID,
  UpdateReportResultByReportID,
  GetUserById,
} from "../../services/https";
import { Table, Spin, message, Image, Button, Modal, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ReportResultInterface } from "../../interfaces/reportResultInterface";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";

const AllReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUserId = localStorage.getItem("id");
        if (!storedUserId) {
          message.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
          return;
        }

        // ดึงข้อมูลผู้ใช้
        const userData = await GetUserById(storedUserId);
        if (!userData || !userData.data) {
          throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
        setUser(userData.data);

        // ดึงข้อมูลรายงานทั้งหมด
        const reportsDataResponse = await GetAllReports();
        const reportsData = reportsDataResponse?.data || [];

        if (!Array.isArray(reportsData)) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }

        // เพิ่มข้อมูลรายละเอียดและสถานะเข้าไปในแต่ละรายงาน
        const enhancedReports = await Promise.all(
          reportsData.map(async (report: any) => {
            const details = await GetReportDetailByReportID(report.ID);
            const resultResponse = await GetReportResultByReportID(report.ID);
            const result = Array.isArray(resultResponse?.data)
              ? resultResponse.data[0]
              : { status: "unknown" };

            return {
              ...report,
              details: details?.data || [],
              result,
            };
          })
        );

        setReports(enhancedReports);
      } catch (error: any) {
        console.error("Error:", error.message);
        message.error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showModal = (report: any) => {
    setSelectedReport(report);
    setIsModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedReport) return;
    try {
      const accepterId = localStorage.getItem("id");
      if (!accepterId) {
        throw new Error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      }

      const updateData: ReportResultInterface = {
        id: selectedReport.result.id,
        status: "approved",
        accepter_id: Number(accepterId),
      };

      await UpdateReportResultByReportID(selectedReport.result.report_id, updateData);
      message.success("อนุมัติรายงานสำเร็จ");

      // อัปเดตรายการรายงาน
      setReports((prev) =>
        prev.map((r) =>
          r.ID === selectedReport.ID
            ? { ...r, result: { ...r.result, status: "approved" } }
            : r
        )
      );
    } catch (error: any) {
      console.error("Error:", error.message);
      message.error(error.message || "เกิดข้อผิดพลาดในการอนุมัติรายงาน");
    } finally {
      setIsModalVisible(false);
      setSelectedReport(null);
    }
  };

  const handleFilterChange = (value: string | null) => {
    setFilterStatus(value);
  };

  const filteredReports = filterStatus
    ? reports.filter((report) => report.result?.status === filterStatus)
    : reports;

  if (loading) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  const columns = [
    {
      title: "รายละเอียดรายงาน",
      key: "details",
      render: (_: any, report: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#fbfbfb", padding: "10px", position: "relative" }}>
            <p>
              <strong>วันที่รายงาน:</strong> {new Date(report.CreatedAt).toLocaleString()}
            </p>
            <p>
              <strong>เครื่องซักผ้า:</strong> {report.machine?.machine_name || "ไม่พบข้อมูล"}
            </p>
            <p>
              <strong>รายละเอียดปัญหา:</strong>
            </p>
            {Array.isArray(report.details) && report.details.length > 0 ? (
              report.details.map((detail: any, index: number) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <p>{detail.description}</p>
                </div>
              ))
            ) : (
              <p>ไม่มีข้อมูล</p>
            )}
            <p>
              <strong>สถานะรายงาน:</strong>{" "}
              <span
                style={{
                  color:
                    report.result?.status === "pending"
                      ? "red"
                      : report.result?.status === "approved"
                      ? "green"
                      : "black",
                }}
              >
                {report.result?.status === "pending"
                  ? "กำลังรอดำเนินการ"
                  : report.result?.status === "approved"
                  ? "อนุมัติแล้ว"
                  : "ไม่ทราบสถานะ"}
              </span>
            </p>
          </div>

          <div style={{ flexShrink: 0, textAlign: "center" }}>
            {report.details[0]?.image ? (
              <Image
                width={300}
                height={200}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                src={report.details[0].image}
                alt="ภาพรายงาน"
              />
            ) : (
              <p>ไม่มีภาพ</p>
            )}
          </div>

          <div>
            {report.result?.status === "pending" && (
              <Button
                type="primary"
                style={{
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                  boxSizing: "border-box",
                }}
                onClick={() => showModal(report)}
              >
                อนุมัติ
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
   <div className="bg-base-blue-20">
   <EmployeeBar page="Report"/>
   <EmSidebar page="*"/>
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "28px", padding: "15px" }}>
          <strong>รายการรายงานของคุณ</strong>
        </h1>
        {user && (
          <div
            style={{
              marginBottom: "20px",
              backgroundColor: "#f73859",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <p style={{ color: "#fbfbfb" }}>
              <strong>User: {user.UserName}</strong>
            </p>
            <p style={{ color: "#fbfbfb" }}>
              <strong>ชื่อผู้ใช้งาน: {user.FirstName} {user.LastName}</strong>
            </p>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <Select
            allowClear
            placeholder="กรองตามสถานะ"
            onChange={handleFilterChange}
            style={{ width: "20%" }}
          >
            <Select.Option value="pending">กำลังรอดำเนินการ</Select.Option>
            <Select.Option value="approved">อนุมัติแล้ว</Select.Option>
            
          </Select>
        </div>
        {filteredReports.length > 0 ? (
          <Table dataSource={filteredReports} columns={columns} rowKey="ID" pagination={false} />
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>ไม่มีรายงาน</p>
        )}

        <Modal
          title="ยืนยันการอนุมัติ"
          visible={isModalVisible}
          onOk={handleApprove}
          onCancel={() => setIsModalVisible(false)}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการอนุมัติรายงานนี้?</p>
        </Modal>
      </div>
    </div></div>
  );
};

export default AllReports;
