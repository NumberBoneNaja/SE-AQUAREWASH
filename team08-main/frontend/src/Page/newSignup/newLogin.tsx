import { useState } from "react";
import LoginForm from "../../Components/LoginForm/LoginForm"
import SignupForm from "../../Components/Signupform/SignUpForm";

export const ScreenMode = {
    SIGN_IN: "SIGN_IN",
    SIGN_UP: "SIGN_UP"
  };
function NewLogin() {
    const [currMode, setCurrMode] = useState(ScreenMode.SIGN_IN);
    const handleSwitchMode = (mode: typeof ScreenMode) => {
        setCurrMode(mode.SIGN_IN); // or mode.SIGN_UP
    };
    return (

        <div>
            <div className="w-full h-[100vh] flex justify-center bg-[url('../icon/20994.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="w-full h-full bg-[#112D4E] bg-opacity-50 flex justify-end ">
                {
                    currMode === ScreenMode.SIGN_IN ? (
                        <LoginForm onSwitchMode={handleSwitchMode} />
                    ) : (
                        <SignupForm onSwitchMode={handleSwitchMode} />
                    )
                    }
                   
                </div>
                  
            </div> 

         
        </div>
    )
}export default NewLogin