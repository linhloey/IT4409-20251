import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Image, InputNumber, Divider, Form, Button, message, Radio } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Message from '../../components/Message/Message'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { WrapperOrder, HeaderOrder, Content, OrderList, OrderItem, ProductInfo, ProductName, ProductPrice, Summary, SummaryRow, Label, ActionsRow, WrapperRadio } from './styles'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { updateUser } from '../../redux/slices/userSlice'
import { clearOrder } from '../../redux/slices/orderSlide'

const PaymentPage = () => {
  const [isModalOpenUpdateAInfo, setIsModalOpenUpdateAInfo] = useState(false)
  const [payment, setPayment] = useState('COD')
  const [delivery, setDelivery] = useState('COD')
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
    city: ''
  });

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isModalOpenUpdateAInfo) {
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

  // Tính tổng tiền gốc (chưa trừ discount)
  const priceRaw = items
    .filter(i => checkedItems.includes(i.product))
    .reduce((total, item) => total + (Number(item.price || 0) * Number(item.amount || 0)), 0)
  // Tính tổng số tiền được giảm (tiền tiết kiệm)
  const totalDiscount = items
    .filter(i => checkedItems.includes(i.product))
    .reduce((total, item) => {
      const discountMoney = (Number(item.price) * (Number(item.discount || 0) / 100)) * Number(item.amount)
      return total + discountMoney
    }, 0)
  // Tổng tiền cuối cùng khách phải trả
  const totalPrice = priceRaw - totalDiscount

  const deliveryPrice = useMemo(() => {
    if (totalPrice > 1000000) {
      return 10000
    } else if (totalPrice === 0) {
      return 0
    } else {
      return 20000
    }
  })

  const handleCheckout = () => {
    if (user?.access_token && order?.orderItems && user?.name && user?.address && user?.phone && user?.city && priceRaw && user?.id) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItems,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceRaw,
          shippingPrice: deliveryPrice,
          totalPrice: totalPrice,
          user: user?.id
        },
        // {
        // onSuccess: () => {
        //     message.success('Thanh toán thành công')
        // }
        // }
      )
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser(id, { ...rests }, token)
      return res
    }
  );

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { token, ...rests } = data
      const res = OrderService.createOrder({ ...rests }, token)
      return res
    }
  );

  const { isPending, data } = mutationUpdate
  const { data: dataAdd, isPending: isPendingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      message.success('Đặt hàng thành công')
      dispatch(clearOrder())
      navigate('/my-order')
    } else if (isError) {
      message.error('Đặt hàng thất bại')
    }
  }, [isSuccess, isError, dataAdd])

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
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
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

  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  return (
    <WrapperOrder>
      <Loading isLoading={isPendingAddOrder}>
        <HeaderOrder>Thanh toán</HeaderOrder>
        <Content>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '12px' }}>
              <Label style={{ display: 'block', marginBottom: '16px', fontSize: '16px' }}>
                Chọn phương thức giao hàng
              </Label>
              <WrapperRadio onChange={handleDelivery} value={delivery}>
                <Radio value="fast" style={{ display: 'block', marginBottom: '8px' }}>
                  <span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm
                </Radio>
                <Radio value="gojek" style={{ display: 'block' }}>
                  <span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng nhanh
                </Radio>
              </WrapperRadio>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px' }}>
              <Label style={{ display: 'block', marginBottom: '16px', fontSize: '16px' }}>
                Chọn phương thức thanh toán
              </Label>
              <WrapperRadio onChange={handlePayment} value={payment}>
                <Radio value="COD" style={{ display: 'block', marginBottom: '8px' }}>
                  Thanh toán tiền mặt khi nhận hàng (COD)
                </Radio>
              </WrapperRadio>
            </div>
          </div>
          <Summary>
            <h3 style={{ margin: 0 }}>Thanh toán</h3>
            <div style={{ marginTop: '4px', fontSize: 14 }}>
              <span>Địa chỉ: </span>
              <span style={{ color: 'blue' }}>{`${user?.address} ${user?.city}`}</span>
              <span onClick={handleChangeAddress} style={{ cursor: 'pointer' }}>Thay đổi</span>
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
              <span>{deliveryPrice === 0 ? 'Miễn phí' : `${deliveryPrice.toLocaleString()} đ`}</span>
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
                textButton="Thanh toán"
                styleButton={{ width: '100%', background: 'rgb(26, 148, 255)', borderRadius: 4, height: 44, border: 'none' }}
                styleTextButton={{ color: '#fff', fontWeight: 700 }}
              />
            </ActionsRow>
          </Summary>
        </Content>
        <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isModalOpenUpdateAInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isPending} >
            <Form name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
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
                <InputComponent values={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>

              <Form.Item label="Phone" name="phone" rules={[
                {
                  required: true,
                  message: 'Please input your phone!',
                },
              ]}>
                <InputComponent values={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item label="Address" name="address" rules={[
                {
                  required: true,
                  message: 'Please input your address!',
                },
              ]}>
                <InputComponent values={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>

              <Form.Item label="City" name="city" rules={[
                {
                  required: true,
                  message: 'Please input your city!',
                },
              ]}>
                <InputComponent values={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </WrapperOrder>

  )
}

export default PaymentPage