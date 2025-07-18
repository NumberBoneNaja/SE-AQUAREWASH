import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Card, Upload, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { GetAllTypeLaundryProducts, CreateExchequer } from "../../services/https";
import { exchequerInterface } from "../../interfaces/exchequerInterface";
import { TypeLaundryProductInterface } from "../../interfaces/typeLaundryProductInterface";
import LM from "../../Page/withdraw/Screenshot 2024-12-27 165421.png";

const { Option } = Select;

const AddLaundryProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [typeLaundryProducts, setTypeLaundryProducts] = useState<TypeLaundryProductInterface[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [_messageApi, contextHolder] = message.useMessage();

  // ดึงข้อมูลประเภทสินค้าซักอบรีด
  const fetchTypeLaundryProducts = async () => {
    try {
      const response = await GetAllTypeLaundryProducts();
      if (response.status) {
        setTypeLaundryProducts(response.data);
      } else {
        message.error("Failed to fetch type laundry products.");
      }
    } catch (error) {
      message.error("An error occurred while fetching data.");
    }
  };

  // อัปเดตไฟล์ที่อัปโหลด
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
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
  const onFinish = async (values: exchequerInterface) => {
    setLoading(true);
    try {
      let imageBase64: string | undefined = undefined;

      if (fileList.length > 0 && fileList[0].originFileObj) {
        imageBase64 = await convertFileToBase64(fileList[0].originFileObj);
      }

      const payload: exchequerInterface = {
        ...values,
        tlp_id: Number(values.tlp_id),
        stock: Number(values.stock),
        image: imageBase64,
      };

      const response = await CreateExchequer(payload);
      if (response.status === 201) {
        message.success("Successfully created laundry product.");
        form.resetFields();
        setFileList([]);
      } else {
        message.error(response.data?.error || "Failed to create laundry product.");
      }
    } catch (error) {
      message.error("An error occurred while creating product.");
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้เมื่อโหลดครั้งแรก
  useEffect(() => {
    fetchTypeLaundryProducts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${LM})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <img
    src={LM}

    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
    }}
  />
      {contextHolder}
      <Card
        title="Add Laundry Product"
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
        }}
        bodyStyle={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="brand"
            label={<span style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "2px 8px", borderRadius: "4px" }}>Brand</span>}
            rules={[{ required: true, message: "Please enter brand name!" }]}
          >
            <Input style={{ width: "100%", maxWidth: "400px", borderRadius:"40px", background:"transparent"}} />
          </Form.Item>
          <Form.Item
            name="stock"
            label={<span style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "2px 8px", borderRadius: "4px" }}>Stock</span>}
            rules={[{ required: true, message: "Please enter stock quantity!" }]}
          >
            <Input type="number" style={{ width: "100%", maxWidth: "400px", borderRadius:"40px", background:"transparent", }} />
          </Form.Item>
          <Form.Item
            name="tlp_id"
            label={<span style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "2px 8px", borderRadius: "4px" }}>Type Laundry Product</span>}
            rules={[{ required: true, message: "Please select a type!" }]}
          >
            <Select placeholder="Select type" style={{ width: "100%", maxWidth: "400px", borderRadius:"40px", background:"transparent" }}>
              {typeLaundryProducts.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.type_laundry_product}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label={<span style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "2px 8px", borderRadius: "4px" }}>Upload Image</span>}
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
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddLaundryProduct;
