import { useParams } from "react-router-dom";
import UserBar from "../../Components/Nav_bar/UserBar";
import FollowOrder from "../CheckOrder/FollowOrder";

function FollowOrderPage() {
    const { id } = useParams<{ id: string }>();
    return <div>
             <div className="w-full h-[100vh]  bg-[#F0FCFF]">
               <UserBar page="AllOrderUser"/>
               <div className="w-full flex justify-center mt-5 rounded-[10px]  ">
                 <FollowOrder id={id || ''}/>
               </div>
              
             </div>
        </div>;
}

export default FollowOrderPage;