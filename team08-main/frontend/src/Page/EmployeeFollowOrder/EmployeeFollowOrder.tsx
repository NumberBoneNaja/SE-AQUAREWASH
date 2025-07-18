import { useParams } from "react-router-dom";
import EmployeeFollowOrderCom from "../../Components/EmployeeFollowOrderCom/EmployeeFollowOrderCom";
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";

function EmployeeFollowOrder() {
    const { id } = useParams<{ id: string }>();
    return (
         <div className="w-[100vw] h-[100vh]  bg-base-blue-20   ">
        <EmployeeBar page="Order"/>
        <EmSidebar page="EmAllOrder"/>
        <EmployeeFollowOrderCom id={id || ''}/>  
         
                    
        
                    
            
         

    </div>
    )
   
;
}export default EmployeeFollowOrder