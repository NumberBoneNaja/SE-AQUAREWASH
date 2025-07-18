import { useState, useEffect } from "react";
import { MachinesInterface } from "../../interfaces/Machine";
import { Button, Modal, Select, message, Tooltip } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { GetAllMachine, GetUserById, CreateBooking, CreateBooks, getLastBooks, CreatePaymentFromBooking, getRewardsBooking, getMachineBookingInfo } from "../../services/https";
import machineImage from './Group 799.png'; // นำเข้ารูปภาพ
import UserBar from '../../Components/Nav_bar/UserBar';
import { useNavigate } from "react-router-dom";
import { PaymentInterface } from "../../interfaces/IPayment";

function Viewtable() {
    const [machine, setMachines] = useState<MachinesInterface[]>([]); //เก็บเครื่องซักผ้า
    const [selectedMachines, setSelectedMachines] = useState<MachinesInterface[]>([]); // เก็บเครื่องที่เลือก
    const [currentTime, setCurrentTime] = useState<string>(""); // เก็บเวลาปัจจุบัน
    const [totalPrice, setTotalPrice] = useState<number>(0);  // เพิ่มตัวแปรสำหรับคำนวณราคา
    const [userId, setUserId] = useState<string | null>(null);  // เก็บ user_id
    const [_userInfo, setUserInfo] = useState<any>(null);  // เก็บข้อมูลของ user
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>("available"); // ตัวเลือกการเรียงลำดับ
    const navigate = useNavigate();
 
    const [rewards, setRewards] = useState<any[]>([]);  // สร้าง state เพื่อเก็บข้อมูลรางวัล
    const [selectedReward, setSelectedReward] = useState<any | null>(null);  // ค่าเริ่มต้นเป็น null
    const [machineBookingInfo, setMachineBookingInfo] = useState<any[]>([]); //






    useEffect(() => {
        const fetchMachineBookingInfo = async () => {
            try {
                const response = await getMachineBookingInfo(); // เรียก API
                setMachineBookingInfo(response); // เก็บข้อมูลใน state
            } catch (error) {
                console.error("Error fetching machine booking info:", error);
            }
        };

        fetchMachineBookingInfo();
    }, []);


    // ฟังก์ชันในการดึงข้อมูลเครื่อง
    const fetchMachines = async () => {
        try {
            let res = await GetAllMachine();
            console.log("res is: ", res);
            if (res && res.status === 200) {
                const machines: MachinesInterface[] = res.data;
                setMachines(machines);
            } else {
                message.error("ไม่สามารถโหลดข้อมูลเครื่องซักผ้าได้");
            }
        } catch (error) {
            console.error("Error fetching machines:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
    };


    const fetchUserInfo = async () => {
        if (userId) {
            try {
                const response = await GetUserById(userId);  // เรียก API ด้วย userId
                if (response) {
                    setUserInfo(response.data);  // เก็บข้อมูลผู้ใช้ใน state
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        }
    };



    useEffect(() => {
        if (userId) {
            fetchUserInfo();  // ดึงข้อมูลผู้ใช้เมื่อ userId มีค่า
        }
    }, [userId]);  // เมื่อ userId เปลี่ยนแปลงให้ดึงข้อมูลใหม่



    useEffect(() => {
        const storedUserId = localStorage.id;  // ดึง user_id จาก localStorage
        if (storedUserId) {
            setUserId(storedUserId);
            console.log("loging", localStorage.id);  // ตั้งค่า userId ใน state
        } else {
            console.log("User not logged in");  // ถ้าไม่มี user_id ใน localStorage
        }
    }, []);

    

    // ฟังก์ชันในการตั้งเวลา
    const setCurrentDateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, "0");  // เอาชั่วโมง
        const minutes = date.getMinutes().toString().padStart(2, "0");  // เอานาที
        const formattedTime = `${hours}:${minutes}`;
        setCurrentTime(formattedTime);  // เซ็ตเวลาใน state
    };

    useEffect(() => {
        fetchMachines();
        setCurrentDateTime();  // ตั้งเวลาปัจจุบันเมื่อโหลดคอมโพเนนต์

        // การอัพเดตเวลาทุกๆ 1 วินาที
        const intervalId = setInterval(setCurrentDateTime, 1000);

        return () => clearInterval(intervalId); // ลบ interval เมื่อ component ถูกทำลาย
    }, []);


    useEffect(() => {
        // Set background color for body
        document.body.style.backgroundColor = "#F0FCFF";

        // Cleanup on component unmount
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);
    const showModal = () => {
        if (selectedMachines.length === 0) {
            message.error("กรุณาเลือกเครื่องอย่างน้อย 1 เครื่อง");
        } else {
            setIsModalVisible(true);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const updateTotalPrice = (machine: MachinesInterface, action: string) => {
        let price = machine.machine_type === "ซัก" ? 80 : 60;  // 80 บาทสำหรับเครื่องซัก, 60 บาทสำหรับเครื่องอบ
        if (action === "add") {
            setTotalPrice(prevPrice => prevPrice + price);  // เพิ่มราคาเมื่อเลือกเครื่อง
        } else if (action === "remove") {
            setTotalPrice(prevPrice => prevPrice - price);  // ลดราคาเมื่อยกเลิกเครื่อง
        }
    };
    // ฟังก์ชันเลือกเครื่อง
    const handleMachineSelect = (machine: MachinesInterface) => {
        if (!selectedMachines.find((m) => m.ID === machine.ID) && machine.status !== "ไม่ว่าง" && machine.status !== "ซ่อมแซม") {
            setSelectedMachines((prev) => [...prev, machine]);
            updateTotalPrice(machine, "add"); // อัพเดตราคาเมื่อเลือกเครื่อง
        } else if (machine.status === "ไม่ว่าง") {
            message.error(`อยู่ในสถานะพักใช้งาน`);
        } else if (machine.status === "ซ่อมแซม") {
            message.error(`อยู่ในสถานะพักใช้งาน`);
        } else {
            setSelectedMachines((prev) => prev.filter((m) => m.ID !== machine.ID));
            updateTotalPrice(machine, "remove"); // อัพเดตราคาเมื่อยกเลิกเครื่อง
        }
    };

    const calculateDiscountedPrice = (price: number): number => {
        if (!selectedReward || !selectedReward.reward_type || !selectedReward.discount) {
            return price; // คืนราคาเดิมถ้าไม่มีส่วนลด
        }

        if (selectedReward.reward_type === "percent") { // ส่วนลดเปอร์เซ็นต์
            return price * (1 - selectedReward.discount);
        } else if (selectedReward.reward_type === "discount") { // ส่วนลดคงที่
            return Math.max(price - selectedReward.discount, 0);
        }

        return price; // คืนราคาเดิมในกรณีอื่น
    };



    // ฟังก์ชันสำหรับการส่งข้อมูลการจอง
    const handleSubmitBooking = async () => {
        if (selectedMachines.length === 0) {
            message.error("กรุณาเลือกเครื่องอย่างน้อย 1 เครื่อง");
            return;
        }

        const discountedPrice = calculateDiscountedPrice(totalPrice); // คำนวณราคาหลังส่วนลด

        try {
            const lastBook = await getLastBooks(); // ดึง ID ล่าสุดของ books
            const newBookId = lastBook?.ID ? lastBook.ID + 1 : 1;

            const booksData = {
                ID: 0,
                Price: discountedPrice, // ใช้ราคาหลังส่วนลด
                Status: 'ส่งการจอง',
                books_start: (() => {
                    const endTime = new Date(); // สร้างวันที่เริ่มต้นใหม่
                    endTime.setHours(endTime.getHours() + 7); // เพิ่มเวลา 1 ชั่วโมง
                    return endTime;
                })(),
                books_end: (() => {
                    const endTime = new Date(); // สร้างวันที่เริ่มต้นใหม่
                    endTime.setHours(endTime.getHours() + 8); // เพิ่มเวลา 1 ชั่วโมง
                    return endTime;
                })(),
                user_id: Number(localStorage.id),
            };


            const createdBook = await CreateBooks(booksData); // สร้างข้อมูล books

            if (createdBook) {
                const bookingDetailsData = selectedMachines.map((machine) => ({
                    ID: 0,
                    machine_id: machine.ID as number,
                    books_id: newBookId,
                }));

                // เรียกใช้ CreateBooking เพื่อสร้างข้อมูลตารางกลาง
                const createdBookingDetails = await CreateBooking(bookingDetailsData);

                if (createdBookingDetails) {
                    const paymentData: PaymentInterface = {
                        Price: discountedPrice,
                        PaymentStatusID:1,
                        PaymentStart: new Date(),
                        BookID: newBookId,
                        UserID: Number(localStorage.id),
                    };

                    const createdPayment = await CreatePaymentFromBooking(paymentData);

                    if (createdPayment) {
                        message.success("บันทึกการจองและการชำระเงินเรียบร้อย");
                        const machineIds = selectedMachines.map((machine) => machine.ID); // เก็บ machine_id ทั้งหมด
                        setTimeout(() => {
                            navigate(`/PayBooking/${createdPayment.data.ID}`, { state: { machineIds } });
                        });
                    }
                } else {
                    message.error("เกิดข้อผิดพลาดในการสร้างข้อมูลตารางกลาง");
                }
            }
        } catch (error) {
            console.error("Error submitting booking:", error);
            message.error("เกิดข้อผิดพลาดในการบันทึกการจอง");
        }
    };







    const calculateEndTime = (currentTime: any) => {
        const [hours, minutes] = currentTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hours + 1, minutes, 0); // เพิ่ม 1 ชั่วโมง
        return date.toTimeString().slice(0, 5); // คืนค่าในรูปแบบ HH:MM
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
        let sortedMachines;
        if (value === "เครื่องซักผ้า") {
            sortedMachines = [...machine].sort((a, b) => {
                if (a.machine_type === "เครื่องซักผ้า" && b.machine_type !== "เครื่องซักผ้า") return -1;
                if (a.machine_type !== "เครื่องซักผ้า" && b.machine_type === "เครื่องซักผ้า") return 1;
                return 0;
            });
        } else if (value === "เครื่องอบผ้า") {
            sortedMachines = [...machine].sort((a, b) => {
                if (a.machine_type === "เครื่องอบผ้า" && b.machine_type !== "เครื่องอบผ้า") return -1;
                if (a.machine_type !== "เครื่องอบผ้า" && b.machine_type === "เครื่องอบผ้า") return 1;
                return 0;
            });
        } else {
            sortedMachines = [...machine]; // Default order
        }
        setMachines(sortedMachines);
    };





    const handleFetchRewards = async () => {
        if (userId) {
            try {
                const data = await getRewardsBooking(userId);
                console.log("Rewards:", data);
                setRewards(data); // บันทึกข้อมูลรางวัลลงใน state
            } catch (error) {
                console.error("Error fetching rewards:", error);
            }
        }
    };
    useEffect(() => {
        handleFetchRewards(); // เรียกใช้ฟังก์ชันดึงข้อมูลรางวัล
    }, [userId]); // ดึงข้อมูลใหม่เมื่อ userId เปลี่ยน




    return (

        <>
            <div
                style={{
                    position: "fixed", // หรือ "fixed" หากต้องการล็อกตำแหน่ง
                    top: "0", // ระยะห่างจากด้านบน
                    left: "50%", // กึ่งกลางหน้าจอ
                    transform: "translateX(-50%)", // จัดกึ่งกลางแนวนอน
                    width: "100%", // กำหนดขนาดกว้าง
                    zIndex: 10, // ปรับลำดับให้แน่ใจว่าอยู่เหนือ/ใต้ตามต้องการ
                }}
            >
                <UserBar page="Booking" />
            </div>

            <div
                style={{
                    position: "fixed",
                    top: "16%", // ระยะห่างจากด้านบนคงเดิม
                    left: "50%", // ใช้ 50% เพื่อให้อยู่กึ่งกลางแนวนอน
                    transform: "translateX(-50%)", // ปรับให้กึ่งกลางจริง ๆ
                    width: "45%",
                    height: "15%",
                    padding: "20px",
                    backgroundColor: "#F9F9F9",
                    borderRadius: "4vh ",
                    textAlign: "left",
                    fontSize: "145%",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 100px rgba(0, 0, 0, 0.2)", // เพิ่มเงา
                    zIndex: 1,
                    fontFamily: "Tahoma, sans-serif",
                }}

            >
                <div style={{ marginTop: "0%" }}><h2>จองเครื่องซักอบ</h2></div>
                {/* แสดงเวลาปัจจุบัน */}
                <div style={{ textAlign: "right", marginTop: "-3%", marginRight: "5%", fontWeight: "bold", }}>เวลาจอง: {currentTime}</div>
                <div
                    style={{
                        marginTop: "10px",
                        textAlign: "right",
               
                        fontWeight: "bold",
                        position: "absolute",
                        marginLeft: "69%",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" ,marginRight:"0%",fontSize:"80%"}}>
                        <div>
                            ราคา:{" "}
                            <span
                                style={{
                                    color: selectedReward ? "grey" : "red", // เปลี่ยนสีถ้ามีส่วนลด
                                    textDecoration: selectedReward ? "line-through" : "none", // ขีดเส้นฆ่าเมื่อมีส่วนลด
                                }}
                            >
                                {totalPrice} บาท
                            </span>
                        </div>
                        <div style={{ visibility: selectedReward ? "visible" : "hidden" }}>
                            ราคาหลังส่วนลด:{" "}
                            <span style={{ color: "red" }}>
                                {calculateDiscountedPrice(totalPrice)} บาท
                            </span>
                        </div>
                    </div>
                </div>





                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16%",
                        marginLeft: "-15%",
                        width: "54%",
                        height: "10%"
                    }}
                >



                    ตัวเลือกการจัดเรียง
                    <Select
                        value={sortOption}
                        onChange={(value) => {
                            handleSortChange(value);
                        }}
                        style={{
                            width: "50%",
                            height: "400%",
                            borderRadius: "8px",
                            backgroundColor: "#FBFBFB",
                            color: sortOption === "เครื่องซักผ้า" || sortOption === "เครื่องอบผ้า" ? "#FFFFFF" : "#24292E", // ปรับสีข้อความเมื่อเลือก
                            boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.2)", // เงาด้านใน
                            border: "2px solid #00BBF0",
                        }}
                        dropdownStyle={{
                            backgroundColor: "#E8E8E8",
                            borderRadius: "8px",
                            boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Select.Option
                            value="เครื่องซักผ้า"
                            style={{
                                backgroundColor: sortOption === "เครื่องซักผ้า" ? "#1287BC" : "#00BBF0", // พื้นหลังเปลี่ยนเป็นสีฟ้าเข้ม
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                margin: "4px",
                                borderRadius: "4px",
                                boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            เรียงเครื่องซักก่อน
                        </Select.Option>
                        <Select.Option
                            value="เครื่องอบผ้า"
                            style={{
                                backgroundColor: sortOption === "เครื่องอบผ้า" ? "#1287BC" : "#00BBF0", // พื้นหลังเปลี่ยนเป็นสีแดงเมื่อถูกเลือก
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                margin: "4px 0",
                                borderRadius: "4px",
                                boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            เรียงเครื่องอบก่อน
                        </Select.Option>
                    </Select>




                </div>
            </div>

            {/* div หลัก */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "left", // ยังคงจัด content ด้านในไปทางซ้าย
                    marginLeft: "auto", // ปรับให้อยู่ตรงกลางในแนวนอน
                    marginRight: "auto", // ปรับให้อยู่ตรงกลางในแนวนอน
                    padding: "1%",
                    borderRadius: "16vh 16vh 0% 0%",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "20px 20px 100px rgba(0, 0, 0, 0.3)", // เพิ่มเงา
                    width: "70%", // กำหนดความกว้าง
                    height: "78vh",
                    overflow: "auto",
                    position: "relative",
                    marginTop: "10.4%",
                }}

            >



                <div
                    style={{
                        marginTop: "30%",
                        marginLeft: "71%",
                        position: "absolute",
                        width: "24%",
                        height:"17%",
                        borderRadius: "40% 40% 0 0", // มุมโค้งมน
                        padding: "20px", // เพิ่มช่องว่างภายใน
                
                        color: "white", // สีข้อความ
                    }}
                >
                    <h2 style={{textAlign: "center", marginBottom: "5%",fontSize:"150%" ,color:"black"}}>
                        เลือกส่วนลด
                    </h2>
                    <Select
                        style={{
                            width: "100%",
                            backgroundColor: "#FFFFFF", // พื้นหลัง Select สีขาว
                            border: "1px solid #66CCFF", // ขอบสีฟ้าสดใส
                            borderRadius: "5px", // มุมโค้งมน
                        }}
                        placeholder="เลือกส่วนลด"
                        value={selectedReward?.reward_name || "ไม่ใช้ส่วนลด"} // แสดง "ไม่ใช้ส่วนลด" เป็นค่า default
                        onChange={(value) => {
                            if (value === "none") {
                                setSelectedReward(null); // ถ้าเลือก "ไม่ใช้ส่วนลด" ให้ตั้งเป็น null
                            } else {
                                const reward = rewards.find((r) => r.reward_id === value); // หา Reward ที่ตรงกับ ID
                                setSelectedReward(reward); // เก็บ Reward ที่เลือก
                            }
                        }}
                        dropdownStyle={{
                            backgroundColor: "#003366", // พื้นหลัง Dropdown
                            color: "#FFFFFF", // สีข้อความ Dropdown
                        }}
                    >
                        <Select.Option value="none" style={{ color: "#FFFFFF" }}>
                            ไม่ใช้ส่วนลด
                        </Select.Option>
                        {rewards &&
                            rewards.map((reward) => (
                                <Select.Option
                                    key={reward.reward_id}
                                    value={reward.reward_id}
                                    style={{ color: "#FFFFFF" }} // สีข้อความ Option
                                >
                                    {reward.reward_name} - ส่วนลด:{" "}
                                    {reward.reward_type === "percent"
                                        ? `${reward.discount * 100}%`
                                        : `${reward.discount} บาท`}
                                </Select.Option>
                            ))}
                    </Select>
                </div>

                <div
                    style={{
                        position: "absolute", // ใช้ absolute เพื่อให้อยู่ในตำแหน่งอิงกับ parent ที่ relative
                        width: "20%",
                        top: "190px", // ระยะห่างจากด้านบน
                        right: "-70px", // ระยะห่างจากด้านขวา

                    }}
                >
                    {/* ไอเท็มสถานะ */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#D9D9D9", // สีเทา: ซ่อมแซม
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        ></div>
                        <span style={{ fontSize: "14px", color: "#333" }}>ซ่อมแซม</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#F73859", // สีแดง: กำลังซัก
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        ></div>
                        <span style={{ fontSize: "14px", color: "#333" }}>กำลังซัก</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#00BBF0", // สีฟ้า: เลือก
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        ></div>
                        <span style={{ fontSize: "14px", color: "#333" }}>เลือก</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#FFFFFF", // สีขาว: ว่าง
                                borderRadius: "50%",
                                marginRight: "10px",
                                border: "1px solid #D9D9D9",
                            }}
                        ></div>
                        <span style={{ fontSize: "14px", color: "#333" }}>ว่าง</span>
                    </div>
                </div>



                <div
                    style={{

                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "left",
                        marginLeft: "6%",
                        gap: "3%",
                        marginTop: "14%",
                        backgroundColor: "#f9f9f9",
                        width: "55%",
                        height: "71%",
                        overflow: "auto",
                        position: "relative",
                        padding: "3%", // เพิ่มระยะห่างจากขอบ

                    }}
                >

                    {machine.map((machine) => (

                        <Tooltip
                            title={
                                <div style={{ color: "#fff", fontSize: "14px", lineHeight: "1.5", textAlign: "left" }}>
                                    <p style={{ margin: "0", fontWeight: "bold" }}>{machine.brand} {machine.m_model}</p>
                                    <p style={{ margin: "0" }}>ขนาด: {machine.capacity} kg.</p>
                                    <p style={{ margin: "0" }}>สถานะ: {machine.status}</p>
                                    <p style={{ margin: "0" }}>ประเภท: {machine.machine_type}</p>

                                    {/* เพิ่มการตรวจสอบว่า machineBookingInfo มีค่าและมีข้อมูลการจอง */}
                                    {machineBookingInfo && machineBookingInfo.length > 0 &&
                                        machineBookingInfo.find(booking => booking.machine_id === machine.ID) && (
                                            <>
                                                <p style={{ margin: "0", color: "#FFD700" }}>
                                                    ผู้จอง: {
                                                        machineBookingInfo.find(booking =>
                                                            booking.machine_id === machine.ID
                                                        )?.user_name
                                                    }
                                                </p>
                                                <p style={{ margin: "0", color: "#FFD700" }}>
                                                    เครื่องจะซักเสร็จ: {
                                                        new Date(
                                                            new Date(
                                                                machineBookingInfo.find(booking => booking.machine_id === machine.ID)?.books_end
                                                            ).getTime() - 7 * 60 * 60 * 1000 // ลบ 7 ชั่วโมง (7 ชม * 60 นาที * 60 วินาที * 1000 มิลลิวินาที)
                                                        ).toLocaleTimeString('th-TH', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                    }
                                                </p>

                                            </>
                                        )}
                                </div>
                            }
                            placement="right"
                            overlayStyle={{
                                backgroundColor: "#00BBF0",
                                borderRadius: "8vh",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            }}
                            key={machine.ID}
                        >
                            <div
                                key={machine.ID}


                                style={{
                                    top: '3%',
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "22vh",
                                    height: "22vh",
                                    backgroundColor: selectedMachines.find((m) => m.ID === machine.ID)
                                        ? "#1890ff"
                                        : machine.status === "ไม่ว่าง"
                                            ? "#F73859"
                                            : machine.status === "ซ่อมแซม"
                                                ? "#D9D9D9"
                                                : "#fff",
                                    boxShadow: selectedMachines.find((m) => m.ID === machine.ID)
                                        ? "10px 10px 10px rgba(0, 0, 0, 0.25)" // เงาเมื่อถูกเลือก
                                        : "8px 8px 10px rgba(0, 0, 0, 0.25)", // เงาปกติ
                                    borderRadius: "3vh",
                                    textAlign: "center",
                                    cursor: machine.status === "ไม่ว่าง" || machine.status === "ซ่อมแซม" ? "not-allowed" : "pointer",
                                    transition: "all 0.3s ease",
                                    position: "relative",
                                    color: selectedMachines.find((m) => m.ID === machine.ID)
                                        ? "#fff"
                                        : "#333",
                                }}

                                onMouseEnter={(e) => {
                                    if (machine.status === "ว่าง" && !selectedMachines.find((m) => m.ID === machine.ID)) {
                                        e.currentTarget.style.boxShadow = "0 0 10px #00BBF0";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.backgroundColor = "#00BBF0"; // เปลี่ยนสีพื้นหลัง
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (machine.status === "ว่าง" && !selectedMachines.find((m) => m.ID === machine.ID)) {
                                        e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0, 0, 0, 0.25)";
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.backgroundColor = "#f9f9f9"; // เปลี่ยนสีพื้นหลัง
                                    } else if (selectedMachines.find((m) => m.ID === machine.ID)) {
                                        e.currentTarget.style.backgroundColor = "#35A3D6"; // คงสีไว้เมื่อถูกเลือก
                                    }
                                }}

                                onClick={() => handleMachineSelect(machine)}
                            >
                                {/* 
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                    position: "absolute",
                                    top: "20px",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                {machine.machine_type} {machine.ID}
                            </div> */}

                                {/* แสดงรูปภาพ */}
                                <img
                                    src={machineImage}
                                    alt="machine"
                                    style={{
                                        width: "65%",
                                        height: "65%",
                                        marginTop: "-5px",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                                <b>{ }</b>

                                <div style={{ fontWeight: "bold", fontSize: "100%", marginBottom: "-76%" }}>
                                    {machine.machine_type} | {machine.capacity} kg.
                                    {machine.status === "ซ่อมแซม" && (
                                        <div
                                            style={{
                                                marginTop: "1%",
                                                fontSize: "13vh",
                                                color: "#212121",
                                                position: "absolute",
                                                top: "50%",
                                                left: "46%",
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <ToolOutlined />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </Tooltip>
                    ))}


                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "80%", margin: "0 auto", marginTop: "-12%", marginLeft: "240px" }}>
                    <Button
                        style={{
                            width: "15%",
                            height: "37%",
                            borderRadius: "2vh",
                            background: "linear-gradient(90deg, #FF6F61, #F73859)", // สีไล่ระดับแดง
                            color: "#FFFFFF", // ข้อความสีขาว
                            fontWeight: "bold", // ข้อความตัวหนา
                            fontSize: "120%",
                            border: "none", // เอาเส้นขอบออก
                            marginLeft: "68%",
                            cursor: "pointer",
                            transition: "all 0.3s ease", // เพิ่มการเปลี่ยนแปลงที่ลื่นไหล
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // เพิ่มเงา
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, #F73859, #FF6F61)"; // สีไล่ระดับกลับด้านเมื่อ hover
                            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)"; // เพิ่มเงาให้เข้มขึ้น
                            e.currentTarget.style.transform = "scale(1.05)"; // ขยายเล็กน้อย
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, #FF6F61, #F73859)"; // กลับเป็นสีเดิม
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)"; // เงาเดิม
                            e.currentTarget.style.transform = "scale(1)"; // กลับขนาดเดิม
                        }}
                        onClick={() => {
                            window.location.href = "/Main"; // ย้ายไปที่เส้นทาง /Main
                        }}
                    >
                        ย้อนกลับ
                    </Button>






                    <Button
                        style={{
                            width: "15%",
                            height: "37%",
                            borderRadius: "2vh",
                            background: selectedMachines.length === 0
                                ? "linear-gradient(90deg, #D3D3D3, #A9A9A9)" // สีเทาเมื่อไม่มีการเลือก
                                : "linear-gradient(90deg, #00BBF0, #35A3D6)", // สีปกติเมื่อมีการเลือก
                            color: "#FFFFFF", // ข้อความสีขาว
                            fontWeight: "bold", // ข้อความตัวหนา
                            fontSize: "120%",
                            border: "none", // เอาเส้นขอบออก
                            cursor: selectedMachines.length === 0 ? "not-allowed" : "pointer", // เมาส์ไม่เปลี่ยนเมื่อกดไม่ได้
                            transition: "all 0.3s ease", // เพิ่มการเปลี่ยนแปลงที่ลื่นไหล
                            boxShadow: selectedMachines.length === 0
                                ? "0 4px 10px rgba(0, 0, 0, 0.1)" // เงาเบาเมื่อปิดการใช้งาน
                                : "0 4px 10px rgba(0, 0, 0, 0.2)", // เงาเมื่อเปิดการใช้งาน
                        }}
                        onMouseEnter={(e) => {
                            if (selectedMachines.length !== 0) {
                                e.currentTarget.style.background = "linear-gradient(90deg, #35A3D6, #00BBF0)"; // สีไล่ระดับกลับด้านเมื่อ hover
                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)"; // เพิ่มเงาให้เข้มขึ้น
                                e.currentTarget.style.transform = "scale(1.05)"; // ขยายเล็กน้อย
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedMachines.length !== 0) {
                                e.currentTarget.style.background = "linear-gradient(90deg, #00BBF0, #35A3D6)"; // กลับเป็นสีเดิม
                                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)"; // เงาเดิม
                                e.currentTarget.style.transform = "scale(1)"; // กลับขนาดเดิม
                            }
                        }}
                        onClick={showModal}
                        type="primary"
                        disabled={selectedMachines.length === 0} // ปิดการใช้งานเมื่อไม่มีการเลือก
                    >
                        ยืนยันการจอง
                    </Button>

                </div>

            </div>

            <Modal
                title={
                    <div
                        style={{
                            color: '#FFFFFF',
                            backgroundColor: '#35A3D6',
                            padding: '10px 20px',
                            borderRadius: '10px 10px 0 0',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            textAlign: 'center',
                        }}
                    >
                        ยืนยันการจอง
                    </div>
                }
                visible={isModalVisible}
                onCancel={handleCancel}
                centered
                style={{
                    top: 80,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                }}
                bodyStyle={{
                    backgroundColor: '#F3F4F9',
                    padding: '20px',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}
                        style={{
                            width: "100px",
                            height: "40px",
                            backgroundColor: "#FF6F61",
                            color: "#FFFFFF",
                            fontWeight: "bold",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F73859"; // สีเข้มเมื่อ hover
                            e.currentTarget.style.transform = "scale(1.05)"; // ขยายเล็กน้อยเมื่อ hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FF6F61"; // สีเดิมเมื่อ mouse leave
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        ยกเลิก
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSubmitBooking}
                        style={{
                            width: "140px",
                            height: "40px",
                            backgroundColor: "#35A3D6",
                            borderColor: "#35A3D6",
                            fontWeight: "bold",
                            color: "#FFFFFF",
                            borderRadius: "20px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#00BBF0"; // สีฟ้าสดใสเมื่อ hover
                            e.currentTarget.style.transform = "scale(1.05)"; // ขยายเล็กน้อยเมื่อ hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#35A3D6"; // สีเดิมเมื่อ mouse leave
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        ยืนยัน
                    </Button>,
                ]}
            >
                <div style={{ color: '#465B7E', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                    คุณต้องการยืนยันการจองเครื่องซักผ้าหรือไม่?
                </div>
                <div style={{ color: '#465B7E', fontSize: '14px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>จำนวนเครื่องที่เลือก:</span> {selectedMachines.length}
                </div>
                <div style={{ color: '#465B7E', fontSize: '14px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>เวลาเริ่มต้นการจอง:</span> {currentTime}
                </div>
                <div style={{ color: '#465B7E', fontSize: '14px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>เวลาสิ้นสุดการจอง:</span> {calculateEndTime(currentTime)}
                </div>
                <div style={{ marginTop: "20px", textAlign: "center" }}>

                    {selectedReward && ( // แสดงเฉพาะเมื่อเลือก Reward
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#E85D5D" }}>
                            ราคา: {calculateDiscountedPrice(totalPrice)} บาท
                        </div>
                    )}
                </div>
            </Modal>


        </>
    );
}

export default Viewtable;
