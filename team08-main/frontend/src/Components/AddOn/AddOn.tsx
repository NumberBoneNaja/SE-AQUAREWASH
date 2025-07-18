import { useEffect, useState } from "react";
import { AddOnInterface } from "../../interfaces/IAddOn";
import { GetAddOnByPackID } from "../../services/https";
// import Laundry from "../../image/laundry_7212540.png"

interface CalculatorAddOn {
    id :string,
    priceSelectedAddOnChange: (selectedItems: number) => void; 
    SelectedAddOn:(selectedAddOn:number[]) => void ;
    AddOnItem:(AddonItem:AddOnInterface[])=> void;
}

function AddOn({id,priceSelectedAddOnChange,SelectedAddOn,AddOnItem}: CalculatorAddOn){
    const [addon,setAddon] = useState<AddOnInterface[]>([]);
    const [selectedAddOn, setSelectedAddOn] = useState<number[]>([]);
    const [_totalPrice, setTotalPrice] = useState<number>(0);
    async function GetAddon() {
        const res = await GetAddOnByPackID(Number(id))
        setAddon(res)
        AddOnItem(res)

    }
    useEffect( ()=>{
          GetAddon()
    },[])
    useEffect( ()=>{
      
  },[addon])
  useEffect(() => {
    const selectedAddOnDetails = addon.filter((item) => selectedAddOn.includes(item.ID || 0));
    const calculatedTotalPrice = selectedAddOnDetails.reduce((total, item) => {
        return total + (item.Price || 0);
    }, 0);

    setTotalPrice(calculatedTotalPrice);
    priceSelectedAddOnChange(calculatedTotalPrice); // ส่งราคารวมกลับไปยังคอมโพเนนต์แม่
}, [selectedAddOn, addon]);
  
   

  const handleCheckboxChange = (id: number) => {
    setSelectedAddOn((prevSelectedAddOn) => {
      const updatedItems = prevSelectedAddOn.includes(id)
        ? prevSelectedAddOn.filter((itemId) => itemId !== id)
        : [...prevSelectedAddOn, id];
      
        // console.log("AddOn is:",updatedItems)
        SelectedAddOn(updatedItems)
      return updatedItems; // Add this return statement
    });
  };
//   function calculateTotalPrice(): number {
//     const selectedClothDetails = addon.filter((item) => selectedAddOn.includes(item.ID || 0));
//     const totalPrice = selectedClothDetails.reduce((total, item) => {
//         // const quantity = (item.ID || 0) || 0;
//         return total + (item.Price || 0)  ;
//     }, 0);
    
//     priceSelectedAddOnChange(totalPrice);
//     return totalPrice;
// }
    return(
        <div>
            <div className="w-full h-auto flex md:justify-end my-5 md:my-10 justify-center">
                <div className="AddOn w-full h-auto md:w-[95%]">
                    <div className="grid grid-cols-1 gap-1
                    sm:grid sm:grid-cols-2 sm:gap-1
                    md:flex 
                    md:flex-col md:gap-7">

                    {
                      addon.map((item, index) => (
                        <div className="w-full h-[90px] bg-white  flex justify-between px-5 py-2 rounded-xl shadow-sm border-1 " key={index}>
                          <div className="flex  items-center ">
                            <img src={item.AddOnPic} alt="" className="md:w-[60px] md:h-[60px] md:mr-5 w-[60px] h-[60px] mr-5" />
                          
                            <div className=" flex justify-center items-center max-w-[250px]">
                              <div className="lg:max-w-[170px] md:max-w-[160px] sm:max-w-[130px] max-w-[170px]">
                              <p className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">{item.AddOnName}</p>
                              <p className="text-sm text-gray-500  whitespace-nowrap overflow-hidden text-ellipsis">{item.Description}</p> 
                              </div>
                          </div>
                          </div>
                          
                        <div className="flex justify-center items-center">
                          <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" 
                          value="" 
                          className="sr-only peer" 
                          checked={selectedAddOn.includes(item.ID || 0)}
                          onChange={() => handleCheckboxChange(item.ID || 0)}/> {/* Add closing tag for <input> */}
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  peer-focus:ring-red-300 dark:peer-focus:ring-0
                          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#31BBEC]"></div>
                          </label>
                          {/* <p>{item.Price}</p>
                          <p>price : {totalPrice}</p> */}
                      </div>
                      
                  </div>
                  
                      ))
                    }
                     
                      
                    </div>
                    
                   
                </div>
            </div>
            
        
        </div>
    )

}
export default AddOn 