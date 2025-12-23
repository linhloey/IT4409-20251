import { Carousel } from "antd";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Carousel)`
    .slick-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;

        width: 48px;
        height: 48px;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    .slick-arrow::before {
        font-size: 40px;
        color: #fff;
        margin: 0; 
    }
    .slick-dots {
        bottom: 10px;
    }
    .slick-dots li button::before {
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
    }
    .slick-dots li.slick-active button::before {
        color: #fff;
    }
`;
