import { useEffect, useState } from "react";
import { ClothType } from "../../interfaces/IClothType";
import { GetClothByPackageID } from "../../services/https";
import "./Pack.css"
import { motion } from "framer-motion";
import { message } from "antd";
import { UsersInterface } from "../../interfaces/UsersInterface";


interface CalculatorCloth {
    id :string,
    priceSelectedItemsChange: (selectedItems: number) => void;//รวมราคา
    SelectedCloth:(selectedCloth:number[]) => void ;//id ที่ถูกเลือก
    detailClothselected: (detailCloth: ClothSelectedDetail[]) => void;
    user:UsersInterface
}
export interface ClothSelectedDetail{
    ID: number
    quantity: number
    price: number
    
}
function Package({id,priceSelectedItemsChange,SelectedCloth,detailClothselected,user}: CalculatorCloth ){
    const [cloth, setCloth] = useState<ClothType[]>([]);
    const [counts, setCounts] = useState<{ [key: number]: number }>({});
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    // const [totalPrice, setTotalPrice] = useState<number>(0);
    const [priceCloth, setPricecloth] = useState<{ [key: number]: number }>({});//เอาไว้เแสดงราคาของแต่ละประเภทที่รวมกับจำนวน
    // const [detailCloth, setDetailCloth] = useState<ClothSelectedDetail[]>([]);//เก็บรายละเอียดการเลือก cloth เพื่อเอาไว้สร้าง order detail

  

   
    async function getCloth(id: number) {
       
         const res = await GetClothByPackageID(id);
         setCloth(res);

         const initialCounts = res.reduce((acc: { [key: number]: number }, item:ClothType) => {
            acc[item.ID!] = 0;
            return acc;
          }, {});
          setCounts(initialCounts);
          
      
    }
    useEffect(() => {
        getCloth(Number(id));
        console.log("cloth: ",cloth)
       
     
    },[]);


    useEffect(() => {
         console.log("selected: ",selectedItems)
         console.log("UserRate: ",user.DiscountRate)
        const selectedClothDetails = cloth.filter((item) => selectedItems.includes(item.ID || 0)); //กรองเอาแค่ cloth ที่ถูกเลือก
    
        const calculatedTotalPrice = selectedClothDetails.reduce((total, item) => {
            const quantity = counts[item.ID || 0] || 0;
            return total + (calculatePrice(item.Price) || 0) * quantity;
        }, 0);
        updateClothDetail();
        // setTotalPrice(calculatedTotalPrice);
        priceSelectedItemsChange(calculatedTotalPrice); // ส่งราคารวมกลับไปยังคอมโพเนนต์แม่
    }, [counts, selectedItems, cloth]);


    // useEffect(() => {
    //   const clothPrices = calculateClothPrices();
    //   setPricecloth(clothPrices); // อัปเดตราคาของผ้าแต่ละประเภท
    // }, [counts, cloth]);
   
    function plus(id: number) {

        if (!selectedItems.includes(id) ){
          message.open({
            type: 'warning',
            content: 'เนื่องจากผ้าชนิดนี้ไม่ถูกเลือกมาก่อน ระบบจะเลือกชนิดผ้าให้',
            duration: 3
          })
          setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
          setCounts((prevCounts) => {
            const newCount = (prevCounts[id] || 0) + 1;
            updatepriceCloth(id, newCount);
            return { ...prevCounts, [id]: newCount };
          });
          return
        }
        else
        {   

          setCounts((prevCounts) => {
            const newCount = (prevCounts[id] || 0) + 1;
            updatepriceCloth(id, newCount);
            return { ...prevCounts, [id]: newCount };
          });
        }
  
       
      }
    function minus(id: number) {

      if (counts[id] === 1){
          message.open({
            type: 'warning',
            content: 'ชนิดผ้าที่ถูกเลือกไม่สามารถเป็น 0 ได้',
            duration: 3
          })

      }else{
        setCounts((prevCounts) => ({
          ...prevCounts,
          [id]: Math.max((prevCounts[id] || 0) - 1, 0), // ห้ามลดต่ำกว่า 0
        }));
        updatepriceCloth(id,counts[id]-1)
      }
    
        
       
      }
      const handleCheckboxChange = (id: number) => {
        setSelectedItems((prevSelectedItems) => {
          const updatedItems = prevSelectedItems.includes(id)
            ? prevSelectedItems.filter((itemId) => itemId !== id)
            : [...prevSelectedItems, id];//ใช้เก็บค่าที่ถูกเลือก

            SelectedCloth(updatedItems)
            
            setCounts((prevCounts) => {
              const updatedCounts = { ...prevCounts };
              if (updatedItems.includes(id)) {
                updatedCounts[id] = 1; // กำหนดค่าเริ่มต้นเป็น 1 เมื่อเลือก
                updatepriceCloth(id,1)
              } else {
                delete updatedCounts[id]; // ลบค่าเมื่อยกเลิกการเลือก
              }
              return updatedCounts;
            });
          return updatedItems; // Add this return statement
        });
      };

      // function calculateClothPrices(): { [key: number]: number } {
      //   const prices = cloth.reduce((acc: { [key: number]: number }, item) => {
      //     const quantity = counts[item.ID || 0] || 0; // จำนวนผ้าแต่ละประเภท
      //     acc[item.ID || 0] = (item.Price || 0) * quantity; // ราคาผ้าแต่ละประเภท = ราคา * จำนวน
      //     return acc;
      //   }, {});
      //   return prices;
      // }
      function updatepriceCloth(id:number,quantity:number){
        const exe = cloth.filter((item)=> item.ID == id )
        // console.log("exe",(exe[0].Price || 0) * quantity)
        const totalpertype = (exe[0].Price || 0) * quantity
        setPricecloth(prevPriceCloth => ({ ...prevPriceCloth, [id]: totalpertype }))
    }
    function updateClothDetail() {
      const selectedClothDetails = cloth
        .filter((item) => selectedItems.includes(item.ID || 0))
        .map((item) => ({
          ID: item.ID || 0,
          quantity: counts[item.ID || 0] || 0,
          price: calculatePrice((item.Price || 0) * (counts[item.ID || 0] || 0)),
        }));
    
      // setDetailCloth(selectedClothDetails);
      detailClothselected(selectedClothDetails)
      console.log(selectedClothDetails)
    }
    function calculatePrice(price:number){
      return price*(1-Number(user.DiscountRate))
    }

    
    return(
        <>
       
          <div className="detail-package w-full  ">
            <div className="w-full flex justify-center">
              <div className="table-cloth w-[95%] grid grid-cols-3 gap-7 px-5">
                <div>
                    <p className=" text-lg" >ชนิดผ้า</p>
                </div>
                <div>
                     <p  className="text-center text-lg">จำนวน</p>
                </div>
                <div>
                <p className="text-right text-lg">ราคา</p> 
                </div>
               
             </div>  
            </div>
            <div className="w-full">
                 {
                cloth.map((item,index)=>(
                    
                    <motion.div key={index} className="w-full flex justify-center " 
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1,y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.5 }}
                    >
                        <div className={`table-cloth w-full grid grid-cols-3 gap-7 px-5 my-2 h-[100px] rounded-xl shadow-md bg-white
                        ${selectedItems.includes(item.ID || 0) ? "outline outline-1 outline-[#00BBF0] custom-shadow " : ""}`}>
                            <div className="flex items-center">
                                  
                                  <div>
                                  <div className="checkbox-wrapper-33">
                                    <label className="checkbox">
                                    <input className="checkbox__trigger visuallyhidden" type="checkbox" 
                                    checked={selectedItems.includes(item.ID || 0)} 
                                    onChange={() => handleCheckboxChange(item.ID || 0)}/>
                                     <span className="checkbox__symbol">
                                      <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                         </svg>
                                            </span>
                                        
                                   </label>
                                    </div>
                                  </div>
                                 <p className="text-left text-lg">{item.TypeName}</p>
                                 
                            </div>
                            <div className="flex justify-center items-center border-solid ">
                              <div className="flex justify-center items-center bg-[#FBFBFB] rounded-l-lg  rounded-r-lg">
                                <motion.div className="w-[25px]   rounded-l-lg text-white bg-[#24292E] flex justify-center cursor-pointer"
                                onClick={() => minus(item.ID || 0)} 
                                whileTap={{ scale: 1.1 }}
                                >-</motion.div>
                                <p className="text-center mx-2">{counts[item.ID || 0] || 0}</p>  
                                <motion.div className="w-[25px]  rounded-r-lg text-white bg-[#24292E] flex justify-center cursor-pointer" 
                                onClick={() => plus(item.ID || 0)}
                                whileTap={{ scale: 1.1 }}
                                >+</motion.div>
                              </div>
                                
                            </div>
                             <div className="flex justify-end items-center ">
                              <div>
                                <p className="text-right">{calculatePrice(item.Price || 0)} บาท</p>
                                {
                                  selectedItems.includes(item.ID || 0) && (
                                    <>
                                     <p className="font-bold text-[#F73859] ">{calculatePrice(priceCloth[item.ID || 0])}</p>  
                                    </>
                                  )
                                }
                                
                              </div>
                             </div>
                           
                        
                        </div> 
                    </motion.div>
                ))
               }   
                
               
          
           </div>  
          </div>
        </>
    )
}
export default Package 