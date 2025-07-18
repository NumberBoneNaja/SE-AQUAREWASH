import { Popover, Steps, StepsProps } from "antd";
import './stepper.css'
const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          Step {index + 1} - Status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

function Stepper({orderstatus}:any) {

    function convertStatus(status: string): number {
        switch (status) {
            case "รอชำระเงิน":
                return 0; // เปลี่ยนเป็นตัวเลข
            case "ชำระเงินสำเร็จ":
                return 1; // เปลี่ยนเป็นตัวเลข
            case "กำลังดำเนินการ":
                return 2; // เปลี่ยนเป็นตัวเลข
            case "สำเร็จ":
                return 3; // เปลี่ยนเป็นตัวเลข
            default:
                return 0; // กรณีไม่มีสถานะตรงกับที่กำหนด
        }
    }

    // แปลงสถานะที่ได้รับจาก prop
    const Orstate = convertStatus(orderstatus)
    return (
        <>
          <Steps
            current={Orstate}
            progressDot={customDot}
            items={[
              { title: 'สร้าง Order' },
              { title: 'ชำระเงินสำเร็จ' },
              { title: 'กำลังดำเนินการ' },
              { title: 'สำเร็จ' },
            ]}
            className="custom-steps" // เพิ่ม className เพื่อใช้ในการกำหนด style
          />
        </>
    )
}

export default Stepper;

