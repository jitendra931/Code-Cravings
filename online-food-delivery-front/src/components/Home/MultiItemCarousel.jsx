import React from "react";
import "./Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import CarouselItems from "./CarouselItems";
import { topMeals } from "./topMeals";

const MultiItemCarousel = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #050505, #0d0d0d)",
      }}
      className=" py-10 px-5 lg:px-20"
    >
      <h1 className="text-3xl font-bold text-white mb-8">Top Meals</h1>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={5}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
      >
        {topMeals.map((item, index) => (
          <SwiperSlide key={index}>
            <CarouselItems image={item.img} title={item.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MultiItemCarousel;
