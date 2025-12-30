import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Button, Image, message } from 'antd';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import {
    WrapperContainer,
    WrapperHeader,
    WrapperOrderList,
    WrapperOrderCard,
    WrapperOrderHeader,
    WrapperOrderContent,
    WrapperProductItem,
    WrapperProductInfo,
    WrapperProductImage,
    WrapperProductDetails,
    WrapperProductName,
    WrapperProductPrice,
    WrapperOrderFooter,
    WrapperOrderSummary,
    WrapperOrderActions,
    WrapperEmptyOrders,
    WrapperStatus,
    WrapperPaymentStatus
} from './styles';
import { useMutationHooks } from '../../hooks/useMutationHook';

const MyOrder = () => {
    const user = useSelector((state) => state.user);

    const fetchOrders = async () => {
        if (!user?.id || !user?.access_token) {
            return { data: [] };
        }
        const res = await OrderService.getOrdersByUser(user.id, user.access_token);
        return res;
    };

    const { isLoading, data: ordersData, refetch } = useQuery({
        queryKey: ['orders', user?.id],
        queryFn: fetchOrders,
        enabled: !!user?.id && !!user?.access_token,
    });

    const mutationCancel = useMutationHooks((orderId) =>
        OrderService.cancelOrder(orderId, user.access_token)
    );

    const { data: dataCanceled, isSuccess, isError } = mutationCancel;

    useEffect(() => {
        if (isSuccess && dataCanceled?.status === 'OK') {
            message.success('Đơn hàng đã được hủy thành công');
            refetch();
        } else if (isError || (dataCanceled?.status === 'ERR')) {
            message.error(dataCanceled?.message || 'Không thể hủy đơn hàng');
        }
    }, [isSuccess, isError, dataCanceled, refetch]);

    const handleCancelOrder = (orderId) => {
        mutationCancel.mutate(orderId);
    };

    const handleViewDetails = (orderId) => {
        message.info('Chi tiết đơn hàng: ' + orderId);
        // You can navigate to a details page or open a modal here
    };

    const orders = ordersData?.data || [];

    const getPaymentStatus = (order) => {
        if (order.isPaid) {
            return { text: 'Đã thanh toán', status: 'paid' };
        } else if (order.paymentMethod === 'COD') {
            return { text: 'Chưa thanh toán (COD)', status: 'unpaid' };
        } else {
            return { text: 'Chưa thanh toán', status: 'unpaid' };
        }
    };

    const getDeliveryStatus = (order) => {
        if (order.isDelivered) {
            return { text: 'Đã giao hàng', status: 'delivered' };
        } else {
            return { text: 'Đang xử lý', status: 'processing' };
        }
    };

    return (
        <Loading isLoading={isLoading}>
            <WrapperContainer>
                <WrapperHeader>Đơn hàng của tôi</WrapperHeader>

                {orders.length === 0 ? (
                    <WrapperEmptyOrders>
                        <p>Bạn chưa có đơn hàng nào</p>
                    </WrapperEmptyOrders>
                ) : (
                    <WrapperOrderList>
                        {orders.map((order) => {
                            const paymentStatus = getPaymentStatus(order);
                            const deliveryStatus = getDeliveryStatus(order);

                            return (
                                <WrapperOrderCard key={order._id}>
                                    <WrapperOrderHeader>
                                        <div>
                                            <strong>Mã đơn hàng:</strong> #{order._id}
                                        </div>
                                        <div>
                                            <strong>Ngày đặt:</strong>{' '}
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </WrapperOrderHeader>

                                    <WrapperOrderContent>
                                        {order.orderItems.map((item, index) => (
                                            <WrapperProductItem key={index}>
                                                <WrapperProductImage>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        preview={false}
                                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                </WrapperProductImage>
                                                <WrapperProductInfo>
                                                    <WrapperProductDetails>
                                                        <WrapperProductName>{item.name}</WrapperProductName>
                                                        <WrapperProductPrice>
                                                            Đơn giá: {item.price.toLocaleString('vi-VN')}₫ x {item.amount}
                                                        </WrapperProductPrice>
                                                    </WrapperProductDetails>
                                                </WrapperProductInfo>
                                            </WrapperProductItem>
                                        ))}
                                    </WrapperOrderContent>

                                    <WrapperOrderFooter>
                                        <WrapperOrderSummary>
                                            <div>
                                                <WrapperStatus status={deliveryStatus.status}>
                                                    {deliveryStatus.text}
                                                </WrapperStatus>
                                            </div>
                                            <div>
                                                <WrapperPaymentStatus status={paymentStatus.status}>
                                                    {paymentStatus.text}
                                                </WrapperPaymentStatus>
                                            </div>
                                            <div style={{ marginTop: '8px' }}>
                                                <strong>Tổng tiền:</strong>{' '}
                                                <span style={{ color: '#ee4d2d', fontSize: '18px', fontWeight: 'bold' }}>
                                                    {order.totalPrice.toLocaleString('vi-VN')}₫
                                                </span>
                                            </div>
                                        </WrapperOrderSummary>
                                        <WrapperOrderActions>
                                            <Button
                                                type="default"
                                                onClick={() => handleViewDetails(order._id)}
                                            >
                                                Chi tiết
                                            </Button>
                                            {!order.isDelivered && (
                                                <Button
                                                    type="primary"
                                                    danger
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    loading={mutationCancel.isPending}
                                                >
                                                    Hủy đơn
                                                </Button>
                                            )}
                                        </WrapperOrderActions>
                                    </WrapperOrderFooter>
                                </WrapperOrderCard>
                            );
                        })}
                    </WrapperOrderList>
                )}
            </WrapperContainer>
        </Loading>
    );
};

export default MyOrder;
