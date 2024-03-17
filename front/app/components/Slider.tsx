"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import Slide1 from "../../public/static/images/slider-1.jpg";
import Slide2 from "../../public/static/images/slider-2.jpg";
import Slide3 from "../../public/static/images/slider-3.jpg";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div className='wk-slider text-2xl max-w-full'>
      <Slider {...settings}>
        <div className='bg-white'>
          <Image src={Slide1} alt='Slide 1' width={1920} height={1080} />
        </div>
        <div className='bg-white'>
          <Image src={Slide2} alt='Slide 2' width={1920} height={1080} />
        </div>
        <div className='bg-white'>
          <Image src={Slide3} alt='Slide 3' width={1920} height={1080} />
        </div>
      </Slider>
    </div>
  );
}
