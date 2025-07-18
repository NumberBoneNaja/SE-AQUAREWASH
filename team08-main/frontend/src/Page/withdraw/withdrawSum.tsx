import React, { useState, useEffect } from "react";
import { Button, List, Card, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { withdrawInterface } from "../../interfaces/withdrawInterface";
import { withdrawDetailInterface } from "../../interfaces/withdrawDetailInterface";
import {
  CreateWithdraw,
  CreateWithdrawDetail,
  UpdateExchequer,
  GetUserById,
} from "../../services/https";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { thSarabunNewBase64 } from "../../Page/withdraw/thaibase64";
import logo from "../../Page/withdraw/logo.png";

const WithdrawSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>(location.state?.cart || []);
  const [_withdrawDetails, setWithdrawDetails] = useState<withdrawDetailInterface[]>([]);
  const [_withdraw, setWithdraw] = useState<withdrawInterface | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const storedUserId = localStorage.getItem("id");
      if (!storedUserId) throw new Error("กรุณาเข้าสู่ระบบก่อนใช้งาน");

      const response = await GetUserById(storedUserId);
      const user = response?.data;

      if (user && user.ID) {
        const userIdAsNumber = parseInt(user.ID, 10);
        if (isNaN(userIdAsNumber)) throw new Error("ข้อมูลผู้ใช้ไม่ถูกต้อง");
        setEmployeeId(userIdAsNumber);
        setFirstName(user.FirstName);
        setLastName(user.LastName);
      } else {
        throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      } else {
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      }
    }
  };

  const isValidBase64 = (str: string): boolean => {
    try {
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      if (isValidBase64(thSarabunNewBase64)) {
        doc.addFileToVFS("THSarabunNew.ttf", thSarabunNewBase64);
        doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
        doc.setFont("THSarabunNew", "normal");
      } else {
        message.error("ฟอนต์ Base64 ไม่ถูกต้อง");
        return;
      }

      const logoWidth = 35;
      const logoHeight = 20;
      const xPos = (doc.internal.pageSize.width - logoWidth) / 2;
      const yPos = 8;
      doc.addImage(logo, "PNG", xPos, yPos, logoWidth, logoHeight);

      doc.setFontSize(18);
      doc.text("สรุปการยืมสินค้า", 14, yPos + logoHeight + 5);

      doc.setFontSize(14);
      doc.text("วันที่: " + new Date().toLocaleString(), 14, yPos + logoHeight + 15);
      doc.text("ชื่อ: " + (firstName || "") + " " + (lastName || ""), 14, yPos + logoHeight + 25);
      doc.text("รหัสพนักงาน: " + (employeeId || "ไม่พบข้อมูล"), 14, yPos + logoHeight + 35);

      if (cart.length === 0) {
        doc.text("ไม่มีข้อมูลสินค้าในตะกร้า", 14, yPos + logoHeight + 30);
      } else {
        const data = cart.map((item) => [item.brand, `${item.quantity} ชิ้น`]);

        autoTable(doc, {
          head: [["สินค้า", "จำนวน"]],
          body: data,
          startY: yPos + logoHeight + 50,
          styles: { font: "THSarabunNew" },
          columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
          },
          theme: 'grid',
        });
      }

      doc.save("WithdrawSummary.pdf");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสร้าง PDF");
    }
  };

  const handleCreateWithdraw = async () => {
    if (!employeeId) {
      message.error("ไม่พบข้อมูลผู้ใช้งาน");
      return;
    }
    if (cart.length === 0) {
      message.error("ไม่มีสินค้าในตะกร้า");
      return;
    }

    try {
      const response = await CreateWithdraw({
        withdraw_date: new Date().toISOString(),
        employee_id: employeeId,
      });

      if (!response.status) throw new Error("เกิดข้อผิดพลาดในการสร้างการยืม");

      const withdrawId = response.data.id;
      const detailsResponse = await Promise.all(
        cart.map(async (item) => {
          if (item.stock < item.quantity) throw new Error(`สินค้า ${item.brand} มีจำนวนไม่พอ`);
          await UpdateExchequer(item.id, { id: item.id, stock: item.stock - item.quantity });
          return CreateWithdrawDetail({
            quantity: item.quantity,
            product_id: item.id,
            withdraw_id: withdrawId,
          });
        })
      );

      if (detailsResponse.every((res) => res.status)) {
        message.success("การยืมสำเร็จ");
        setWithdraw({
          id: withdrawId,
          withdraw_date: new Date().toISOString(),
          employee_id: employeeId,
        });
        setWithdrawDetails(
          cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            withdraw_id: withdrawId,
          }))
        );
        setCart([]);
        generatePDF();
        navigate("/EmHome");
      } else {
        throw new Error("เกิดข้อผิดพลาดในการสร้างรายละเอียดการยืม");
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "เกิดข้อผิดพลาด");
      } else {
        message.error("เกิดข้อผิดพลาด");
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#f0f8ff",
        padding: "20px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "800px",
        border: "15px solid #35a3d6",
      }}>
        <h1 style={{ textAlign: "center" }}><strong>สรุปผลการยืม</strong></h1>
        <Card title="รายการสินค้าที่เลือก">
          <List
            dataSource={cart}
            renderItem={(item) => (
              <List.Item style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                  <img
                    src={item.image}
                    alt={item.brand}
                    style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                  />
                  <div>{item.brand}</div>
                  <div>จำนวน: {item.quantity}</div>
                </div>
              </List.Item>
            )}
          />
        </Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button type="primary" onClick={handleCreateWithdraw}>
            ยืนยันการยืม
          </Button>
          <Button type="default" onClick={() => window.history.back()} style={{ backgroundColor: "#f73859" }}>
            <p style={{ color: "white" }}>ยกเลิก</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSummary;
