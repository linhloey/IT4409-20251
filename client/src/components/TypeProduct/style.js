import styled from "styled-components";

export const WrapperType = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #0b74e5; 
    background-color: rgba(11, 116, 229, 0.05); 
    border-radius: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #0b74e5;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 80%; 
  }
`;