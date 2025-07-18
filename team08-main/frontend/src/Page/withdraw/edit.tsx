import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Card, Upload, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { GetExchequerByID, UpdateExchequer, GetAllTypeLaundryProducts } from "../../services/https";
import { exchequerInterface } from "../../interfaces/exchequerInterface";
import { TypeLaundryProductInterface } from "../../interfaces/typeLaundryProductInterface";
import { useParams, useNavigate } from "react-router-dom";

const { Option } = Select;

const EditExchequer: React.FC = () => {
  const [form] = Form.useForm();
  const [typeLaundryProducts, setTypeLaundryProducts] = useState<TypeLaundryProductInterface[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [_messageApi, contextHolder] = message.useMessage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchTypeLaundryProducts = async () => {
    try {
      const response = await GetAllTypeLaundryProducts();
      if (response.status) {
        setTypeLaundryProducts(response.data);
      } else {
        message.error("Failed to fetch type laundry products.");
      }
    } catch (error) {
      console.error("Error fetching type laundry products:", error);
      message.error("An error occurred while fetching data.");
    }
  };

  const fetchExchequer = async () => {
    try {
      setLoading(true);
      const response = await GetExchequerByID(Number(id));
      if (response.status) {
        const { brand, stock, tlp_id, image } = response.data;
        form.setFieldsValue({
          brand,
          stock,
          tlp_id,
        });
        if (image) {
          setFileList([{ url: image, name: "Uploaded Image", status: "done" }]);
        }
      } else {
        message.error("Failed to fetch product data.");
      }
    } catch (error) {
      console.error("Error fetching exchequer data:", error);
      message.error("An error occurred while fetching product data.");
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

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

  const onFinish = async (values: exchequerInterface) => {
    setLoading(true);
    try {
      console.log("Original Values:", values);
  
      let imageBase64: string | undefined = undefined;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        imageBase64 = await convertFileToBase64(fileList[0].originFileObj);
      } else if (fileList.length > 0 && fileList[0].url) {
        imageBase64 = fileList[0].url;
      }
  
      const payload: exchequerInterface = {
        ...values,
        stock: parseInt(values.stock as any, 10), // แปลง stock เป็น number
        image: imageBase64,
      };
  
      console.log("Payload to send:", payload);
  
      const response = await UpdateExchequer(Number(id), payload);
      console.log("Response:", response);
  
      if (response.status === 200) {
        message.success("Product updated successfully.");
        navigate("/exchequers");
      } else {
        message.error(response.data?.error || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      message.error("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTypeLaundryProducts();
    fetchExchequer();
  }, []);

  return (
    <div style={{ backgroundColor: "#35a3d6", minHeight: "100vh", padding: "20px" }}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {contextHolder}
      <Card title="Edit Laundry Product" style={{ width: "100%", maxWidth: "500px" }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: "Please enter brand name!" }]}
          >
            <Input style={{ width: "100%", maxWidth: "400px", borderRadius:"40px", background:"transparent"}} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter stock quantity!" }]}
          >
            <Input type="number" style={{ width: "100%", maxWidth: "400px", borderRadius:"40px", background:"transparent"}} />
          </Form.Item>
          <Form.Item
            name="tlp_id"
            label="Type Laundry Product"
            rules={[{ required: true, message: "Please select a type!" }]}
          >
            <Select placeholder="Select type">
              {typeLaundryProducts.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.type_laundry_product}
                </Option>
              ))}
            </Select>
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
                Update
              </Button>
              <Button onClick={() => navigate("/exchequers")}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div></div>
  );
};

export default EditExchequer;
