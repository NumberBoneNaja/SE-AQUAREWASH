import { useEffect, useState } from "react";
import "./StepperOrder.css";
import { TiTick } from "react-icons/ti";

const SteperFollow = ({step}:{step:number}) => {
  const steps = ["สร้าง Order", "ชำระเงิน", "กำลังดำเนินการ","สำเร็จ"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    nextStep()
    
  },[])
  useEffect(() => {
    nextStep()
  },[currentStep,step])
   function nextStep() {
      setCurrentStep(step);
      if (step === 4) {
        setComplete(true);
      }
      
  }
  return (
    <div className="stepper ">
      <div className="flex">
        {steps?.map((step, i) => (

          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            
         
            
            <p className="text-gray-500 mt-2 text-md">{step}</p>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default SteperFollow;