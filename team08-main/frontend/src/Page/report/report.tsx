import React, { useState, useEffect } from "react";
import {
  CreateReport,
  CreateReportDetail,
  GetMachines,
  GetUserById,
  GetLastReport,
  CreateReportResult,
} from "../../services/https";
import { ReportInterface } from "../../interfaces/reportInterface";
import {
  Input,
  Button,
  Form,
  message,
  Upload,
  Card,
  ConfigProvider,
  Spin,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dryer from "../report/dryer.jpg";
import washer from "../report/washer.jpg";
import defaultImage from "../report/washer.jpg";
import UserBar from "../../Components/Nav_bar/UserBar";

const { TextArea } = Input;

const ReportWashingMachine: React.FC = () => {
  const [machines, setMachines] = useState([]);
  const [report, setReport] = useState<ReportInterface>({
    machine_id: 0,
    user_id: 0,
  });
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const navigate = useNavigate();
  const navigateToReportResult = () => {
    navigate("/ReportResult");
  };
  useEffect(() => {
    document.body.style.backgroundColor = "#35a3d6";
    const fetchMachines = async () => {
      setLoadingMachines(true);
      try {
        const data = await GetMachines();
        if (data) {
          // เรียงลำดับให้ "เครื่องซักผ้า" มาก่อน "เครื่องอบผ้า"
          const sortedMachines = data.sort((a: any, b: any) => {
            if (a.machine_type === "เครื่องซักผ้า" && b.machine_type === "เครื่องอบผ้า") {
              return -1;
            }
            if (a.machine_type === "เครื่องอบผ้า" && b.machine_type === "เครื่องซักผ้า") {
              return 1;
            }
            return 0;
          });
          setMachines(sortedMachines);
        } else {
          setMachines([]);
        }
      } catch (error) {
        message.error("ไม่สามารถดึงข้อมูลเครื่องซักผ้าได้");
      } finally {
        setLoadingMachines(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const storedUserId = localStorage.getItem("id");
        if (!storedUserId) {
          message.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
          return;
        }

        const response = await GetUserById(storedUserId);
        const user = response?.data;

        if (user && user.ID) {
          const userIdAsNumber = parseInt(user.ID, 10);
          if (!isNaN(userIdAsNumber)) {
            setReport((prev) => ({ ...prev, user_id: userIdAsNumber }));
          } else {
            message.error("ข้อมูลผู้ใช้ไม่ถูกต้อง");
          }
        } else {
          message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    };

    fetchMachines();
    fetchCurrentUser();
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    if (report.user_id === 0) {
      message.error("เกิดข้อผิดพลาด: ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (report.machine_id === 0) {
      message.error("กรุณาเลือกเครื่องซักผ้า");
      return;
    }

    if (!description.trim()) {
      message.error("กรุณากรอกรายละเอียดปัญหา");
      return;
    }

    if (fileList.length < 1 || fileList.length > 1) {
      message.error("กรุณาอัปโหลดรูปภาพเพียง 1 รูป");
      return;
    }

    setLoading(true);
    try {
      const createdReport = await CreateReport(report);
      if (!createdReport) {
        throw new Error("ไม่สามารถสร้างรายงานได้");
      }

      const lastReport = await GetLastReport();
      const newReportId = lastReport && !isNaN(Number(lastReport.ID)) ? Number(lastReport.ID) + 0 : 1;

      if (!newReportId) {
        throw new Error("ไม่พบ ID ของรายงานล่าสุด");
      }

      const base64Images = await Promise.all(
        fileList.map((file) => convertFileToBase64(file.originFileObj))
      );

      const reportDetails = base64Images.map((image) => ({
        id: 0,
        description: description,
        image: image,
        report_date: new Date().toISOString(),
        report_id: newReportId,
      }));

      const reportResult = {
        status: "pending",
        report_id: newReportId,
        accepter_id: 0,
      };

      const createDetailsResult = await Promise.all(
        reportDetails.map((detail) => CreateReportDetail(detail))
      );

      if (createDetailsResult.every(Boolean)) {
        const createResult = await CreateReportResult(reportResult);

        if (createResult) {
          message.success("ส่งรายงานสำเร็จ");
          navigate("/ReportResult"); // นำผู้ใช้ไปยังหน้า Dashboard
        } else {
          message.error("เกิดข้อผิดพลาดในการบันทึกสถานะรายงาน");
        }
      } else {
        message.error("เกิดข้อผิดพลาดในการบันทึกรายละเอียดรายงาน");
      }
    } catch (error) {
      console.error("Error while creating report:", error);
      message.error("เกิดข้อผิดพลาดในการรายงานปัญหา");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleMachineSelect = (machine: any) => {
    if (machine?.ID) {
      setReport((prev) => ({ ...prev, machine_id: machine.ID }));
    } else {
      message.error("ข้อมูลเครื่องซักผ้าไม่ถูกต้อง กรุณาลองอีกครั้ง");
    }
  };

  const getMachineImage = (type: string) => {
    switch (type) {
      case "เครื่องอบผ้า":
        return dryer;
      case "เครื่องซักผ้า":
        return washer;
      default:
        return defaultImage;
    }
  };

  return (
    <>
      <UserBar page="Home" />
      <div style={{ height: "10px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ConfigProvider>
          <div
            style={{
              maxWidth: "1200px",
              margin: "auto",
              padding: "20px",
              backgroundColor: "#fbfbfb",
              borderRadius: "8px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "28px",
                padding: "15px",
              }}
            >
              รายงานปัญหาเครื่องซักผ้า
            </h1>
            {loadingMachines ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: 1, marginRight: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {machines.map((machine: any) => (
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={machine.machine_type}
                            src={getMachineImage(machine.machine_type)}
                            style={{
                              height: "100%",
                              width: "98%",
                              padding: "2px",
                              borderRadius: "8px",
                              paddingLeft: "6px",
                              paddingTop: "6px",
                            }}
                          />
                        }
                        onClick={() => handleMachineSelect(machine)}
                        style={{
                          backgroundColor:
                            report.machine_id === machine.ID ? "#f73859" : "#24292e",
                          border:
                            report.machine_id === machine.ID
                              ? "4px solid #f73859"
                              : "1px solid #fbfbfb",
                          boxShadow:
                            report.machine_id === machine.ID
                              ? "0 0px 5px 0 #24292e, 0 6px 5px 0 #24292e"
                              : "none",
                          cursor: "pointer",
                          width: "200px",
                        }}
                      >
                        <Card.Meta
                          title={
                            <span style={{ color: "#fbfbfb" }}>
                              {machine.machine_name}
                            </span>
                          }
                          description={
                            <span style={{ color: "#fbfbfb" }}>
                              {machine.machine_type}
                            </span>
                          }
                        />
                      </Card>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    maxWidth: "500px",
                    backgroundColor: "#fbfbfb",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <Form layout="vertical">
                    <h1 style={{ color: "#24292e", fontSize: "20px" }}>
                      รายละเอียดปัญหาเครื่องซักผ้า
                    </h1>
                    <Form.Item required>
                      <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                      />
                    </Form.Item>
                    <h1 style={{ color: "#24292e", fontSize: "20px" }}>แนบรูปภาพ</h1>
                    <Form.Item required>
                      <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>อัปโหลดรูปภาพ</Button>
                      </Upload>
                    </Form.Item>

                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={loading}
                      style={{
                        backgroundColor: "#f73859",
                        color: "#fff",
                        boxShadow: "0 5px 5px 0 #24292e, 0 6px 5px 0 #24292e",
                      }}
                    >
                      ส่งรายงาน
                    </Button>
                      
                      <Button
                      type="link"
                      onClick={navigateToReportResult}
                      loading={loading}
                      style={{
                        backgroundColor: "#fbfbfb",
                        color: "#blue",
                        marginLeft: "10px",
                      }}
                    >
                      ติดตามการรายงาน
                    </Button>

                  </Form>
                </div>
              </div>
            )}
          </div>
        </ConfigProvider>
      </div>
    </>
  );
};

export default ReportWashingMachine;
