import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Image, Space, Button, message, Popconfirm, Typography } from "antd";
import { AppstoreAddOutlined,PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table"; // Import ColumnsType
import { GetAllExchequers, DeleteExchequer } from "../../services/https";
import { exchequerInterface } from "../../interfaces/exchequerInterface";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";

const ExchequerList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exchequers, setExchequers] = useState<exchequerInterface[]>([]);
  const navigate = useNavigate();

  const fetchExchequers = async () => {
    setLoading(true);
    try {
      const response = await GetAllExchequers();
      if (response.status) {
        setExchequers(response.data);
      } else {
        message.error("Failed to fetch exchequer data.");
      }
    } catch (error) {
      console.error("Error fetching exchequers:", error);
      message.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchequers();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await DeleteExchequer(id);
      if (response.status === 200) {
        message.success("Product deleted successfully.");
        setExchequers((prev) => prev.filter((item) => item.id !== id));
      } else {
        message.error(response.data?.error || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting exchequer:", error);
      message.error("An error occurred while deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id?: number) => {
    if (!id) return;
    navigate(`/exchequers/edit/${id}`);
  };

  const handleAddProduct = () => {
    navigate("/Addproduct");
  };

  const handleStore = () => {
    navigate("/shop");
  };

  const columns: ColumnsType<exchequerInterface> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (image: string) =>
        image ? <Image width={100} src={image} alt="Product Image" /> : "No Image",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "tlp",
      key: "tlp",
      align: "center",
      render: (tlp: any) => (tlp?.type_laundry_product || "Unknown"),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: any, record: exchequerInterface) => (
        <Space style={{ justifyContent: "center" }}>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <EmployeeBar page="Exchequers" />
      <EmSidebar page="*" />

      <Card style={{ backgroundColor: "#fbfbfb", paddingLeft: "55px", paddingBottom: "20px" }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Exchequer List
        </Typography.Title>
        
        <div style={{ marginBottom: "10px", textAlign: "right" }}>   
          <Button type="primary" onClick={handleStore} style={{ marginRight: "10px",backgroundColor:"#f73859" }}>
          <AppstoreAddOutlined />
            เบิกสินค้า
          </Button>
          <Button type="primary" onClick={handleAddProduct} >
            <PlusOutlined/>
            เพิ่มสินค้า
          </Button>
        </div>
        <div style={{ backgroundColor: "#35a3d6", padding: "20px", borderRadius: "10px" }}>
          <Table
            columns={columns}
            dataSource={exchequers}
            rowKey={(record) => record.id || ""}
            loading={loading}
            pagination={{ pageSize: 5 }}
            className="custom-table"
            style={{ overflowX: "auto", alignItems: "center" }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ExchequerList;
