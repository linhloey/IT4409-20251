import React, { useEffect, useState } from 'react'
import { Checkbox, Image, InputNumber, Divider } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Message from '../../components/Message/Message'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import {
  WrapperOrder,
  HeaderOrder,
  Content,
  OrderList,
  OrderItem,
  ProductInfo,
  ProductName,
  ProductPrice,
  Summary,
  SummaryRow,
  EmptyCartText,
  ActionsRow
} from './styles'
import { increaseAmount, decreaseAmount, removeOrderProduct } from '../../redux/slices/orderSlide'

const OrderPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const items = order?.orderItems || []

  const [checkedItems, setCheckedItems] = useState([])

  useEffect(() => {
    setCheckedItems(items.map((it) => it.product))
  }, [items])

  const onChange = (e, id) => {
    const checked = e.target.checked
    setCheckedItems(prev => checked ? Array.from(new Set([...prev, id])) : prev.filter(i => i !== id))
  }

  const handleOnChangeCheckAll = (e) => {
    const checked = e.target.checked
    setCheckedItems(checked ? items.map(i => i.product) : [])
  }

  const handleInc = (id) => dispatch(increaseAmount({ idProduct: id }))
  const handleDec = (id) => dispatch(decreaseAmount({ idProduct: id }))
  const handleRemove = (id) => dispatch(removeOrderProduct({ idProduct: id }))

  const subtotal = items
    .filter(i => checkedItems.includes(i.product))
    .reduce((s, it) => s + (Number(it.price || 0) * Number(it.amount || 0)), 0)

  const handleCheckout = () => {
    if (!checkedItems.length) {
      Message.error('Vui lòng chọn sản phẩm để thanh toán')
      return
    }
    if (!user?.id) {
      navigate('/sign-in')
      return
    }

    checkedItems.forEach(id => dispatch(removeOrderProduct({ idProduct: id })))
    setCheckedItems([])
    Message.success('Thanh toán thành công')
  }

  return (
    <WrapperOrder>
      <HeaderOrder>Giỏ hàng</HeaderOrder>
      <Content>
        <OrderList>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Checkbox
              onChange={handleOnChangeCheckAll}
              checked={items.length > 0 && checkedItems.length === items.length}
              indeterminate={checkedItems.length > 0 && checkedItems.length < items.length}
            >
              Chọn tất cả
            </Checkbox>
            <span style={{ color: '#888' }}>{items.length} sản phẩm</span>
          </div>

          {items.length === 0 ? (
            <EmptyCartText>Giỏ hàng trống</EmptyCartText>
          ) : (
            items.map((it) => (
              <OrderItem key={it.product}>
                <Checkbox checked={checkedItems.includes(it.product)} onChange={(e) => onChange(e, it.product)} />
                <Image src={it.image} width={80} height={80} preview={false} />
                <ProductInfo>
                  <ProductName>{it.name}</ProductName>
                  <ProductPrice>{(Number(it.price) || 0).toLocaleString()} đ</ProductPrice>
                </ProductInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <InputNumber min={1} value={it.amount} onChange={(val) => {
                    const newVal = Math.max(1, Number(val) || 1)
                    if (newVal > it.amount) handleInc(it.product)
                    else if (newVal < it.amount) handleDec(it.product)
                  }} />
                  <CloseOutlined style={{ color: '#f5222d', cursor: 'pointer', fontSize: 16 }} onClick={() => handleRemove(it.product)} />
                </div>
              </OrderItem>
            ))
          )}
        </OrderList>

        <Summary>
          <h3 style={{ margin: 0 }}>Thanh toán</h3>
          <Divider />
          <SummaryRow>
            <span>Tạm tính</span>
            <strong>{subtotal.toLocaleString()} đ</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </SummaryRow>
          <Divider />
          <SummaryRow style={{ fontSize: 18 }}>
            <span>Tổng</span>
            <strong>{subtotal.toLocaleString()} đ</strong>
          </SummaryRow>
          <ActionsRow>
            <ButtonComponent
              onClick={handleCheckout}
              size="large"
              textButton="Thanh toán"
              styleButton={{ width: '100%', background: 'rgb(26, 148, 255)', borderRadius: 4, height: 44, border: 'none' }}
              styleTextButton={{ color: '#fff', fontWeight: 700 }}
            />
          </ActionsRow>
        </Summary>
      </Content>
    </WrapperOrder>
  )
}

export default OrderPage