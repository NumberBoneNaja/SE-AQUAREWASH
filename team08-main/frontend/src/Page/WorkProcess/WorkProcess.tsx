import EmployeeBar from "../../Components/Nav_bar/EmployeeBar";
import EmSidebar from "../../Components/Nav_bar/EmSidebar";
import Work from "../../Components/Work/Work";

function WorkProcess() {
    return <div>
            <div className="w-full h-[100vh]  bg-[#F0FCFF] overflow-y-hidden">
                <EmployeeBar page="AllOrderUser"/>
                <EmSidebar page="WorkProcess"/>
                <Work />
                </div>
        </div>;
}

export default WorkProcess;