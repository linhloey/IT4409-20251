import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style';
import { Button, Form, Space, Select, Tag } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import ModalComponent from '../ModalComponent/ModalComponent';
import * as message from '../../components/Message/Message';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { convertPrice } from '../../utils';

const AdminOrder = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user);

    const [stateOrderDetails, setStateOrderDetails] = useState({
        isPaid: false,
        isDelivered: false,
        paymentMethod: '',
        shippingPrice: 0,
        itemsPrice: 0,
        totalPrice: 0,
    });

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = OrderService.updateOrder(id, { ...rests }, token)
            return res
        }
    );

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = OrderService.deleteOrder(id, token)
            return res
        }
    );

    const getAllOrders = async () => {
        const res = await OrderService.getAllOrders(user?.access_token)
        return res
    }

    const fetchGetDetailsOrder = async (rowSelected) => {
        const res = await OrderService.getAllOrders(user?.access_token)
        const orderDetails = res?.data?.find(order => order._id === rowSelected)
        if (orderDetails) {
            setStateOrderDetails({
                isPaid: orderDetails?.isPaid,
                isDelivered: orderDetails?.isDelivered,
                paymentMethod: orderDetails?.paymentMethod,
                shippingPrice: orderDetails?.shippingPrice,
                itemsPrice: orderDetails?.itemsPrice,
                totalPrice: orderDetails?.totalPrice,
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateOrderDetails)
    }, [form, stateOrderDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsOrder(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsOrder = () => {
        setIsOpenDrawer(true)
    }

    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'blue', fontSize: '30px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleDetailsOrder} />
            </div>
        )
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName?.localeCompare(b.userName),
            ...getColumnSearchProps('userName')
        },
        {
            title: 'User Email',
            dataIndex: 'userEmail',
            sorter: (a, b) => a.userEmail?.localeCompare(b.userEmail),
            ...getColumnSearchProps('userEmail')
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            filters: [
                { text: 'COD', value: 'COD' },
                { text: 'PayPal', value: 'PayPal' },
            ],
            onFilter: (value, record) => record.paymentMethod === value,
        },
        {
            title: 'Is Paid',
            dataIndex: 'isPaid',
            render: (isPaid) => (
                <Tag color={isPaid ? 'green' : 'red'}>
                    {isPaid ? 'Paid' : 'Not Paid'}
                </Tag>
            ),
            filters: [
                { text: 'Paid', value: true },
                { text: 'Not Paid', value: false },
            ],
            onFilter: (value, record) => record.isPaid === value,
        },
        {
            title: 'Is Delivered',
            dataIndex: 'isDelivered',
            render: (isDelivered) => (
                <Tag color={isDelivered ? 'green' : 'orange'}>
                    {isDelivered ? 'Delivered' : 'Pending'}
                </Tag>
            ),
            filters: [
                { text: 'Delivered', value: true },
                { text: 'Pending', value: false },
            ],
            onFilter: (value, record) => record.isDelivered === value,
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (price) => convertPrice(price)
        },
        {
            title: 'Shipping Address',
            dataIndex: 'shippingAddress',
            render: (address) => `${address?.fullName}, ${address?.address}, ${address?.city}`
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order,
            key: order._id,
            userName: order.user?.name,
            userEmail: order.user?.email,
            phone: order.shippingAddress?.phone
        }
    })

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setRowSelected('')
        setStateOrderDetails({
            isPaid: false,
            isDelivered: false,
            paymentMethod: '',
            shippingPrice: 0,
            itemsPrice: 0,
            totalPrice: 0,
        });
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteOrder = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted, isErrorDeleted])

    const handleOnChangeDetails = (e) => {
        setStateOrderDetails({
            ...stateOrderDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeSelect = (value, name) => {
        setStateOrderDetails({
            ...stateOrderDetails,
            [name]: value
        })
    }

    const onUpdateOrder = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateOrderDetails }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })
    }

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated])

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingOrders}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }}
                />
            </div>

            <DrawerComponent title='Chi tiết đơn hàng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                <Loading isLoading={isLoadingUpdate || isPendingUpdated}>
                    <Form
                        name="orderForm"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateOrder}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Payment Method"
                            name="paymentMethod"
                            rules={[{ required: true, message: 'Please select payment method!' }]}
                        >
                            <Select
                                name="paymentMethod"
                                value={stateOrderDetails.paymentMethod}
                                onChange={(value) => handleOnChangeSelect(value, 'paymentMethod')}
                                options={[
                                    { value: 'COD', label: 'COD' },
                                    { value: 'PayPal', label: 'PayPal' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Is Paid"
                            name="isPaid"
                            rules={[{ required: true, message: 'Please select payment status!' }]}
                        >
                            <Select
                                name="isPaid"
                                value={stateOrderDetails.isPaid}
                                onChange={(value) => handleOnChangeSelect(value, 'isPaid')}
                                options={[
                                    { value: true, label: 'Paid' },
                                    { value: false, label: 'Not Paid' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Is Delivered"
                            name="isDelivered"
                            rules={[{ required: true, message: 'Please select delivery status!' }]}
                        >
                            <Select
                                name="isDelivered"
                                value={stateOrderDetails.isDelivered}
                                onChange={(value) => handleOnChangeSelect(value, 'isDelivered')}
                                options={[
                                    { value: true, label: 'Delivered' },
                                    { value: false, label: 'Pending' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Shipping Price"
                            name="shippingPrice"
                            rules={[{ required: true, message: 'Please input shipping price!' }]}
                        >
                            <InputComponent
                                value={stateOrderDetails.shippingPrice}
                                onChange={handleOnChangeDetails}
                                name="shippingPrice"
                                type="number"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Items Price"
                            name="itemsPrice"
                            rules={[{ required: true, message: 'Please input items price!' }]}
                        >
                            <InputComponent
                                value={stateOrderDetails.itemsPrice}
                                onChange={handleOnChangeDetails}
                                name="itemsPrice"
                                type="number"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Total Price"
                            name="totalPrice"
                            rules={[{ required: true, message: 'Please input total price!' }]}
                        >
                            <InputComponent
                                value={stateOrderDetails.totalPrice}
                                onChange={handleOnChangeDetails}
                                name="totalPrice"
                                type="number"
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            <ModalComponent forceRender title="Xóa đơn hàng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteOrder}>
                <Loading isLoading={isPendingDeleted}>
                    <div>Bạn có chắc xóa đơn hàng này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminOrder
