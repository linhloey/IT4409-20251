import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { WrapperHeader, WrapperUploadFile } from './style';
import { Button, Form, Space } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64 } from '../../utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent';

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const inittial = () => ({
      name: '',
      type: '',
      countInStock: '',
      price: '',
      rating: '',
      description: '',
      image: '',
      discount: ''
    })
    const user = useSelector((state) => state?.user)
    const [stateProduct, setStateProduct] = useState(inittial());

    const [stateProductDetails, setStateProductDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const {name, type, countInStock, price, rating, description, image, discount} = data
            const res = ProductService.createProduct({name, type, countInStock, price, rating, description, image, discount})
            return res
        }
    );

    const mutationUpdate = useMutationHooks(
        (data) => {
            const {id, token, ...rests} = data
            const res = ProductService.updateProduct(id, token, {...rests})
            return res
        }
    );

    const mutationDelete = useMutationHooks(
        (data) => {
            const {id, token} = data
            const res = ProductService.deleteProduct(id, token)
            return res
        }
    );

        const mutationDeleteMany = useMutationHooks(
        (data) => {
            const {token, ...ids} = data
            const res = ProductService.deleteManyProduct(ids, token)
            return res
        }
    );


    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
      setStateProductDetails({ name: '', type: '', countInStock: '', price: '', rating: '', description: '', image: '', discount: ''})
      setIsLoadingUpdate(true)
      const res = await ProductService.getDetailsProduct(rowSelected)
      if (res?.data) {
        setStateProductDetails({
          name: res?.data?.name,
          type: res?.data?.type,
          countInStock: res?.data?.countInStock,
          price: res?.data?.price,
          rating: res?.data?.rating,
          description: res?.data?.description,
          image: res?.data?.image,
          discount: res?.data?.discount
        })
      }
      setIsLoadingUpdate(false)
    }

    useEffect(() => {
      if(!isModalOpen) {
        form.setFieldsValue(stateProductDetails)
      } else {
        form.setFieldsValue(inittial())
      }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
      if(rowSelected && isOpenDrawer) {
        setIsLoadingUpdate(true)
        fetchGetDetailsProduct(rowSelected)
      }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
      setIsOpenDrawer(true)
    }

    const handleDeleteManyProducts = (ids) => {
      mutationDeleteMany.mutate({ids: ids, token: user?.access_token}, {
        onSettled: () =>
          queryProduct.refetch()
      })
    }

    const { data, isPending, isSuccess, isError } = mutation;
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany;

    const queryProduct = useQuery({queryKey: ['products'], queryFn: getAllProducts});
    const {isLoading: isLoadingProducts, data: products} = queryProduct

    const renderAction =() => {
        return (
            <div>
                <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{color: 'blue', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
            </div>
        )
    };

    const handleSearch = ( selectedKeys, confirm, dataIndex ) => {
      confirm();
      // setSearchText(selectedKeys[0]);
      // setSearchedColumn(dataIndex);
  };

    const handleReset = (clearFilters) => {
      clearFilters();
      // setSearchText('');
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps('name')
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: (a, b) => a.price - b.price,
        filters: [
          {
            text: '>= 500000',
            value: '>=',
          },
          {
            text: '<= 500000',
            value: '<=',
          },
        ],
        onFilter: (value, record) => {
          if(value === '>=') {
            return record.price >= 500000
          } else {
          return record.price <= 500000
          }
        },
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        sorter: (a, b) => a.rating - b.rating,
        filters: [
          {
            text: '>= 4',
            value: '>=',
          },
          {
            text: '<= 4',
            value: '<=',
          },
        ],
        onFilter: (value, record) => {
          if(value === '>=') {
            return Number(record.rating) >= 4
          } else {
          return Number(record.rating) <= 4
          }
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        ...getColumnSearchProps('type')
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
      },
    ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
      return {...product, key: product._id}
  })

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setRowSelected('')
        setStateProductDetails({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            rating: '',
            description: '',
            image: '',
            discount: ''
        });
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            rating: '',
            description: '',
            image: '',
            discount: ''
        });
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteProduct = () => {
      mutationDelete.mutate({id: rowSelected,token: user?.access_token}, {
        onSettled: () =>
          queryProduct.refetch()
      })
    }

    useEffect(() => {
        if(isSuccess && data?.status === 'OK') {
          message.success();
          handleCancel();
          queryProduct.refetch();
        } else if(isError) {
          message.error();
        }
    }, [isSuccess]);

        useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
          message.success();
        } else if(isErrorDeletedMany) {
          message.error();
        }
    }, [isSuccessDeletedMany]);

    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK') {
          message.success();
          handleCloseDrawer();
        } else if(isErrorUpdated) {
          message.error();
        }
    }, [isSuccessUpdated]);

    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK') {
          message.success();
          handleCancelDelete();
        } else if(isErrorDeleted) {
          message.error();
        }
    }, [isSuccessDeleted]);

    const onFinish = () => {
        mutation.mutate(stateProduct, { 
        onSettled: () => {
          queryProduct.refetch()
        }
      });
    };

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    };

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    };

    const handleonchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0];
        if (!file) {
            setStateProductDetails('');
            return;
        }
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const handleonchangeAvatar = async ({fileList}) => {
        const file = fileList[0];
        if (!file) {
            setStateProduct('');
            return;
        }
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
      mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails}, { 
        onSettled: () => {
          queryProduct.refetch()
        }
      })
    }
  
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button style={{height: '150px', width: '150px', borderRadius:'6px', borderStyle:'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize: '60px'}} /></Button>
      </div>
      <div style={{ marginTop: '20px'}}>
        <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} data={dataTable} isLoading={isLoadingProducts} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          }  
        }} />
      </div>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isLoading={isPending} >
          <Form name="basic" labelCol={{span: 6,}} wrapperCol={{span: 18,}} onFinish={onFinish} autoComplete="on" form={form}>
            <Form.Item label="Name" name="name" rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
            ]} >
              <InputComponent values={stateProduct.name} onChange={handleOnchange} name="name"/>
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[
                {
                  required: true,
                  message: 'Please input your type!',
                },
            ]}>
              <InputComponent values={stateProduct.type} onChange={handleOnchange} name="type"/>
            </Form.Item>

            <Form.Item label="Count inStock" name="countInStock" rules={[
                {
                  required: true,
                  message: 'Please input your countInStock!',
                },
            ]}>
              <InputComponent values={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[
                {
                  required: true,
                  message: 'Please input your price!',
                },
            ]} >
              <InputComponent values={stateProduct.price} onChange={handleOnchange} name="price"/>
            </Form.Item>

            <Form.Item label="Rating" name="rating" rules={[
                {
                  required: true,
                  message: 'Please input your rating!',
                },
            ]}>
              <InputComponent values={stateProduct.rating} onChange={handleOnchange} name="rating"/>
            </Form.Item>

            <Form.Item label="Discount" name="discount" rules={[
                {
                  required: true,
                  message: 'Please input your discount of product!',
                },
            ]}>
              <InputComponent values={stateProduct.discount} onChange={handleOnchange} name="discount"/>
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
            ]}>
              <InputComponent values={stateProduct.description} onChange={handleOnchange} name="description"/>
            </Form.Item>

            <Form.Item label="Image" name="image" rules={[
                {
                  required: true,
                  message: 'Please input your image!',
                },
            ]} >
              <WrapperUploadFile onChange={handleonchangeAvatar} maxCount={1}>
                <Button>Select File</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{ 
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                  }} alt="avatar"/>
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16,}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%" >
        <Loading isLoading={isLoadingUpdate || isPendingUpdated} >
          <Form name="basic" 
            labelCol={{span: 2}} 
            wrapperCol={{span: 22}} 
            onFinish={onUpdateProduct} 
            autoComplete="on" 
            form={form}
          >
            <Form.Item label="Name" name="name" rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
            ]} >
              <InputComponent values={stateProductDetails.name} onChange={handleOnchangeDetails} name="name"/>
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[
                {
                  required: true,
                  message: 'Please input your type!',
                },
            ]}>
              <InputComponent values={stateProductDetails.type} onChange={handleOnchangeDetails} name="type"/>
            </Form.Item>

            <Form.Item label="Count inStock" name="countInStock" rules={[
                {
                  required: true,
                  message: 'Please input your countInStock!',
                },
            ]}>
              <InputComponent values={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock"/>
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[
                {
                  required: true,
                  message: 'Please input your price!',
                },
            ]} >
              <InputComponent values={stateProductDetails.price} onChange={handleOnchangeDetails} name="price"/>
            </Form.Item>

            <Form.Item label="Rating" name="rating" rules={[
                {
                  required: true,
                  message: 'Please input your rating!',
                },
            ]}>
              <InputComponent values={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating"/>
            </Form.Item>

            <Form.Item label="Discount" name="discount" rules={[
                {
                  required: true,
                  message: 'Please input your discount of product!',
                },
            ]}>
              <InputComponent values={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount"/>
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
            ]}>
              <InputComponent values={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/>
            </Form.Item>

            <Form.Item label="Image" name="image" rules={[
                {
                  required: true,
                  message: 'Please input your image!',
                },
            ]} >
              <WrapperUploadFile onChange={handleonchangeAvatarDetails} maxCount={1}>
                <Button>Select File</Button>
                {stateProductDetails?.image && (
                  <img src={stateProductDetails?.image} style={{ 
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                  }} alt="avatar"/>
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16,}}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <Loading isLoading={isPendingDeleted} >
          <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct
