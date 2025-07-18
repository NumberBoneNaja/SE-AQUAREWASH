import { useParams } from "react-router-dom";
import UserBar from "../../Components/Nav_bar/UserBar";
import PayBookingCom from "../../Components/paymentCom/payBokking";
// import { UpdateMachine } from "../../services/https/index"; // Import ฟังก์ชัน UpdateMachine


export const apikey = 'l72ed2137c85724b61be9eee4dcef83734';
export const apisecret = '776221e9c2204ccb9c92b52ea0728829';
export const billerID = '261664370863177';

function PayBooking() {
    const { id } = useParams<{ id: string }>(); // ดึง payment ID จาก URL
    // const location = useLocation();
    // const { machineIds } = location.state || {}; // ดึง machine_id จาก state ที่ถูกส่งมาพร้อม navigate

    // ฟังก์ชันสำหรับอัปเดตสถานะเครื่องทั้งหมดเป็น "ไม่ว่าง"
    // const updateMachinesToBusy = async () => {
    //     if (!machineIds || machineIds.length === 0) {
    //         console.warn("No machine IDs provided!");
    //         return;
    //     }

    //     for (const machineId of machineIds) {
    //         const updatedData = {
    //             ID: machineId,
    //             machine_name: "Machine Name", // Replace with actual machine name
    //             machine_type: "Machine Type", // Replace with actual machine type
    //             status: "ไม่ว่าง", // อัปเดตสถานะเป็น "ไม่ว่าง"
    //         };

    //         try {
    //             const result = await UpdateMachine(machineId, updatedData);
    //             if ('data' in result && result.data.success) {
    //                 console.log(`Machine ID ${machineId} updated to 'ไม่ว่าง' successfully.`);
    //             } else {
    //                 console.error(`Failed to update Machine ID ${machineId}:`, 'data' in result ? result.data.message : result.message);
    //             }
    //         } catch (error) {
    //             console.error(`Error updating Machine ID ${machineId}:`, error);
    //         }
    //     }
    // };

    // เรียกฟังก์ชันอัปเดตทันทีเมื่อ Component โหลด
    // React.useEffect(() => {
    //     updateMachinesToBusy();
    // }, [machineIds]);

    return (
        <div className="bg-base-blue-20   min-h-screen">
            {/* <Nav_bar page={"Payment"} /> */}
            <UserBar page={"Order"} />
            <div className="w-full h-full flex justify-center ">
                <div>
                    <PayBookingCom id={id || ''} />
                </div>
            </div>
        </div>
    );
}

export default PayBooking;
