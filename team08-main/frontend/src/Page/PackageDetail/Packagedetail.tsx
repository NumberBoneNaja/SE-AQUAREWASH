// import Nav_bar from "../components/NavBar/Nav_bar";
import { useParams } from "react-router-dom";
// import Banner from "../components/Banner/Banner";
import Package from "../../Components/PackageContent/Package";

import AddOn from "../../Components/AddOn/AddOn";
import { useEffect, useState } from "react";
import Calculate from "../../Components/caculate/calculate";
// import { ImageInterface } from "../interface/IImage";
// import {  GetImageID, UploadImageByOrderID } from "../services/https";
import { ClothSelectedDetail } from "../../Components/PackageContent/Package";
import { AddOnInterface } from "../../interfaces/IAddOn";
import UserBar from "../../Components/Nav_bar/UserBar";
import StepperOrder from "../../Components/Stepper/SteperOrder";
import { UsersInterface } from "../../interfaces/UsersInterface";

import { GetUserID } from "../../services/https/index1";



function PackageDetail() {
    const { id } = useParams<{ id: string }>();
    const [totalcloth, setTotalcloth] = useState<number>(0); //ราคา cloth
    const [totalAddOn, setTotalAddOn] = useState<number>(0); // ราคา addon
    const [selectedAddOn,setSelectedAddOn] = useState<number[]>([]);//id เลือก AddOn
    const [selectedCloth,setSelectedCloth] = useState<number[]>([]);//id เลือก cloth
    const [selectedClothDetail, setSelectedClothDetail] = useState<ClothSelectedDetail[]>([]); //รายละเอียด cloth
    const [addOn,setAddon] = useState<AddOnInterface[]>([]);
    const [userdata,setUserdata] = useState<UsersInterface>({});
    
    async function getUserData() {
        const uid = localStorage.getItem("id");
        const res = await GetUserID(Number(uid));
        // console.log(res.data);
        setUserdata(res);
        // setUserdata(res.data); 
    }
    useEffect(() => {
        getUserData();
        
    }, []);
 
    useEffect(()=>{
          
    },[totalcloth,totalAddOn,selectedCloth,selectedAddOn,userdata]
    )
    
    


    return (
        <div className="bg-base-blue-20 w-full">
            <UserBar page={"Order"}/>
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
                                 <Package id= {id as string} priceSelectedItemsChange={setTotalcloth} SelectedCloth={setSelectedCloth} detailClothselected={setSelectedClothDetail} user={userdata} /> 
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
                  
                   
                    <Calculate cloth ={totalcloth} addon = {totalAddOn} selectedAddon={selectedAddOn}  selectedCloth={selectedCloth}  detailsCloth={selectedClothDetail}
                        
                    id={id || ''} addonItem = {addOn} data={userdata}/>
                </div>
                
            </div>
            
          
        </div>
    );
}

export default PackageDetail;