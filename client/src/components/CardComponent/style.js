import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px;    
    },
    position: relative;
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61);
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`

export const WrapperPriceText = styled.div`
    color: #ff424e;
    font-size: 16px;
    font-weight: 600;
    margin: 8px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap; 
`;

export const WrapperDiscountText = styled.span`
    color: #ff424e;
    font-size: 12px;
    font-weight: 500;
    margin-left: 4px;
    background: #fff0f1;
    padding: 0 2px;
    border-radius: 2px;
`;

export const WrapperOriginalPriceText = styled.span`
    color: #808089;
    text-decoration: line-through;
    font-size: 12px;
    margin-right: 4px;
    font-weight: 400;
`;

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    font-size: 15px;
    line-height: 24px;
`