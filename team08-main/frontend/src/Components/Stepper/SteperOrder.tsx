import { useEffect, useState } from "react";
import "./StepperOrder.css";
import { TiTick } from "react-icons/ti";

const StepperOrder = ({step}:{step:number}) => {
  const steps = ["สร้าง Order", "ดูรายละเอียด", "ชำระเงิน"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, _setComplete] = useState(false);

  useEffect(() => {
    nextStep()
  },[])
  useEffect(() => {
   
  },[currentStep])
  function nextStep() {
      setCurrentStep(step);
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

export default StepperOrder;