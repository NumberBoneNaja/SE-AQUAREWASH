import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, message, Space, List, Drawer, InputNumber, Popover } from "antd";
import { GetAllExchequers, GetAllTypeLaundryProducts } from "../../services/https";
import { exchequerInterface } from "../../interfaces/exchequerInterface";
import { TypeLaundryProductInterface } from "../../interfaces/typeLaundryProductInterface";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";

const SelectProduct: React.FC = () => {
  const [products, setProducts] = useState<exchequerInterface[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<exchequerInterface[]>([]);
  const [typeLaundryProducts, setTypeLaundryProducts] = useState<TypeLaundryProductInterface[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [cart, setCart] = useState<exchequerInterface[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await GetAllExchequers();
      if (response.status) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        message.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("An error occurred while fetching products.");
    }
  };

  const fetchTypeLaundryProducts = async () => {
    try {
      const response = await GetAllTypeLaundryProducts();
      if (response.status) {
        setTypeLaundryProducts(response.data);
      } else {
        message.error("Failed to fetch product types.");
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
      message.error("An error occurred while fetching product types.");
    }
  };

  const handleFilterByType = (typeId: number | null) => {
    setSelectedType(typeId);
    if (typeId !== null) {
      setFilteredProducts(products.filter((product) => product.tlp_id === typeId));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleAddToCart = (product: exchequerInterface) => {
    if (!cart.some((item) => item.id === product.id)) {
      setCart([...cart, { ...product, quantity: 1 }]);
      message.success(`${product.brand} added to cart.`);
    } else {
      message.warning(`${product.brand} is already in the cart.`);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    message.success("Product removed from cart.");
  };

  const handleConfirm = () => {
    if (cart.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }
    navigate("/withdraw", { state: { cart } });
  };

  useEffect(() => {
    fetchProducts();
    fetchTypeLaundryProducts();
  }, []);

  return (
    <>
      <EmployeeBar page="" />
      <h2 style={{ padding: "25px", paddingBottom: "25px", backgroundColor: "#24292e" }}>
        <p style={{ color: "#F0F0F0", fontSize: "25px" }}>
          <b>Select Products</b>
        </p>
      </h2>
      <div style={{ padding: "5px", paddingTop: "0px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6} md={6} lg={4}>
            <Space direction="vertical" style={{ width: "100%", padding: "2px", height: "100%" }}>
              <h3 style={{ padding: "10px" }}>
                <p style={{ fontSize: "20px" }}>
                  <b>ประเภทสินค้า</b>
                </p>
              </h3>
              <List
                style={{ width: "100%" }}
                dataSource={[{ id: null, type_laundry_product: "ทั้งหมด" }, ...typeLaundryProducts]}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      backgroundColor: item.id === selectedType ? "rgba(199, 199, 199,1)" : "white",
                      padding: "15px",
                    }}
                    onClick={() => handleFilterByType(item.id)}
                  >
                    {item.type_laundry_product}
                  </List.Item>
                )}
              />
            </Space>
          </Col>
          <Col xs={24} sm={18} md={18} lg={20}>
            <div
              style={{
                backgroundColor: "#A5DEF2",
                padding: "15px",
                minHeight: "calc(100vh - 150px)",
              }}
            >
              <Row gutter={[16, 16]}>
                {filteredProducts
                  .sort((a, b) => (a.stock === 0 ? 1 : b.stock === 0 ? -1 : 0))
                  .map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={4}>
                      <Popover
                        content={
                          <div>
                            <p><b>Brand:</b> {product.brand}</p>
                            <p><b>Stock:</b> {product.stock}</p>
                            <p>
                              <b>Type:</b>{" "}
                              {
                                typeLaundryProducts.find((type) => type.id === product.tlp_id)
                                  ?.type_laundry_product || "N/A"
                              }
                            </p>
                            <img
                              src={product.image || "placeholder.jpg"}
                              alt={product.brand}
                              style={{ width: "150px", borderRadius: "8px" }}
                            />
                          </div>
                        }
                        title="Product Details"
                        trigger="click"
                        placement="right"
                      >
                        <Card
                          hoverable
                          cover={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "175px",
                              }}
                            >
                              <img
                                alt={product.brand}
                                src={product.image || "placeholder.jpg"}
                                style={{
                                  width: "98%",
                                  height: "auto",
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                  filter: product.stock === 0 ? "grayscale(100%)" : "none",
                                }}
                              />
                            </div>
                          }
                          style={{
                            backgroundColor: product.stock === 0 ? "#d3d3d3" : "#35a3d6",
                            border: "1px solid #35a3d6",
                            borderRadius: "8px",
                            cursor: product.stock === 0 ? "not-allowed" : "pointer",
                            width: "200px",
                            padding: "10px",
                            color: "#fbfbfb",
                          }}
                          actions={
                            (product.stock ?? 0) > 0
                              ? [
                                  <Button
                                    type="primary"
                                    onClick={() => handleAddToCart(product)}
                                    style={{
                                      backgroundColor: "#f73859",
                                      color: "white",
                                      border: "none",
                                    }}
                                  >
                                    Add to Cart
                                  </Button>,
                                ]
                              : []
                          }
                        >
                          <Card.Meta
                            title={<span style={{ color: "#fbfbfb" }}>{product.brand}</span>}
                            description={
                              <span style={{ color: "#fbfbfb" }}>
                                จำนวน: {product.stock} <br />
                                ประเภท:{" "}
                                {typeLaundryProducts.find((type) => type.id === product.tlp_id)
                                  ?.type_laundry_product || "N/A"}
                              </span>
                            }
                          />
                        </Card>
                      </Popover>
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
        <Button
          type="primary"
          shape="circle"
          icon={<ShoppingCartOutlined />}
          style={{
            position: "fixed",
            top: "75px",
            right: "25px",
            zIndex: 1000,
            backgroundColor: "#f73859",
          }}
          onClick={() => setDrawerVisible(true)}
        >
          {cart.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-10px",
                right: "-5px",
                backgroundColor: "#35a3d6",
                borderRadius: "50%",
                color: "white",
                padding: "1px 7px",
              }}
            >
              {cart.length}
            </span>
          )}
        </Button>
        <Drawer
          title="Laundry Cart"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width={400}
        >
          {cart.length === 0 ? (
            <p>No products in the cart.</p>
          ) : (
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <img
                      src={item.image || "placeholder.jpg"}
                      alt={item.brand}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <p>{item.brand}</p>
                      <Space>
                        <Button
                          onClick={() =>
                            handleQuantityChange(item.id, (item.quantity || 1) - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          -
                        </Button>
                        <InputNumber
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(item.id, value || 1)
                          }
                        />
                        <Button
                          onClick={() =>
                            handleQuantityChange(item.id, (item.quantity || 1) + 1)
                          }
                          disabled={item.quantity === item.stock}
                        >
                          +
                        </Button>
                      </Space>
                    </div>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFromCart(item.id)}
                      style={{ color: "red" }}
                    />
                  </div>
                </List.Item>
              )}
            />
          )}
          {cart.length > 0 && (
            <Button
              type="primary"
              block
              style={{ marginTop: "10px" }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          )}
        </Drawer>
      </div>
    </>
  );
};

export default SelectProduct;
