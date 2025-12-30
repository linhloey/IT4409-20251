import styled from "styled-components";

export const WrapperLabelText = styled.h4`
    color: rgb(56, 56, 61)
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
`

export const WrapperTextValue = styled.span`
    color: rgb(56, 56, 61)
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    width: fit-content;

    &:hover {
        color: #0b74e5; 
        padding-left: 4px; 
    }
`

export const WrapperContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0; /
    margin-bottom: 12px;

    &:last-child {
        border-bottom: none;
    }
`

export const WrapperTextPrice = styled.div`
    padding: 6px 12px;
    color: rgb(56, 56, 61);
    border-radius: 20px;
    background-color: rgb(238, 238, 238);
    width: fit-content;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #0b74e5;
        color: #fff;
        transform: translateY(-2px); // Nhảy nhẹ lên trên khi di chuột vào
    }
`