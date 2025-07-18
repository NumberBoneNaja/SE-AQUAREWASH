import { useParams } from "react-router-dom";
import Package from "../../../Components/AdminPackage/ACloth";
import AddOn from "../../../Components/AdminPackage/AAddOn";
import { useEffect, useState } from "react";

import { ClothSelectedDetail  } from "../../../Components/AdminPackage/ACloth";
import { AddOnInterface } from "../../../interfaces/IAddOn";
import StepperOrder from "../../../Components/Stepper/SteperOrder";
import EmployeeBar from '../../../Components/Nav_bar/EmployeeBar';
import EmSidebar from '../../../Components/Nav_bar/EmSidebar';



function AdminPackageDetail() {
    const { id } = useParams<{ id: string }>();
    const [totalcloth, setTotalcloth] = useState<number>(0); //ราคา cloth
    const [totalAddOn, setTotalAddOn] = useState<number>(0); // ราคา addon
    const [selectedAddOn,setSelectedAddOn] = useState<number[]>([]);//id เลือก AddOn
    const [selectedCloth,setSelectedCloth] = useState<number[]>([]);//id เลือก cloth
    const [_selectedClothDetail, setSelectedClothDetail] = useState<ClothSelectedDetail[]>([]); //รายละเอียด cloth
    const [_addOn,setAddon] = useState<AddOnInterface[]>([]);
    
    
    
 
    useEffect(()=>{
    
    },[totalcloth,totalAddOn,selectedCloth,selectedAddOn]
    )
    
    


    return (
        <div className="bg-base-blue-20 w-full">
            <EmployeeBar page={""}/>
            <EmSidebar page={""}/>
            {/* <Nav_bar  page={"Order"}/> */}
          
            <div className="w-full h-full flex justify-center relative">
                <div className="w-[95%]
                md:w-[95%] lg:w-[80%] ">
                    {/* <Banner id={id as string}/> */}
                    <div className="mt-2 w-full flex justify-center mb-5 ">
                        <div className="">
                            <StepperOrder step={1}/>
                        </div>
                        
                    </div>
                       
                        <div className="w-full 
                        md:flex  md:justify-center">
                            <div className="w-full ]
                            md:w-[60%]
                             ">
                                <div>
                                  <p className="text-xl font-semibold text-base-black  m-3">เลือกชนิดเสื้อผ้า</p>  
                                 <Package id= {id as string} priceSelectedItemsChange={setTotalcloth} SelectedCloth={setSelectedCloth} detailClothselected={setSelectedClothDetail} /> 
                                </div>
                              
                            </div>
                            <div className="w-full 
                            md:w-[40%] md:px-l-3  "> 
                                <div>
                                     <p className="text-xl font-semibold text-base-black  m-5">บริการเสริม</p>
                                     <AddOn id={id as string} priceSelectedAddOnChange ={setTotalAddOn} SelectedAddOn={setSelectedAddOn} AddOnItem={setAddon} /> 
                                </div>
                               
                            </div>
                       </div>
                  
                   
                    {/* <Calculate cloth ={totalcloth} addon = {totalAddOn} selectedAddon={selectedAddOn}  selectedCloth={selectedCloth}  detailsCloth={selectedClothDetail} 
                    id={id || ''} addonItem = {addOn}/> */}
                </div>
                
            </div>
            
          
        </div>
    );
}

export default AdminPackageDetail;