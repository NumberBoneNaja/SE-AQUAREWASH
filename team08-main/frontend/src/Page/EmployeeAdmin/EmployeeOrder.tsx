
import EmployeeBar from "../../Components/Nav_bar/EmployeeBar"
import EmSidebar from "../../Components/Nav_bar/EmSidebar"
// import EmployeeAllOrder from "../../Components/OrderEmployee/EmployeeAllOrder"

import EmployeeAllOrderFix from "../../Components/OrderEmployee/EmployeeAllOrderFix"

function EmployeeOrder() {
    
    return (
        <div >
        <div className="w-full h-[100vh]  bg-[#F0FCFF] ">
             <EmployeeBar page="AllOrderUser"/>
             <EmSidebar page="EmAllOrder"/>
             <EmployeeAllOrderFix />
            </div>
       


    </div>
         
    
       
    )
}

export default EmployeeOrder