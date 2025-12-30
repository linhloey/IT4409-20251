import { Col, Image, InputNumber } from "antd"
import styled from "styled-components"

export const WrapperStyleImageSmall = styled(Image)`
    height: 60px;
    width: 60px;
`

export const WrapperStyleColSmall = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperImage = styled.div`
    width: 100%; 
    aspect-ratio: 1 / 1; 
    border: 1px solid #efefef;
    display: flex;
    align-items: center; 
    justify-content: center; 
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
`

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    font-size: 15px;
    line-height: 24px;
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 15px 0;
`

export const WrapperPriceTextProduct = styled.span`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`

export const WrapperPriceDiscountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WrapperOriginalPriceText = styled.span`
  color: #808089;
  text-decoration: line-through;
  font-size: 14px;
  line-height: 20px;
`;

export const WrapperDiscountText = styled.span`
  color: #ff424e;
  font-size: 13px;
  font-weight: 600;
  background: #fff0f1;
  padding: 0 4px;
  border-radius: 2px;
  border: 1px solid #ff424e;
`;

export const WrapperAddressProduct = styled.div`
    span.address {
        font-size: 15px;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        text-decoration: underline;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none;
        }
    }
`