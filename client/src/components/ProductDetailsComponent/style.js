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

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    font-size: 15px;
    line-height: 24px;
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
    margin-right: 500;
    padding: 10px;
    margin-top: 10px;
`

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