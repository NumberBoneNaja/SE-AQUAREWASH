import { useEffect, useState } from "react";
import { HistoryRewardInterface } from "../../interfaces/IHistoryReward";
import { GetDiscountByUserID } from "../../services/https";
import { motion } from "framer-motion";

interface DiscountProps {
    totaprice: number;
    HDiscount: (Price: number) => void;
    SelectedReward:(rewardID: number) => void;
    // show:boolean
    // setPopup: React.Dispatch<React.SetStateAction<boolean>> 
}

export function Discount({totaprice,HDiscount,SelectedReward}:DiscountProps){
     const [discount,setDiscount] = useState<HistoryRewardInterface[] >([]);//history
  
     const [disprice,setDisprice] = useState<number>(0);
     const [selectedRewardID, setSelectedRewardID] = useState<number | null>(null);

    
     async function getDiscount() {
        const uid = localStorage.getItem("id");
        const res = await GetDiscountByUserID(Number(uid));//history
        console.log("res is: ",res)
        
        const sort = res.filter((item: HistoryRewardInterface) => item.State === "claimed" && (item as any).Reward?.RewardTypeID !==3);
        setDiscount(sort);
     
     }
     useEffect(() => {
        getDiscount();
     }, []);
     useEffect(() => {
        //  console.log("disprice is",disprice);
        //  console.log("dicount is",discount);
        //  console.log("reward is",reward);
     },[discount,disprice]);
    //  function calculateDiscount(type: number, discount: number) {
    //     let discountAmount = 0;
    //     if (type === 1) {
    //       discountAmount = totaprice * discount; // คำนวณเป็นเปอร์เซ็นต์
    //       setDisprice(discountAmount);
    //       return discountAmount;
    //     } else if (type === 2) {
    //       discountAmount = discount; // คำนวณเป็นจำนวนเงิน
    //       setDisprice(discountAmount);
    //       return discountAmount;
    //     }
    //     return setDisprice(0); // ค่าดีฟอลต์เป็น 0
    //   }
    function calculateDiscount(rewardTypeID: number, discount: number, rewardID: number) {
        // ตรวจสอบว่าปุ่มที่กดคือ Reward ที่ถูกเลือกอยู่หรือไม่

    
        if (selectedRewardID === rewardID) {
            setSelectedRewardID(null); // ยกเลิกการเลือก
            setDisprice(0); // รีเซ็ตส่วนลด
            HDiscount(0); // แจ้งส่วนลดที่ถูกรีเซ็ต
            SelectedReward(0); // รีเซ็ต Reward ID ที่เลือก
            console.log("Deselected discount (reward):", rewardID); // ตรวจสอบใน console
            return;
        }

    
        // ถ้ายังไม่ถูกเลือก คำนวณส่วนลด
        let discountAmount = 0;
        if (rewardTypeID === 1) {
            discountAmount = totaprice * discount; // คำนวณเปอร์เซ็นต์
        } else if (rewardTypeID === 2) {
            discountAmount = discount; // คำนวณเป็นจำนวนเงิน
        }
    
        setDisprice(discountAmount);
        HDiscount(discountAmount); // แจ้งส่วนลด
        SelectedReward(rewardID); // แจ้ง Reward ID ที่เลือก
        setSelectedRewardID(rewardID); // ตั้งค่าการเลือก
        console.log("Calculated discount (reward):", rewardID); // ตรวจสอบใน console
    }
    
     
    
    return(
        <motion.div
  className="w-full h-full flex justify-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="w-full flex justify-center">
    {discount && discount.length > 0 ? (
      <div className="grid grid-cols-4 gap-2">
        {discount.map((item, index) => {
          const isSelected = selectedRewardID === item.ID;

          const styleButton = isSelected
            ? "border rounded px-4 opacity-100 text-md normal-case font-normal bg-white text-base-red bg-transparent border-current transition ease duration-300"
            : "border rounded px-4 opacity-100 text-md normal-case font-normal bg-base-red text-white transition ease duration-300";

          const lineClick = isSelected
            ? "border-base-red transition ease duration-300"
            : "shadow-sm transition ease duration-300";

          const fontColor = isSelected
            ? "text-base-red transition ease duration-300"
            : "text-base-black transition ease duration-300";

          return (
            <div key={index}>
              <div
                className={`shadow-base-shadow ${lineClick} bg-white w-[290px] rounded-lg flex justify-between p-3 h-[75px]`}
              >
                <div>
                  <p className={`font-bold ${fontColor}`}>
                    {(item as any).Reward?.Name || "ไม่ระบุชื่อ"}
                  </p>
                  <p className="text-sm text-gray-500">
                    หมดอายุ{" "}
                    {new Date(item.Expire || "").toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="h-full flex items-center">
                  <div
                    onClick={() =>
                      calculateDiscount(
                        (item as any).Reward?.RewardTypeID || 0,
                        (item as any).Reward?.Discount || 0,
                        item.ID || 0
                      )
                    }
                    className={styleButton}
                  >
                    ใช้
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-2xl font-bold text-base-black text-center">
          ไม่มีส่วนลด
        </p>
      </div>
    )}
  </div>
</motion.div>

    );
}