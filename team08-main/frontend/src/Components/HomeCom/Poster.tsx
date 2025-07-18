import React from 'react';
import { Carousel } from 'antd';

import poster1 from "./Promote 1.jpg";
import poster2 from "./Poster3.jpg";
import poster3 from "./ซักไม่หอมยอมคืนผ้า.mp4";
import poster4 from "./Add a heading.mp4";

const Poster: React.FC = () => {
  return (
    <div className="mt-2 w-full flex justify-center ">
      {/* เพิ่มเงาเข้มให้ div */}
      <div className="w-[100%] max-w-[1400px] rounded-lg overflow-hidden shadow-lg">
        <Carousel autoplay autoplaySpeed={5000}>
          <div className="flex justify-center items-center bg-black">
            <video
              src={poster4}
              autoPlay
              loop
              muted
              controls={false}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex justify-center items-center bg-black">
            <img
              src={poster1}
              alt="Slide 2"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex justify-center items-center bg-black">
            <img
              src={poster2}
              alt="Slide 3"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex justify-center items-center bg-black">
            <video
              src={poster3}
              autoPlay
              loop
              muted
              controls={false}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Poster;
