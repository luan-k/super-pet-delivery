"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Slider1 from "../../public/static/images/slider-1.jpg";
import Slider2 from "../../public/static/images/slider-2.jpg";
import Slider3 from "../../public/static/images/slider-3.jpg";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className='wk-slider'>
      <Slider {...settings}>
        <div>
          <Image placeholder='blur' src={Slider1} alt='slider 1' fill={true} />
        </div>
        <div>
          <Image placeholder='blur' src={Slider2} alt='slider 2' fill={true} />
        </div>
        <div>
          <Image placeholder='blur' src={Slider3} alt='slider 3' fill={true} />
        </div>
      </Slider>
    </div>
  );
}
