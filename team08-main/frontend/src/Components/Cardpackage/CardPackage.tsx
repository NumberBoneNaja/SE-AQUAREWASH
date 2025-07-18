import { useEffect, useState } from "react"
import { PackageInterface } from "../../interfaces/IPackage";
import { GetAllPackage } from "../../services/https";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import Slider from 'react-slick';
// import "./Slide.css"
// import Sneaker from "../../image/sneakers_2113286.png"
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CardPackage() {
    const [packageName, setPackageName] = useState<PackageInterface[]>([]);
    const navigate = useNavigate();

    async function getPackage() {
        const res = await GetAllPackage();
        setPackageName(res);
       
    }
    useEffect(() => {
        getPackage();
        
    }, []);

    useEffect(() => {
        console.log("p=",packageName); // จะได้ค่า packageName หลังจากที่มันถูกอัปเดต
    }, [packageName]); // จะทำงานเมื่อ packageName เปลี่ยนแปลง
    
    // const settings = {
    //   dots: false,
    //   infinite: false,
    //   speed: 500,
    //   slidesToShow: 6,
    //   slidesToScroll: 5,
    //   arrow:true,
    // };
    function GotoOrderDetail(id: number) {
      navigate(`/package-detail/${id}`);
    }
    return (
      <div className="content-service w-full h-auto px-5 mt-5">
      <div className="content-serve  ">
        
    
          <div className="w-full h-full flex flex-wrap gap-6 justify-center ">
           {packageName.map((item,index) => {
    // ตรวจสอบเลขท้ายของ ID
             const bgColor =
             index % 5 === 1
            ? 'from-blue-400 to-blue-600' // ลงท้ายด้วย 1 from-blue-400 to-blue-600
            : index % 5 === 2
            ? 'from-red-400 to-[#F73859]' // ลงท้ายด้วย 2 
            : index % 5 === 3
            ? 'from-[#484C51] to-[#24292E]' // ลงท้ายด้วย 3
            : index % 5 === 4
            ? 'from-green-400 to-green-600' // ลงท้ายด้วย 4
            : 'from-cyan-400 to-sky-400'; // ค่าอื่นๆ ใช้สีฟ้าปกติ

              const Shadow =
              index % 4 === 1
            ? 'shadow-[0px_1px_16px_-6px_rgba(41,_104,_236,_1)]' // ลงท้ายด้วย 1 from-blue-400 to-blue-600
            : index % 4 === 2
            ? 'shadow-[0px_1px_16px_-6px_rgba(247,_56,_89,_1)]' // ลงท้ายด้วย 2
            : index % 4 === 3
            ? 'shadow-[0px_1px_16px_-6px_rgba(72,_76,_81,_1)]' // ลงท้ายด้วย 3
            : index % 4 === 4
            ? 'shadow-[0px_1px_16px_-6px_rgba(26,_167,_78,_1)]' // ลงท้ายด้วย 4
            : 'shadow-[0px_1px_16px_-6px_rgba(49,_187,_236,_1)]'; // ค่าอื่นๆ ใช้สีฟ้าปกติ
            return (
            <motion.div
                className={`box1 bg-gradient-to-tl ${bgColor} rounded-xl box-drop ${Shadow} h-[250px] w-[250px] px-1`}
                key={index} whileHover={{ scale: 1.1 }} transition={{delay:0.1}}
            >
                <div className="h-full flex items-center justify-center">
                <div className="detail">
                    <div className="model w-full h-full flex justify-center">
                    <img src={item.PackagePic} alt="" className="w-[100px] h-[100px] drop-shadow-lg" />
                    </div>
                    <p className="font-bold text-center text-white mt-5">
                    {item.PackageName}
                    </p>
                    <div className="px-2 my-2">
                    <p className="text-white text-wrap text-sm h-[30px]">
                        {item.Explain}
                    </p>
                    </div>
                    <div className=" flex justify-center"
                    
                      >
                      <motion.div 
                          whileHover={{ scale: 1.1 }}
                          onClick={() => GotoOrderDetail(item.ID!)}
                          className="border-2 rounded px-4 opacity-100 text-md normal-case font-normal  text-white bg-transparent border-current
                          cursor-pointer"
                      >
                          สร้าง Order
                      </motion.div>
                    </div>
                   
                   
                </div>
                </div>
            </motion.div>
            );
  })}
</div>

     
      </div>
    </div>
  );
}
export default CardPackage