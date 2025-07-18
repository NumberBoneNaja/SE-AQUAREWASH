import { useEffect, useState } from "react";
import { GetUserBookings } from "../../services/https"; // ฟังก์ชันที่คุณสร้างไว้เพื่อเรียก API
import UserBar from '../../Components/Nav_bar/UserBar';
const UserBookingsTable = () => {
    interface Booking {
        user_name: string;
        machine_name: string;
        books_start: string;
        books_end: string;
        book_status: string;
    }

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("last7days"); // ตัวกรองวันที่

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userId = localStorage.getItem("id"); // ดึง userId จาก localStorage
                if (userId) {
                    const data = await GetUserBookings(userId);
                    setBookings(data || []);
                } else {
                    setError("User ID not found in local storage.");
                }
            } catch (err) {
                setError("Failed to fetch user bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filterBookings = (filterOption: string) => {
        const now = new Date();
        return bookings.filter((booking) => {
            const bookingDate = new Date(booking.books_start);
            switch (filterOption) {
                case "lastday":
                    return bookingDate >= new Date(now.setDate(now.getDate() - 1));
                case "last7days":
                    return bookingDate >= new Date(now.setDate(now.getDate() - 7));
                case "last30days":
                    return bookingDate >= new Date(now.setDate(now.getDate() - 30));
                case "lastmonth":
                    return bookingDate.getMonth() === now.getMonth() - 1;
                case "lastyear":
                    return bookingDate.getFullYear() === now.getFullYear() - 1;
                default:
                    return true;
            }
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const filteredBookings = filterBookings(filter);

    return (
        
        <div

            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{
                //isplay: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "10",
                background: "#F0FCFF",
            }}
        >
            <UserBar page="Book" />
            {/* GIF อยู่ด้านหลัง */}
            <div
                style={{
                    marginTop: "0vh", // ระยะห่างที่กำหนดไว้
                    position: "relative", // เปลี่ยนตำแหน่งเป็น relative เพื่อรองรับการซ้อน
                    zIndex: "0", // ให้ div นี้อยู่ในลำดับชั้นที่สามารถถูกซ้อนทับได้
                }}
            >
                
            </div>

            {/* ตารางข้อมูล */}
            <div
                className="w-full p-6 rounded-lg shadow-lg"
                style={{
                    width: "60%",
                    position: "sticky",
                    height: "80vh",
                    marginLeft: "42vh",
                    marginTop: "5vh",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 10px 18px rgba(0, 0, 0, 0.2)",
                    borderRadius: "15px",
                    overflowY: "auto",
                    zIndex: "0", // ให้ตารางอยู่ด้านหน้าของ GIF
                }}
            >
                {/* Filter + Search */}
                <div
                    style={{
                        position: "sticky",
                        top: "-3vh",
                        width: "110%",
                        marginLeft: "-3%",
                        marginTop: "-3vh",
                        height: "9vh",
                        zIndex: 0, // ความสำคัญให้อยู่เหนือเนื้อหาอื่น
                        background: "linear-gradient(to right, #0099ff, #33ccff)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div className="flex items-center justify-between pb-4 pt-2" >
                        <div style={{ marginLeft: "6%", marginTop: "1%" }}>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="inline-flex items-center text-gray-600 bg-white border border-gray-300 focus:outline-none hover:bg-gray-200 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-3 py-1.5"
                            >
                                <option value="lastday">Last Day</option>
                                <option value="last7days">Last 7 Days</option>
                                <option value="last30days">Last 30 Days</option>
                                <option value="lastmonth">Last Month</option>
                                <option value="lastyear">Last Year</option>
                            </select>
                        </div>
                        <div className="relative" style={{ marginRight: "6%", marginTop: "1%" }}>
                            <input
                                type="text"
                                id="table-search"
                                className="block p-2 pl-10 text-sm text-gray-600 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for items"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div
                    className="flex text-xs text-gray-100 uppercase font-bold py-2 px-4"
                    style={{
                        background: "linear-gradient(to right, #0099ff, #33ccff)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                        position: "sticky",
                        borderRadius: "0px",
                        height: "6vh",
                        top: "6vh", // ติดด้านล่างของ Filter + Search
                        zIndex: -1, // ให้อยู่ใต้ Filter + Search
                        width: "110%",
                        marginLeft: "-5%",
                        display: "flex",
                        padding: "0 7vh",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="flex-1 text-center">ชื่อ</div>
                    <div className="flex-1 text-center">ชื่อเครื่อง</div>
                    <div className="flex-1 text-center">เวลาเริ่มต้น</div>
                    <div className="flex-1 text-center">เวลาสิ้นสุด</div>
                    <div className="flex-1 text-center" >สถานะ</div>
                </div>

                {/* Table Rows */}
                <div className="mt-2">
                    {filteredBookings.map((booking, index) => (
                        <div
                            key={index}
                            className="flex items-center text-sm text-gray-800 border-b border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out"
                            style={{
                                borderRadius: "10px",
                                width: "100%",
                                height: "7vh",
                                margin: "1vh 0",
                                padding: "10px",
                                backgroundColor: index % 2 === 0 ? "#f0f9ff" : "#ffffff",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                transform: "scale(1)", // ขนาดปกติ
                                transition: "transform 0.3s ease-in-out", // เพิ่มการเคลื่อนไหว
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")} // ขยายเล็กน้อย
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // กลับขนาดปกติ
                        >
                            <div className="flex-1 text-center font-medium" style={{ color: "#007BFF" }}>
                                {booking.user_name}
                            </div>
                            <div className="flex-1 text-center">{booking.machine_name}</div>
                            <div className="flex-1 text-center" style={{ color: "#17a2b8" }}>
                                {booking.books_start} {/* แสดงค่าตรง ๆ */}
                            </div>
                            <div className="flex-1 text-center" style={{ color: "#17a2b8" }}>
                                {booking.books_end} {/* แสดงค่าตรง ๆ */}
                            </div>
                            <div
                                className={`flex-1 text-center font-bold ${booking.book_status === "เสร็จสิ้น"
                                        ? "text-green-600" // สีเขียว
                                        : booking.book_status === "สิ้นสุด"
                                            ? "text-red-600" // สีแดง
                                            : booking.book_status === "ส่งการจอง"
                                                ? "text-yellow-700" // สีเหลืองเข้ม
                                                : "text-gray-600" // สีเริ่มต้น (กรณีไม่มีสถานะ)
                                    }`}
                            >
                                {booking.book_status}
                            </div>

                        </div>

                    ))}
                </div>
            </div>
        </div>





    );
};

export default UserBookingsTable;
