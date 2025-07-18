import React, { useEffect, useState } from "react";
import { Card, Typography, message, Row, Col, Dropdown, Menu, Modal, Input, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { GetPosts, DeletePost, UpdatePost, GetUserById } from "../../services/https";
import { PostInterface } from "../../interfaces/PostInterface";
import img from "../../Page/Post/Aqua.png"; // รูปของผู้ใช้ Aquawash

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [_loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingPost, setEditingPost] = useState<PostInterface | null>(null);
  const [updatedCaption, setUpdatedCaption] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [currentUserStatus, setCurrentUserStatus] = useState<string>(""); // Store the current user's status

  // ดึงข้อมูลโพสต์
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await GetPosts();
      const fetchedPosts = response.data.data;
  
      // เรียงลำดับโพสต์จากใหม่สุด
      const sortedPosts = Array.isArray(fetchedPosts)
        ? fetchedPosts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
        : [];
  
      setPosts(sortedPosts);
    } catch (error) {
      messageApi.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };
  

  // ลบโพสต์
  const handleDelete = async (postId: number) => {
    try {
      await DeletePost(postId);
      setPosts(posts.filter((post) => post.ID !== postId));
      messageApi.success("Post deleted successfully.");
    } catch (error) {
      messageApi.error("Failed to delete post.");
    }
  };

  // แก้ไขโพสต์
  const handleEdit = (post: PostInterface) => {
    setEditingPost(post);
    setUpdatedCaption(post.caption || "");
    setUpdatedImage(post.image || "");
  };

  const handleUpdate = async () => {
    if (editingPost) {
      const updatedPost: PostInterface = {
        ...editingPost,
        caption: updatedCaption,
        image: updatedImage,
      };
      try {
        if (editingPost.ID !== undefined) {
          await UpdatePost(editingPost.ID, updatedPost);
        } else {
          messageApi.error("Post ID is undefined.");
        }
        setPosts(posts.map((post) => (post.ID === editingPost.ID ? updatedPost : post)));
        messageApi.success("Post updated successfully.");
        setEditingPost(null);
      } catch (error) {
        messageApi.error("Failed to update post.");
      }
    }
  };

  // Fetch the current user and set their status
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
        if (user.Status !== "Admin") {
          setCurrentUserStatus("User");
        } else {
          setCurrentUserStatus("Admin");
        }
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(208, 234, 245, 0.6)",
        padding: "20px",
        height: "100vh", // ใช้ขนาดเต็มหน้าจอ
      }}
    >
      {contextHolder}

      {/* คอนเทนเนอร์ของโพสต์ */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "95vh", // กำหนดความสูงสูงสุด
          overflowY: "auto", // เปิดการเลื่อนเฉพาะในพื้นที่นี้
          backgroundColor: "rgba(208, 234, 245, 0.1)",
          borderRadius: "8px",
          padding: "20px",
        }}
        className="post-list-container"
      >
        {posts.map((post) => {
          const menu = (
            <Menu>
              <Menu.Item key="1" onClick={() => handleEdit(post)}>
                แก้ไขโพสต์
              </Menu.Item>
              <Menu.Item key="2" onClick={() => post.ID && handleDelete(post.ID)}>
                ลบโพสต์
              </Menu.Item>
            </Menu>
          );

          return (
            <Card
              key={post.ID}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "20px", // เพิ่มช่องว่างระหว่างโพสต์
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Row gutter={16} align="middle" style={{ marginBottom: "10px" }}>
                <Col>
                  <img
                    src={img}
                    alt="User Avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col flex="auto">
                  <Typography.Title level={5} style={{ marginBottom: "0" }}>
                    Aquawash
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : "Unknown date"}
                  </Typography.Text>
                </Col>
                <Col>
                  {currentUserStatus === "Admin" && (
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <EllipsisOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
                    </Dropdown>
                  )}
                </Col>
              </Row>

              <Typography.Text style={{ display: "block", marginBottom: "10px", color: "#555" }}>
                {post.caption || "No caption provided."}
              </Typography.Text>

              {post.image ? (
                <img src={post.image} alt="Post" style={{ width: "100%", height: "auto" }} />
              ) : (
                <div
                  style={{
                    height: "300px",
                    backgroundColor: "#f0f2f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Image
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Modal
        title="Edit Post"
        visible={!!editingPost}
        onCancel={() => setEditingPost(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditingPost(null)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Input
          value={updatedCaption}
          onChange={(e) => setUpdatedCaption(e.target.value)}
          placeholder="Edit Caption"
          style={{ marginBottom: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default PostList;
