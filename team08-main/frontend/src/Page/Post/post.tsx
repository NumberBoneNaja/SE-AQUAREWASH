// src/components/CreatePost.tsx
import React, { useState } from "react";
import { Form, Input, Button, Upload, Card, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { CreatePost as CreatePostService } from "../../services/https";
import { PostInterface } from "../../interfaces/PostInterface";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [_messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // อัปเดตไฟล์ที่อัปโหลด
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const navigateAllPost = () => {
    navigate("/postlist");
  };

  // พรีวิวรูปภาพ
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const img = new Image();
    img.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(img.outerHTML);
  };

  // แปลงไฟล์เป็น Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // เมื่อส่งฟอร์ม
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let imageBase64: string | undefined = undefined;

      // แปลงไฟล์ภาพเป็น Base64
      if (fileList.length > 0 && fileList[0].originFileObj) {
        imageBase64 = await convertFileToBase64(fileList[0].originFileObj);
      }

      // เตรียมข้อมูลสำหรับ API
      const payload: PostInterface = {
        caption: values.caption,
        image: imageBase64,
      };

      // เรียกใช้ฟังก์ชัน CreatePost
      const response = await CreatePostService(payload);

      if (response?.status === 201) {
        message.success("Post created successfully!");
        form.resetFields();
        setFileList([]);
      } else {
        message.error(response?.data?.message || "Failed to create post.");
      }
    } catch (error) {
      message.error("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     <EmployeeBar page="AllOrderUser"/>
     <EmSidebar page="Announcement"/>
   
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        
      }}
      className="bg-base-blue-20"
    >
      {contextHolder}
      <Card
        title="Create Post"
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="caption"
            label="Caption"
            rules={[{ required: true, message: "Please enter a caption!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter your caption"
              maxLength={500}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
              <Button htmlType="reset" onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Button type="link" onClick={navigateAllPost}>ดูโพสต์ทั้งหมด</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
     </div>
  );
};

export default CreatePost;
