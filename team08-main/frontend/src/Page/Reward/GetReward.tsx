import React, { useState, useEffect } from "react";
import { RewardInterface } from "../../interfaces/IReward";
import { Input, Button, message, Modal, Form, Select, Upload, Col, Row } from "antd";
const { Option } = Select;
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { GetAllReward, DeleteRewards, UpdateReward, CreateReward, UsedRewardByBarcode } from "../../services/https";
import dayjs from "dayjs";
import UserBar from "../../Components/Nav_bar/EmployeeBar";
import SideBar from "../../Components/Nav_bar/EmSidebar";

function GetReward() {
  const [rewards, setRewards] = useState<RewardInterface[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<RewardInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardInterface | null>(null);
  const [editForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State สำหรับ modal แก้ไขข้อมูล
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State สำหรับ modal เพิ่มข้อมูล
  const [ischeckModalVisible, setIscheckModalVisible] = useState(false);
  const [isRewardUsedModalVisible, setIsRewardUsedModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handlecheck = (reward: RewardInterface) => {
    setSelectedReward(reward);
    setIscheckModalVisible(true);
  };



  const handleEdit = (reward: RewardInterface) => {
    const adjustedReward = {
      ...reward,
      Discount: reward.RewardTypeID === 1 ? reward.Discount * 100 : reward.Discount,
      Starttime: reward.Starttime ? new Date(reward.Starttime).toISOString().slice(0, 16) : "",
      Endtime: reward.Endtime ? new Date(reward.Endtime).toISOString().slice(0, 16) : "",
      IsActive: reward.IsActive ? 1 : 0, // Convert boolean to 1/0
    };

    // ล้าง selectedReward ก่อนตั้งค่าใหม่
    setSelectedReward(null);
    editForm.resetFields(); // รีเซ็ตฟอร์มทุกครั้ง
    setTimeout(() => {
      // ตั้งค่าใหม่พร้อมกับข้อมูลล่าสุด
      setSelectedReward({
        ...adjustedReward,
        IsActive: adjustedReward.IsActive === 1,
      });
      editForm.setFieldsValue({
        ...adjustedReward,
        ImagePath: adjustedReward.ImagePath || "", // ใช้ Base64 ของ reward ล่าสุด
      });
    }, 0);

    setIsEditModalVisible(true); // เปิด Modal แก้ไข
  };

  useEffect(() => {
    if (selectedReward) {
      editForm.setFieldsValue({
        ...selectedReward,
        ImagePath: selectedReward.ImagePath || "", // ใช้ Base64 จาก selectedReward
      });
    }
  }, [selectedReward]); // ทำงานทุกครั้งที่ selectedReward เปลี่ยน




  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await GetAllReward();
      if (response && response.data) {
        setRewards(response.data);
        setFilteredRewards(response.data); // สำหรับการค้นหา
      } else {
        message.error("ไม่สามารถดึงข้อมูลรางวัลได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredRewards(
      rewards.filter((reward) =>
        reward.Name && reward.Name.toLowerCase().includes(value) || reward.Point && reward.Point.toString().includes(value)
      )
    );
  };

  const handleDelete = async (reward: RewardInterface) => {
    setSelectedReward(reward);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedReward) {
      try {
        const response = await DeleteRewards(selectedReward.ID || 0); // เรียกฟังก์ชัน DeleteReward
        if (response) {
          message.success(`ลบข้อมูลรางวัลเรียบร้อย`);
          setRewards((prev) => prev.filter((reward) => reward.ID !== selectedReward.ID)); // อัปเดต State
          setFilteredRewards((prev) => prev.filter((reward) => reward.ID !== selectedReward.ID)); // อัปเดตข้อมูลที่แสดง
        } else {
          message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error("Error deleting reward:", error);
        message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
    setIsDeleteModalVisible(false);
  };
  const handleUpdate = async () => {
    try {
      const updatedReward = await editForm.validateFields();
      if (selectedReward) {
        const rewardTypeID = parseInt(updatedReward.RewardTypeID);
        const discount = parseFloat(updatedReward.Discount);

        const payload = {
          ...selectedReward,
          ...updatedReward,
          Discount: rewardTypeID === 1 ? discount / 100 : discount, // หาร 100 เมื่อ RewardTypeID เป็น 1
          Point: parseFloat(updatedReward.Point),
          Limit: parseFloat(updatedReward.Limit),
          RewardTypeID: rewardTypeID,

          ImagePath: updatedReward.ImagePath,
          Starttime: updatedReward.Starttime
            ? new Date(updatedReward.Starttime).toISOString()
            : selectedReward.Starttime,
          Endtime: updatedReward.Endtime
            ? new Date(updatedReward.Endtime).toISOString()
            : selectedReward.Endtime,
          IsActive: updatedReward.IsActive === 1, // แปลงค่า 1/0 เป็น Boolean
        };

        console.log("Payload:", payload); // Debugging payload

        const response = await UpdateReward(selectedReward.ID!.toString(), payload);
        if (response) {
          message.success(`แก้ไขข้อมูลรางวัลเรียบร้อย`);
          fetchRewards(); // รีโหลดข้อมูลรางวัล
          setIsEditModalVisible(false);
        }
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      console.error("Error updating reward:", error);
    }
  };



  const handleAdd = () => {
    editForm.resetFields(); // Reset fields to avoid carrying over data from previous edits
    setIsAddModalVisible(true);
    setBase64Images([]); // Clear base64 images when adding new reward
  };




  const [base64Images, setBase64Images] = useState<string[]>([]);


  const getBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (base64) => {
        setBase64Images([base64]);
        //message.success(`${info.file.name} uploaded successfully`);
      });
    }
  };
  const handleCreate = async (values: RewardInterface) => {
    const discount =
      parseInt(values.RewardTypeID as unknown as string) === 1
        ? parseFloat(values.Discount as unknown as string) / 100 // หาร 100
        : parseFloat(values.Discount as unknown as string); // ไม่เปลี่ยนค่า

    const payload: RewardInterface = {
      ...values,
      Point: parseInt(values.Point as unknown as string),
      Discount: discount,
      Limit: parseInt(values.Limit as unknown as string),
      RewardTypeID: parseInt(values.RewardTypeID as unknown as string),
      Starttime: dayjs(values.Starttime).toISOString(),
      Endtime: dayjs(values.Endtime).toISOString(),
      ID: 0,
      ImagePath: base64Images[0] || "",
    };

    console.log("Payload:", payload);
    try {
      const response = await CreateReward(payload);
      if (response.status === 200) {
        message.success("เพิ่มข้อมูลสำเร็จ!");
        setIsAddModalVisible(false);
        fetchRewards();
      } else {
        throw new Error(response.data?.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }
    } catch (error: any) {
      // ตรวจสอบ error message
      const errorMessage =
        error.response?.data?.message || // ข้อความจาก API
        error.message || // ข้อความจาก Error object
        "เกิดข้อผิดพลาดในการเพิ่มข้อมูล";
      message.error(errorMessage); // แสดงข้อความข้อผิดพลาด
      console.error("Error creating reward:", error);
    }
  };


  // Close the modal

  // Submit the barcode
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { barcode } = values;

      const response = await UsedRewardByBarcode(barcode); // Call the backend API
      if (response.success) {
        message.success("Reward Used successfully!");
        setIscheckModalVisible(false); // ปิด modal แรก
        setIsRewardUsedModalVisible(true); // เปิด modal ที่สอง
      } else {
        message.error(response.message || "Failed to Used reward.");
      }

      setIsDeleteModalVisible(false); // Close the modal after submission
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error Used reward:", error);
      message.error("An error occurred while deleting the reward.");
    }
  }



  return (
    
    

    <div
      style={{
        background: "#F0FCFF", // ใช้สีเดียวกับ UseReward.tsx
        minHeight: "100vh",

      }}
    >
      <UserBar page="Reward" />
      <SideBar page="Reward" />
      <div
        style={{
          background: "linear-gradient(to right, #0099ff, #33ccff)",
          padding: "20px",
          width: "70%",
          height: "8vh",
          marginLeft: "15%",
          marginTop: "2vh",
          textAlign: "center",
          color: "#FFF",
          borderRadius: "5vh 5vh 0 0",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "2rem" }}>จัดการข้อมูลรางวัล</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #0099ff, #33ccff)",
          width: "70%",
          marginLeft: "15%",
          marginTop: "-3vh",
          padding: "1vh",

          backgroundColor: "#f5f8fa",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        }}

      >
        <button style={{ width: "20%", borderRadius: "8px", padding: "10px", backgroundColor: "#00BBF0", color: "white", fontWeight: "bold" }} onClick={() => handlecheck(selectedReward!)} >Check Reward</button>
        <Input
          placeholder="ค้นหาชื่อหรือคะแนน"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "20%",
            borderRadius: "8px",
            padding: "10px",
            border: "1px solid #00BBF0",
          }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: "#00BBF0",
            borderColor: "#00BBF0",
            borderRadius: "8px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={handleAdd}
        >
          เพิ่มข้อมูล
        </Button>



        <Modal
          title="เพิ่มข้อมูลรางวัล"
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={handleCreate}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="ชื่อรางวัล"
                  name="Name"
                  rules={[{ required: true, message: "กรุณากรอกชื่อรางวัล" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="คะแนน"
                  name="Point"
                  rules={[{ required: true, message: "กรุณากรอกคะแนน" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Limit"
                  name="Limit"
                  rules={[{ required: true, message: "กรุณากรอกลิมิต" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="ส่วนลด"
                  name="Discount"
                  rules={[{ required: true, message: "กรุณากรอกส่วนลด" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="เวลาเริ่มต้น"
                  name="Starttime"
                  rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}
                >
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)} // กำหนดเวลาปัจจุบันเป็นค่าเริ่มต้น
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="เวลาสิ้นสุด"
                  name="Endtime"
                  rules={[
                    { required: true, message: "กรุณาเลือกเวลาสิ้นสุด" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || value > getFieldValue("Starttime")) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น"));
                      },
                    }),
                  ]}
                >
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)} // กำหนดเวลาปัจจุบันเป็นค่าเริ่มต้น
                  />
                </Form.Item>
              </Col>

              <Col lg={24}>
                <Form.Item
                  label="Reward Type"
                  name="RewardTypeID"
                  rules={[{ required: true, message: "Please select a reward type!" }]}
                >
                  <Select placeholder="Select Reward Type">
                    <Option value={1}>ลดเป็นเปอร์เซ็น</Option>
                    <Option value={2}>ลดเป็นจำนวนเงิน</Option>
                    <Option value={3}>สิ่งของ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="รูปภาพ"
                  name="ImagePath"
                >
                  <Upload
                    name="image"
                    listType="picture"
                    maxCount={1}
                    accept="image/*"
                    customRequest={({ onSuccess }) => {
                      setTimeout(() => onSuccess && onSuccess("ok"), 0);
                    }}
                    onChange={handleUpload}
                  >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Button type="primary" htmlType="submit">
                  ยืนยัน
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>





      </div>
      <div
        className="reward-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // จัดเป็น 2 แถวแนวนอน
          gap: "20px",
          width: "70%",
          marginLeft: "15%",
          maxHeight: "100vh", // กำหนดความสูงของ container
          overflowY: "auto", // เปิดใช้งาน scroll
          padding: "10px",
          backgroundColor: "#F9F9F9",

          //boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {filteredRewards.map((reward) => (
          <div
            className="reward-card"
            key={reward.ID}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              display: "flex",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: reward.Limit > 0 ? "#00BBF0" : "#FF4D4F",
                color: "#FFF",
                padding: "5px 15px",
                borderRadius: "50px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {reward.Limit > 0 ? `คงเหลือ: ${reward.Limit}` : "โค้ดหมด"}
            </div>
            {reward.ImagePath && (
              <img
                src={reward.ImagePath}
                alt={reward.Name}
                style={{
                  width: "100px",
                  height: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              />
            )}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <div>
                <h3 style={{ color: "#465B7E", fontWeight: "bold", margin: "0 0 5px" }}>
                  {reward.Name}
                </h3>
                <p style={{ margin: "0 0 5px", color: "#777" }}>คะแนน: {reward.Point}</p>
                <p style={{ margin: "0 0 5px", color: "#FF4D4F", fontWeight: "bold" }}>
                  ส่วนลด:{" "}
                  {reward.RewardTypeID === 1
                    ? `${reward.Discount * 100}%`
                    : `${reward.Discount} บาท`}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(reward)}
                  style={{ backgroundColor: "#00BBF0", color: "#FFF", borderColor: "#00BBF0" }}
                >
                  แก้ไข
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(reward)}>
                  ลบ
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>


      <Modal
        title="ยืนยันการลบ"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการลบข้อมูลรางวัล "{selectedReward?.Name}" ใช่หรือไม่?</p>
      </Modal>

      <Modal
        title="ยืนยันรางวัลจากลูกค้า"
        visible={ischeckModalVisible}
        onCancel={() => setIscheckModalVisible(false)}
        onOk={confirmDelete}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการเช็คข้อมูลรางวัล "{selectedReward?.Name}" ใช่หรือไม่?</p>
      </Modal>

      <Modal
        title="แก้ไขข้อมูลรางวัล"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdate}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="ชื่อรางวัล"
                name="Name"
                rules={[{ required: true, message: "กรุณากรอกชื่อรางวัล" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="คะแนน"
                name="Point"
                rules={[{ required: true, message: "กรุณากรอกคะแนน" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Limit"
                name="Limit"
                rules={[{ required: true, message: "กรุณากรอกลิมิต" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ส่วนลด"
                name="Discount"
                rules={[{ required: true, message: "กรุณากรอกส่วนลด" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ประเภทส่วนลด"
                name="RewardTypeID"
                rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด" }]}
              >
                <Select placeholder="เลือกประเภทส่วนลด">
                  <Select.Option value={1}>ลดเป็น %</Select.Option>
                  <Select.Option value={2}>ลดเป็นจำนวนเงิน</Select.Option>
                  <Select.Option value={3}>สิ่งของ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="สถานะการใช้งาน"
                name="IsActive"
                rules={[{ required: true, message: "กรุณาเลือกสถานะการใช้งาน" }]}
              >
                <Select>
                  <Select.Option value={1}>เปิดใช้งาน</Select.Option>
                  <Select.Option value={0}>ปิดใช้งาน</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="เวลาเริ่มต้น"
                name="Starttime"
                rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}
              >
                <Input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)} // กำหนดเวลาปัจจุบันเป็นค่าเริ่มต้น
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="เวลาสิ้นสุด"
                name="Endtime"
                rules={[
                  { required: true, message: "กรุณาเลือกเวลาสิ้นสุด" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value > getFieldValue("Starttime")) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น"));
                    },
                  }),
                ]}
              >
                <Input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)} // กำหนดเวลาปัจจุบันเป็นค่าเริ่มต้น
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="รูปภาพ" name="ImagePath">
                <Upload
                  key={selectedReward?.ID || "default"}
                  name="image"
                  listType="picture"
                  maxCount={1}
                  accept="image/*"
                  customRequest={({ onSuccess }) => {
                    setTimeout(() => {
                      onSuccess && onSuccess("ok");
                    }, 0);
                  }}
                  onChange={(info) => {
                    const file = info.file.originFileObj;
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const base64 = reader.result as string;
                        editForm.setFieldsValue({ ImagePath: base64 });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  defaultFileList={
                    selectedReward?.ImagePath
                      ? [
                        {
                          uid: "-1",
                          name: "Current Image",
                          status: "done",
                          thumbUrl: selectedReward.ImagePath, // ใช้ Base64 สำหรับแสดงใน Upload
                        },
                      ]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>อัปโหลดรูปภาพ</Button>
                </Upload>
              </Form.Item>
            </Col>



          </Row>
        </Form>
      </Modal>

      <Modal
        title="Reward Confirmation"
        visible={isRewardUsedModalVisible}
        onCancel={() => setIsRewardUsedModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "48px",
              color: "#45dfb1", // สีเขียวอ่อนที่คุณชอบ
              marginBottom: "16px",
            }}
          >
            ✔
          </div>
          <p>
            คุณได้ใช้รางวัล <strong>{selectedReward?.Name}</strong> ไปแล้ว
          </p>
        </div>
      </Modal>

      <Modal
        title="Enter Barcode to Delete Reward"
        visible={ischeckModalVisible}
        onCancel={() => setIscheckModalVisible(false)}
        onOk={handleOk}
        okText="เช็ครางวัลด้วยบาร์โค้ด"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Barcode"
            name="barcode"
            rules={[{ required: true, message: "Please enter a barcode!" }]}
          >
            <Input placeholder="Enter Barcode" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default GetReward;
