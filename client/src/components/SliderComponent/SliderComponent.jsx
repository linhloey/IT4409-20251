import React from "react";
import { WrapperSliderStyle } from './style'
import { Image } from 'antd'

const SliderComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        arrows: true,
        effect: "scrollx",
        autoplay: true,
        autoplaySpeed: 1500,
        pauseOnHover: true
    };
    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => {
                return (
                    <Image key={image} src={image} alt="slider" preview={false} width="100%" height="274px" />
                )
            })}
        </WrapperSliderStyle>
    )
};

export default SliderComponent;
