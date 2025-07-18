import { useParams } from "react-router-dom";
import PayMember from "../../Components/paymentCom/payMember"
import UserBar from "../../Components/Nav_bar/UserBar";
function PaymentMemberShip() {

     const { id } = useParams<{ id: string }>();
    return (
        <div>
           <div className="w-full h-[100vh]  bg-base-blue-20 ">
                 
                <UserBar page="Order"/>
               
                <div className="w-full h-[calc(100vh-60px)] flex flex-col  items-center justify-start">
                <h1 className="text-2xl font-semibold  text-center mt-5 mb-6">ชำระเงินผ่าน QR Code</h1>
                     <PayMember id={id || ''}/>
                </div>
                
           </div>


        </div>
    )
} 
export default PaymentMemberShip