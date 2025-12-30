import { Radio } from 'antd'
import styled from 'styled-components'

export const WrapperOrder = styled.div`
  width: 1270px;
  margin: 20px auto;
  padding: 10px;
`

export const HeaderOrder = styled.h1`
  font-size: 20px;
  margin-bottom: 12px;
  color: rgb(36,36,36);
`

export const Content = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`

export const OrderList = styled.div`
  flex: 1;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  min-height: 200px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`

export const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const ProductName = styled.div`
  font-size: 14px;
  color: rgb(36,36,36);
  font-weight: 500;
  margin-bottom: 6px;
`

export const ProductPrice = styled.div`
  font-size: 13px;
  color: rgb(120,120,120);
`

export const Summary = styled.div`
  width: 360px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  height: fit-content;
  font-size: 18px
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  font-size: 14px
`

export const ActionsRow = styled.div`
  margin-top: 16px;
`

export const EmptyCartText = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #888;
`

export const Label = styled.span`
  font-size: 12px;
  color: #000;
  font-weight: bold;
`

export const WrapperRadio = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
  width: 500px;
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  padding: 16px;
  border-radius: 4px;
  font-weight: normal;
  height: 100px;
  justify-content: center;
`