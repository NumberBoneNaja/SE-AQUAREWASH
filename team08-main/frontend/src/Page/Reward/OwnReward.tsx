import { useEffect, useState } from "react";
import { Input, Spin, message, Button, Modal, QRCode } from "antd";
import { GetRewardsWithHistoryByUserID } from "../../services/https";
import UserBar from "../../Components/Nav_bar/UserBar";
import logo from "./logo.jpg";
function UserHistoryRewards() {
  const [historyRewards, setHistoryRewards] = useState<any[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);



  useEffect(() => {
    const fetchHistoryRewards = async () => {
      setLoading(true);
      const userId = parseInt(localStorage.getItem("id") || "0", 10);
      if (!userId) {
        message.error("User ID is missing!");
        setLoading(false);
        return;
      }

      try {
        const response = await GetRewardsWithHistoryByUserID(userId.toString());
        if (response) {
          setHistoryRewards(response);
          setFilteredRewards(response);
        } else {
          message.error("คุณไม่มีส่วนลด.");
        }
      } catch (error) {
        message.error("An error occurred while fetching history rewards.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryRewards();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredRewards(
      historyRewards.filter(
        (reward) =>
          reward.reward_name.toLowerCase().includes(value) ||
          reward.discount.toString().includes(value)
      )
    );
  };

  const showModal = (reward: any) => {
    setSelectedReward(reward);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedReward(null);
  };

  return (


    <body
      style={{
        backgroundColor: "#F0FCFF",
        minHeight: "100vh",

      }}
    >

      <UserBar page={"Reward"} />
      <div style={{ textAlign: "left", color: "#105575", marginLeft: "43vh", marginTop: "6vh"}}>
        <h1 style={{ fontSize: "2.5em", marginBottom: "0.5em" }}>
          ส่วนลดและรางวัลของคุณ
        </h1>
        <p style={{ fontSize: "1.2em"  }}>
          รางวัลและส่วนลดของคุณที่คุณได้รับจากการแลกเปลี่ยนคะแนน
          <br />
          your rewards and discounts that you have received from exchanging points
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "85vh",
          marginTop: "-5vh"
        }}
      >
        <Input
          placeholder="ค้นหาชื่อหรือคะแนน"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "300px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid #00BBF0",
            padding: "10px",
          }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin tip="กำลังโหลดข้อมูล..." />
        </div>
      ) : (

        <div
          className="reward-container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <div
            className="reward-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              padding: "20px",
              borderRadius: "8px",
              width: "100%", // ใช้ความกว้างแบบยืดหยุ่น
              // height: "700px", // ลบความสูงแบบคงที่
              overflow: "auto",
              margin: "0 auto",
            }}
          >
            {filteredRewards.map((reward: any) => (
              <div
                key={reward.reward_id}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                  minHeight: "300px", // ตั้งค่าความสูงขั้นต่ำ
                }}
              >
                {reward.image_path ? (
                  <img
                    src={reward.image_path}
                    alt={reward.reward_name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "#F0F0F0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No Image
                  </div>
                )}
                <h3
                  style={{
                    color: "#465B7E",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    textAlign: "left",
                    marginTop: "2vh",
                  }}
                >
                  {reward.reward_name || "Unknown Reward"}
                </h3>
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#888888",
                    textAlign: "left",
                    marginTop: "0",
                  }}
                >
                  หมดอายุ:{" "}
                  {reward.history_expire
                    ? new Date(reward.history_expire).toLocaleDateString()
                    : "N/A"}
                </p>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#00BBF0",
                    borderColor: "#00BBF0",
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={() => showModal(reward)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>






      )}

      {selectedReward && (
        <Modal
          title="Reward Details"
          visible={isModalVisible}
          onCancel={closeModal}
          footer={null}
        >
          {selectedReward.image_path && (
            <img
              src={selectedReward.image_path}
              alt={selectedReward.reward_name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            />
          )}
          <h3>{selectedReward.reward_name}</h3>
          {selectedReward.reward_type !== "things" && (
            <p>
              <strong>Discount:</strong>{" "}
              {selectedReward.discount % 1 !== 0
                ? `${selectedReward.discount * 100}%`
                : `${selectedReward.discount} บาท`}
            </p>
          )}

          <p>
            <strong>Expiration Date:</strong>{" "}
            {selectedReward.history_expire
              ? new Date(selectedReward.history_expire).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {new Date() <= new Date(selectedReward.history_expire || "") ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Expired</span>
            )}
          </p>
          {/* เงื่อนไขในการแสดง QR โค้ดเฉพาะเมื่อ RewardTypeID เท่ากับ 3 */}
          {selectedReward.reward_type == "things" && (
            <p>
              <strong>Qrcode ยืนยันรางวัล:</strong>{" "}
              <QRCode
                errorLevel="H"
                value={`${selectedReward.discount}`} // ตั้งค่า QR โค้ดเป็นส่วนลด
                icon={logo}
                size={128} // ขนาดของ QR โค้ด (ปรับได้ตามต้องการ)
                includeMargin={true}
              />
            </p>
          )}
        </Modal>
      )}
    </body>
  );
}

export default UserHistoryRewards;
