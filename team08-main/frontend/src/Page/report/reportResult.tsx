import React, { useState, useEffect } from "react";
import {
  GetReportByUserID,
  GetReportDetailByReportID,
  GetReportResultByReportID,
  GetUserById,
} from "../../services/https";
import { Table, Spin, message, Image } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import  UserBar from "../../Components/Nav_bar/UserBar";

const ReportResult: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUserId = localStorage.getItem("id");
        if (!storedUserId) {
          message.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
          return;
        }

        const userData = await GetUserById(storedUserId);
        if (!userData || !userData.data) {
          throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
        setUser(userData.data);

        const reportsDataResponse = await GetReportByUserID(storedUserId);

        if (reportsDataResponse?.status === 400) {
          message.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน (Status 400)");
          return;
        }

        const reportsData = reportsDataResponse?.data || [];

        if (!Array.isArray(reportsData)) {
          console.error("Unexpected reportsData format:", reportsData);
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }

        if (reportsData.length === 0) {
          message.info("ยังไม่มีรายงานที่เกี่ยวข้องในระบบ");
          return;
        }

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

        const sortedReports = enhancedReports.sort(
          (a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );

        setReports(sortedReports);
      } catch (error: any) {
        console.error("Error:", error.message);
        message.error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  const columns = [
    {
      title: "ข้อมูลรายงาน",
      key: "details",
      render: (_: any, report: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            backgroundColor:"#fbfbfb",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#fbfbfb", padding: "10px" }}>
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
                {report.result?.status
                  ? report.result.status === "pending"
                    ? "กำลังรอดำเนินการ"
                    : report.result.status === "approved"
                    ? "อนุมัติแล้ว"
                    : report.result.status === "rejected"
                    ? "ถูกปฏิเสธ"
                    : "ไม่ทราบสถานะ"
                  : "ไม่ทราบ"}
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
        </div>
      ),
    },
  ];

  return (
    <>
    <UserBar page="Home"/>
    <div style={{ backgroundColor: "#35a3d6", minHeight: "100vh", padding: "20px" }}>
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
        {reports.length > 0 ? (
          <Table
            dataSource={reports}
            columns={columns}
            rowKey="ID"
            pagination={false}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>ยังไม่มีรายงาน</p>
        )}
      </div>
    </div></>
  );
};

export default ReportResult;
