
// import Nav_bar from "../components/NavBar/Nav_bar";


import PaymentCom from "../../Components/paymentCom/paymentcom";
import { useParams } from "react-router-dom";
// import SLipOK from "../components/paymentCom/slipOK";


export const apikey = 'l72ed2137c85724b61be9eee4dcef83734'

export const apisecret = '776221e9c2204ccb9c92b52ea0728829'

export const billerID ='261664370863177'


function Payment() {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            {/* <Nav_bar  page={"Payment"}/> */}
            <h1 className="text-3xl font-semibold  text-center my-5">ชำระเงินผ่าน QR Code</h1>
            <div className="w-full h-full flex justify-center items-center"  >
                
                <div className="">
                 
                  <PaymentCom  id={id || ''} />
                </div>
                
            </div>
           

        </div>
    );
}
export default Payment