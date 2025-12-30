import React, { useEffect, useState, useMemo  } from 'react'
import { Checkbox, Image, InputNumber, Divider, Form, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Message from '../../components/Message/Message'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import {WrapperOrder, HeaderOrder, Content, OrderList, OrderItem, ProductInfo, ProductName, ProductPrice, Summary, SummaryRow, EmptyCartText, ActionsRow} from './styles'
import { increaseAmount, decreaseAmount, removeOrderProduct } from '../../redux/slices/orderSlide'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import { updateUser } from '../../redux/slices/userSlice'

const OrderPage = () => {
  const [isModalOpenUpdateAInfo, setIsModalOpenUpdateAInfo] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const items = order?.orderItems || []

  const [form] = Form.useForm()

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city:''
  });

  useEffect(() => {
    if (user?.id && user?.access_token) {
        UserService.updateCart(user.id, order.orderItems, user.access_token)
    }
}, [order.orderItems, user?.id, user?.access_token])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isModalOpenUpdateAInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      })
    }
  }, [isModalOpenUpdateAInfo])

  const handleChangeAddress = () => {
    setIsModalOpenUpdateAInfo(true)
  }

  const [checkedItems, setCheckedItems] = useState(order?.orderItems?.map(i => i.product) || [])

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

  const { priceRaw, totalDiscount } = useMemo(() => {
    const selectedItems = items.filter(item => checkedItems.includes(item.product))
    const raw = selectedItems.reduce((total, item) => total + (Number(item.price || 0) * Number(item.amount || 0)), 0)
    const discount = selectedItems.reduce((total, item) => {
      return total + (Number(item.price) * (Number(item.discount || 0) / 100) * Number(item.amount))
    }, 0)
    return { priceRaw: raw, totalDiscount: discount }
  }, [items, checkedItems])

  // 2. Tổng tiền tạm tính sau khi giảm giá (để tính phí ship)
  const subTotalPrice = priceRaw - totalDiscount

  // 3. Tính phí giao hàng dựa trên tổng tiền tạm tính
  const deliveryPrice = useMemo(() => {
    if (subTotalPrice === 0 || checkedItems.length === 0) return 0
    if (subTotalPrice >= 5000000) return 0       // Trên 5 triệu: Miễn phí
    if (subTotalPrice >= 1000000) return 20000   // Từ 1 triệu đến dưới 5 triệu: 20k
    return 30000                                 // Dưới 1 triệu: 30k
  }, [subTotalPrice, checkedItems])

  // 4. Tổng tiền cuối cùng (Giá đã giảm + Phí ship)
  const totalPrice = subTotalPrice + deliveryPrice

  const handleCheckout = () => {
    if (!user?.id) {
      navigate('/sign-in')
      return
    }
    if (!checkedItems.length) {
      Message.error('Vui lòng chọn sản phẩm để thanh toán')
      return
    }
    if (!user?.id || !user?.address || !user?.name || !user?.city) {
      setIsModalOpenUpdateAInfo(true)
    } else {
      navigate('/payment', {
        state: { checkedItems: checkedItems }
      })
    }
    // checkedItems.forEach(id => dispatch(removeOrderProduct({ idProduct: id })))
    // setCheckedItems([])
    // Message.success('Thanh toán thành công')
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
        const {id, token, ...rests} = data
        const res = UserService.updateUser(id, {...rests}, token)
        return res
    }
  );

  const {isPending, data} = mutationUpdate

  const handleCancelUpdate = () => {
    setStateUserDetails({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    });
    form.resetFields();
    setIsModalOpenUpdateAInfo(false)
  }

  const handleUpdateInforUser = () => {
    const {name, address, city, phone} = stateUserDetails
    if(name && address && city && phone) {
      mutationUpdate.mutate({id: user?.id, token: user?.access_token, ...stateUserDetails}, {
        onSuccess: () => {
          dispatch(updateUser({name, address, city, phone}))
          setIsModalOpenUpdateAInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
        ...stateUserDetails,
        [e.target.name]: e.target.value
    })
  };

  return (
    <WrapperOrder>
      <HeaderOrder>Giỏ hàng</HeaderOrder>
      <Content>
        <OrderList>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Checkbox
              onChange={handleOnChangeCheckAll}
              checked={items.length > 0 && checkedItems.length === items.length}
              // indeterminate={checkedItems.length > 0 && checkedItems.length < items.length}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ProductPrice>
                      {(it.price - (it.price * (it.discount || 0) / 100)).toLocaleString()} đ
                    </ProductPrice>

                    {it.discount > 0 && (
                      <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '12px' }}>
                        {it.price.toLocaleString()} đ
                      </span>
                    )}

                    {it.discount > 0 && (
                      <span style={{ color: 'red', fontSize: '12px' }}>-{it.discount}%</span>
                    )}
                  </div>
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
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600' }}>Tóm tắt đơn hàng</h3>
          <div style={{ background: '#fcfcfc', padding: '12px',  border: '1px solid #f0f0f0',  borderRadius: '6px', marginBottom: '16px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', color: '#888' }}>Địa chỉ: </span>
              <span onClick={handleChangeAddress} style={{color: '#0b74e5', cursor: 'pointer', fontSize: '13px', fontWeight: '500'}}>Thay đổi</span>
            </div>
            <div style={{ color: '#333',  fontSize: '15px',  fontWeight: '500',  wordBreak: 'break-word',lineHeight: '1.4' }}>
              {`${user?.address} ${user?.city}`}
            </div>
          </div>
          <Divider />
          <SummaryRow>
            <span>Tạm tính</span>
            <strong>{priceRaw.toLocaleString()} đ</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Giảm giá</span>
            <span style={{ color: 'red' }}>-{totalDiscount.toLocaleString()} đ</span>
          </SummaryRow>
          <SummaryRow>
            <span>Phí vận chuyển</span>
            <span style={{ color: deliveryPrice === 0 ? '#52c41a' : '#333', fontWeight: '500' }}>
              {deliveryPrice === 0 ? 'Miễn phí' : `${deliveryPrice.toLocaleString()} đ`}
            </span>
          </SummaryRow>

          <Divider />
          <SummaryRow style={{ fontSize: 18 }}>
            <span>Tổng tiền</span>
            <strong style={{ color: 'rgb(254, 56, 52)' }}>
              {totalPrice.toLocaleString()} đ
            </strong>
          </SummaryRow>
          <ActionsRow>
            <ButtonComponent
              onClick={handleCheckout}
              size="large"
              textButton="Mua hàng"
              styleButton={{ width: '100%', background: 'rgb(26, 148, 255)', borderRadius: 4, height: 44, border: 'none' }}
              styleTextButton={{ color: '#fff', fontWeight: 700 }}
            />
          </ActionsRow>
        </Summary>
      </Content>
      <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isModalOpenUpdateAInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isPending} >
          <Form name="basic" 
            labelCol={{span: 4}} 
            wrapperCol={{span: 20}} 
            // onFinish={onUpdateUser} 
            autoComplete="on" 
            form={form}
          >
            <Form.Item label="Name" name="name" rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
            ]} >
              <InputComponent values={stateUserDetails.name} onChange={handleOnchangeDetails} name="name"/>
            </Form.Item>

            <Form.Item label="Phone" name="phone" rules={[
                {
                  required: true,
                  message: 'Please input your phone!',
                },
            ]}>
              <InputComponent values={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone"/>
            </Form.Item>

            <Form.Item label="Address" name="address" rules={[
                {
                  required: true,
                  message: 'Please input your address!',
                },
            ]}>
              <InputComponent values={stateUserDetails.address} onChange={handleOnchangeDetails} name="address"/>
            </Form.Item>

            <Form.Item label="City" name="city" rules={[
                {
                  required: true,
                  message: 'Please input your city!',
                },
            ]}>
              <InputComponent values={stateUserDetails.city} onChange={handleOnchangeDetails} name="city"/>
            </Form.Item>
          </Form>
          </Loading>
      </ModalComponent>
    </WrapperOrder>
    
  )
}

export default OrderPage