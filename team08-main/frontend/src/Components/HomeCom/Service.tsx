import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function Service(){
    const role = localStorage.getItem('Status');
    const navigate = useNavigate()
    function ToBook(){
        navigate("/Viewtable")
    }
    function ToOrder(){
        navigate("/Order")
    }
    function Tomain(){
        navigate("/MainPack")
    }
    function Topack(){
        navigate("/MemberShipByUser")
    }
    function Toreward(){
        navigate("/Usereward")
    }



    return(
        <div className="w-full h-[280px] flex flex-col items-center pt-2 gap-5">
                <h1 className="text-[20px]">การบริการต่างๆ</h1>
        
            <div className="w-full h-fit flex justify-center gap-5 items-center">
                
                <motion.div className="w-[160px] h-[160px] bg-white rounded-md border-[2px] border-blue-bg flex flex-col
                items-center justify-around" 
                whileHover={{ scale: 1.1 }} transition={{delay:0.1}} onClick={ToBook}
                >
                    <div className=" bg-[#CFF5FF] w-fit p-3 rounded-full">
                        <img src="../icon/service1.png" alt="" className="w-16 " />
                    </div>
                    <div>
                        <h1 className="text-base-black font-semibold">จองเครื่องซัก-อบ</h1>
                    </div>
                    
                </motion.div>
                <motion.div className="w-[160px] h-[160px] bg-white rounded-md border-[2px] border-blue-bg flex flex-col
                items-center justify-around"
                whileHover={{ scale: 1.1 }} transition={{delay:0.1}}>
                <div className=" bg-[#CFF5FF] w-fit p-3 rounded-full" onClick={ToOrder}
                >
                        <img src="../icon/laundry-basket-active.png" alt="" className="w-16 " />
                    </div>
                    <div>
                        <h1 className="text-base-black font-semibold">ฝากซัก-อบ</h1>
                    </div>
                </motion.div>
                {
                    role == "User" ?(
                        <motion.div className="w-[160px] h-[160px] bg-white rounded-md border-[2px] border-blue-bg flex flex-col
                            items-center justify-around"
                            whileHover={{ scale: 1.1 }} transition={{delay:0.1}} onClick={Tomain}>
                            <div className=" bg-[#CFF5FF] w-fit p-3 rounded-full">
                                    <img src="../icon/diamond (1).png" alt="" className="w-16 " />
                                </div>
                                <div>
                                    <h1 className="text-base-black font-semibold">สมัครแพ็คเกจ</h1>
                                </div>
                            </motion.div>
                    ):(
                        <motion.div className="w-[160px] h-[160px] bg-white rounded-md border-[2px] border-blue-bg flex flex-col
                        items-center justify-around"
                        whileHover={{ scale: 1.1 }} transition={{delay:0.1}} onClick={Topack}>
                        <div className=" bg-[#CFF5FF] w-fit p-3 rounded-full">
                                <img src="../icon/diamond (1).png" alt="" className="w-16 " />
                            </div>
                            <div>
                                <h1 className="text-base-black font-semibold">สมัครแพ็คเกจ</h1>
                            </div>
                        </motion.div>
                    )
                }
                
                <motion.div className="w-[160px] h-[160px] bg-white rounded-md border-[2px] border-blue-bg flex flex-col
                items-center justify-around"
                whileHover={{ scale: 1.1 }} transition={{delay:0.1}} onClick={Toreward}>
                <div className=" bg-[#CFF5FF] w-fit p-3 rounded-full">
                        <img src="../icon/promotion (1).png" alt="" className="w-16 " />
                    </div>
                    <div>
                        <h1 className="text-base-black font-semibold">แลกของรางวัล</h1>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
export default Service