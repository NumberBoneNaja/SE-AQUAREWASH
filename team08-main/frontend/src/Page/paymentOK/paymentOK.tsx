
// import Nav_bar from "../components/NavBar/Nav_bar";


// import PaymentCom from "../../Components/paymentCom/paymentcom";
import { useParams } from "react-router-dom";
import SLipOK from "../../Components/paymentCom/slipOK";
import UserBar from "../../Components/Nav_bar/UserBar";
import StepperOrder from "../../Components/Stepper/SteperOrder";


export const apikey = 'l72ed2137c85724b61be9eee4dcef83734'

export const apisecret = '776221e9c2204ccb9c92b52ea0728829'

export const billerID ='261664370863177'


function PaymentOK() {
    const { id } = useParams<{ id: string }>(); //id payment
    return (
        <div className="bg-base-blue-20 min-h-screen">
            {/* <Nav_bar  page={"Payment"}/> */}
            <UserBar page={"Order"}/>
            <div className="mt-2 w-full flex justify-center mb-5">
                        <div className="">
                            <StepperOrder step={3}/>
                        </div>
            </div>
            <div className="w-full  flex justify-center items-center"  >
                <div>
              
                  <SLipOK  id={id || ''} />
                </div>
                
            </div>
           

        </div>
    );
}
export default PaymentOK