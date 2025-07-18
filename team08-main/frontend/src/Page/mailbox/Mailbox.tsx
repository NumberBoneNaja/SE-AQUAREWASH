import MailBoxCom from "../../Components/MailBoxCom/MailBoxCom"
import UserBar from "../../Components/Nav_bar/UserBar"

function MailBox(){
    return(
        
        <div className="w-full h-[100vh]  bg-base-blue-20 ">
              <UserBar page="MailBox"/>
              <MailBoxCom/>
        </div>
    
    )
}export default MailBox