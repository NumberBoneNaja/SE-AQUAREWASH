import React, { useState, useEffect } from "react";

// Function to generate a random barcode

import { RewardInterface } from "../../interfaces/IReward";
import { Input, Button, message, Spin, Carousel } from "antd";
import { CreateHistoryReward, GetActiveReward, CheckRewardClaimed, GetUserById, UpdateUserByid } from "../../services/https";

import UserBar from "../../Components/Nav_bar/UserBar";
import poster4 from "../../Components/HomeCom/Add a heading.mp4";


function UserRewards() {
  const [rewards, setRewards] = useState<RewardInterface[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<RewardInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]); // เก็บรายการ ID ของรางวัลที่แลกแล้ว


  useEffect(() => {
    fetchRewards();
  }, []);



  const generateBarcode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };
  const fetchRewards = async () => {
    setLoading(true);
    try {
      const response = await GetActiveReward();
      if (response && Array.isArray(response)) {
        setRewards(response);
        setFilteredRewards(response);
        fetchClaimedRewards(response); // ตรวจสอบว่าแลกรางวัลไหนไปแล้ว
      }
    } catch (error: any) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูลรางวัล");
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimedRewards = async (rewards: RewardInterface[]) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) return;

      const claimed: number[] = [];
      for (const reward of rewards) {
        const result = await CheckRewardClaimed(userId, reward.ID!.toString());
        if (result?.claimed) {
          claimed.push(reward.ID!);
        }
      }
      setClaimedRewards(claimed);
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredRewards(
      rewards.filter((reward) =>
        reward.Name?.toLowerCase().includes(value) ||
        reward.Point?.toString().includes(value)
      )
    );
  };

  const handleClaim = async (reward: RewardInterface) => {
    const userId = parseInt(localStorage.getItem("id") || "0");
    if (!userId) {
      message.error("กรุณาเข้าสู่ระบบ");
      return;
    }

    if (reward.Limit && reward.Limit > 0) {
      try {
        const userResponse = await GetUserById(userId.toString());
        if (userResponse && userResponse.data) {
          const user = userResponse.data;

          if (user.Point < reward.Point) {
            message.error("คะแนนของคุณไม่เพียงพอสำหรับรับส่วนลดนี้");
            return;
          }

          const updatedReward = {
            ...reward,
            Limit: reward.Limit - 1,
          };

          const createHistoryPayload = {
            RewardID: reward.ID,
            Expire: reward.Endtime,
            State: "claimed",
            Barcode: generateBarcode(),
            UserID: userId,
          };

          const createHistoryResponse = await CreateHistoryReward(createHistoryPayload);
          if (createHistoryResponse) {
            const updatedUser = {
              ...user,
              Point: user.Point - reward.Point,
            };

            const updateUserResponse = await UpdateUserByid(userId.toString(), updatedUser);
            if (updateUserResponse) {
              // แทนที่ fetchRewards ด้วยการอัปเดตสถานะ
              setRewards((prevRewards) =>
                prevRewards.map((r) =>
                  r.ID === reward.ID ? updatedReward : r
                )
              );
              setClaimedRewards((prevClaimed) => [...prevClaimed, reward.ID!]);
              message.success(`คุณเก็บโค้ดส่วนลด "${reward.Name}" สำเร็จ!`);
            } else {
              message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้");
            }
          } else {
            message.error("เกิดข้อผิดพลาดในการสร้างประวัติรางวัล");
          }
        } else {
          message.error("ไม่พบข้อมูลผู้ใช้");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการเก็บโค้ด");
        console.error(error);
      }
    } else {
      message.warning("โค้ดนี้หมดแล้ว!");
    }
  };


  return (

    <>

      <div className="mt-2 w-full flex justify-center">
        {/* เพิ่มเงาเข้มให้ div */}

      </div>




      <div className="body"
        style={{
          background: "#F0CFF",
          minHeight: "120vh",


        }}
      >
        <UserBar page="rewards" />
        <div className="mt-2 w-full flex justify-center">
          <div className="w-[100%] max-w-[1400px] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <Carousel autoplay autoplaySpeed={5000}>
              <div className="flex justify-center items-center bg-black">
                <video
                  src={poster4}
                  autoPlay
                  loop
                  muted
                  controls={false}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </Carousel>
          </div>
        </div>

        <br></br>
        <h1
          style={{
            textAlign: "left",
            color: "#465B7E",
            marginBottom: "0px",
            marginLeft: "38vh",
            fontSize: "5vh",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // เพิ่มเงา
          }}
        >
          รางวัลส่วนลด
          <p
          style={{
            textAlign: "left",
            color: "#465B7E",
            marginBottom: "0px",
            marginLeft: "0vh",
            fontSize: "2vh",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", // เพิ่มเงาให้ข้อความคำอธิบาย
          }}
        >
          ใช้คะแนนของคุณแลกของรางวัลและส่วนลด
          <br />
          Use your points to get amazing discounts!
        </p>
          <Input
            placeholder="ค้นหาชื่อหรือคะแนน"
            value={searchTerm}
            onChange={handleSearch}
            style={{
              backgroundColor: "#fff",
              marginLeft: "0vh",
              marginTop: "0vh",
              textAlign: "left",
              width: "350px",
              position: "sticky",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid #00BBF0",
            }}
          />
        </h1>
        


        {loading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Spin tip="กำลังโหลดข้อมูล..." />
          </div>
        ) : (

          <div
            className="area-rewards"
            style={{
              justifyContent: "center",
             // background: "#69b7e1",
              width: "65%",
              position: "relative",
              minHeight: "50vh",
              margin: "0 auto",
              marginTop: "3vh",
            }}
          >
            <div
              className="rewards"
              style={{
                display: "grid",
              //  background: "#69b7e1",
                gridTemplateColumns: "repeat(3, 1fr)", // แสดง 3 คอลัมน์
                columnGap: "3vh", // ระยะห่างระหว่างคอลัมน์
                rowGap: "3vh", // ระยะห่างระหว่างแถว
                alignItems: "start",
              }}
            >
              {filteredRewards.map((reward) => (
                <div
                  key={reward.ID}
                  style={{
                    backgroundColor: "#FFF",
                    width: "100%",
                    height: "36vh", // กำหนดความสูงคงที่
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column", // จัดรูปแบบให้เนื้อหาวางเป็นแนวตั้ง
                    alignItems: "center",
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
                      width: "100%",
                      height: "150px", // กำหนดความสูงสำหรับส่วนรูปภาพ
                      backgroundColor: reward.ImagePath ? "transparent" : "#F0F0F0", // ใช้สีพื้นหลังกรณีไม่มีรูป
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {reward.ImagePath ? (
                      <img
                        src={reward.ImagePath}
                        alt={reward.Name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          color: "#AAA",
                          fontSize: "14px",
                        }}
                      >
                        No Image
                      </p>
                    )}
                  </div>

                  <div style={{ padding: "15px", textAlign: "center", width: "100%", flex: 1 }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#FF4D4F",
                        color: "#FFF",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {reward.Point} Points
                    </div>

                    <h3
                      style={{
                        margin: "10px 0 5px",
                        color: "#465B7E",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {reward.Name}
                    </h3>
                    <p
                      style={{
                        margin: "5px 0",
                        color: "#777",
                        fontSize: "14px",
                      }}
                    >
                      Valid until: {reward.Endtime}
                    </p>
                    <p
                      style={{
                        margin: "10px 0",
                        color: "#FF4D4F",
                        fontWeight: "bold",
                        fontSize: "16px",
                        fontStyle: "italic",
                        background: "linear-gradient(90deg, #FF4D4F, #FF7F50)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "1.5px",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      🎉 {reward.RewardTypeID === 1
                        ? `${reward.Discount * 100}% Off`
                        : reward.RewardTypeID === 3
                          ? "รางวัลใหญ่"
                          : `฿${reward.Discount} Off`}
                    </p>


                    <Button
                      type="primary"
                      disabled={reward.Limit === 0 || claimedRewards.includes(reward.ID!)}
                      onClick={() => handleClaim(reward)}
                      style={{
                        width: "100%",
                        backgroundColor:
                          reward.Limit === 0 || claimedRewards.includes(reward.ID!)
                            ? "#CCC"
                            : "#00BBF0",
                        borderColor:
                          reward.Limit === 0 || claimedRewards.includes(reward.ID!)
                            ? "#CCC"
                            : "#00BBF0",
                        color: "#FFF",
                        fontSize: "16px",
                        height: "40px",
                      }}
                    >
                      {claimedRewards.includes(reward.ID!)
                        ? "Claimed"
                        : reward.Limit > 0
                          ? "Redeem Now"
                          : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>



        )}
      </div></>
  );
}

export default UserRewards;
