function Add(){
    return(
        <div className="w-full bg-white flex flex-col  items-center relative">
             <div className="w-[55%]  bg-gradient-to-tl from-cyan-400 to-sky-400 absolute top-[-40px] rounded-[10px]
             grid grid-cols-3 gap-8 px-2 py-2
             ">
                <div className="flex flex-col items-center justify-center ">
                    <div className="flex items-end gap-2 w-full justify-center">
                         <h1 className="text-[35px] text-white font-semibold">10,000</h1>
                         <h1 className="text-white font-semibold mb-3">ราย</h1>
                    </div>
                    <div className="w-full flex justify-center ">
                        <p className="text-white">สำหรับผู้ใช้บริการ</p>
                    </div>
                    
                  
                </div>
                <div className="flex flex-col items-center justify-center ">
                    <div className="flex items-end gap-2 w-full justify-center">
                         <h1 className="text-[35px] text-white font-semibold">95%</h1>
                   
                    </div>
                    <div className="w-full  flex justify-center">
                        <p className="text-white ">พึงพอใจในการบริการ</p>
                    </div>
                    
                  
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-end gap-2 w-full justify-center">
                         <h1 className="text-[35px] text-white font-semibold">15</h1>
                         <h1 className="text-white font-semibold mb-3">สาขา</h1>
                    </div>
                    <div className="w-full flex justify-center ">
                        <p className="text-white">ทั่วประเทศที่พร้อมให้บริการ</p>
                    </div>
                    
                  
                </div>
               </div>
            <div className="w-[80%]  pt-20 ">
                
                <div className="flex justify-center gap-8 items-center">
                   <img src="../icon/clean-clothes.jpg" alt="" className="w-96 rounded-lg"/>
                   <div className="">
                     <h1 className="text-[28px] font-semibold my-5">"ซักสะอาด ครบจบในที่เดียว!"</h1>
                     <p>หมดปัญหากับการซักผ้าที่ยุ่งยากและเสียเวลา เพราะที่นี่เราพร้อม
                        ให้บริการแบบครบวงจร  <br />ตั้งแต่การซัก อบแห้งไปจนถึงการพับผ้าอย่าง 
                        ประณีต ด้วยเครื่องซักผ้าคุณภาพสูง <br />และเทคโนโลยีที่ทันสมัย 
                        ให้เสื้อผ้าของคุณสะอาดเหมือนใหม่ พร้อมหอมนุ่มน่าสัมผัสทุกครั้ง</p>
                   </div>
                </div>
            </div>
            <div className="w-[80%]  pt-5 pb-10">
                
                <div className="flex justify-center gap-8 items-center">
                    <div className="">
                     <h1 className="text-[28px] font-semibold my-5">"ซักได้ทุกเวลา สะอาดทันใจ ด้วยเทคโนโลยีล้ำสมัย"</h1>
                     <p>ให้เสื้อผ้าสะอาดหมดจดทุกครั้ง ใช้งานง่ายเพียงไม่กี่ขั้นตอน พร้อมบริการอบแห้งและน้ำยาปรับผ้านุ่ม <br /> เพิ่มความหอมนุ่มยาวนาน 
                      มีแพ็กเกจสมาชิกสุดคุ้ม ตอบโจทย์ชีวิตเร่งรีบ มั่นใจในความสะดวก <br />และคุณภาพที่ดีที่สุด!หมดกังวลเรื่องเวลาไม่พอ เพราะเราพร้อมให้บริการซักผ้าตลอด 24 ชั่วโมง <br />ทุกวัน ไม่มีวันหยุด <br />
                      </p>
                   </div>
                   <img src="../icon/home1.jpg" alt="" className="w-96 rounded-lg"/>
                   
                </div>
            </div>
            
        </div>
    )
}
export default Add