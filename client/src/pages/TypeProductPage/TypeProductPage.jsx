import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Row, Pagination } from 'antd'
import { WrapperProducts, WrapperNavbar } from './style'
import { useParams, useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useNavigate } from 'react-router-dom';

const TypeProductPage = () => {
  const { type } = useParams()
  const { state } = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [paginate, setPaginate] = useState({
      page: 0,
      limit: 10,
      total: 1,
  })

  const handleNavigateHome = () => {
        navigate('/'); 
    }

  useEffect(() => {
      setPaginate(prev => ({ ...prev, page: 0 }))
  }, [type, state])

  const fetchProductType = async (type, page, limit) => {
    setLoading(true)
    const res = await ProductService.getProductType(type, page, limit)
    if (res?.status === 'OK') {
        setProducts(res?.data)
        setPaginate((prev) => ({ ...prev, total: res?.total }))
    } else {
        setProducts([]) 
    }
    setLoading(false)
  }

  useEffect(() => {
    const searchType = state || type
    if (searchType) {
        fetchProductType(searchType, paginate.page, paginate.limit)
    }
  }, [state, type, paginate.page, paginate.limit])

  const onChange = (current) => {
      setPaginate({ ...paginate, page: current - 1 })
  }

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '100%', background: '#efefef', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
          <h3 style={{ padding: '15px 0', margin: 0, textTransform: 'uppercase', fontSize: '14px', fontWeight: 'bold' }}>
              <span onClick={handleNavigateHome} style={{ cursor: 'pointer', color: '#888' }}>Trang chủ</span> 
              <span style={{ margin: '0 5px' }}>&gt;</span> 
              {state || type?.replace(/_/g, ' ')}
          </h3>
          <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: '100%' }}>
            <WrapperNavbar span={4}>
                <NavbarComponent />
            </WrapperNavbar>
            <Col span={20} style={{display: 'flex', flexDirection: 'column',paddingLeft: '20px', justifyContent: 'space-between'}}>
              <WrapperProducts>
                {products?.map((product) => (
                    <CardComponent
                        key={product._id}
                        {...product}
                        id={product._id}
                    />
                ))}
              </WrapperProducts>
              {paginate.total > paginate.limit && (
              <Pagination 
                  current={paginate.page + 1} 
                  total={paginate.total} 
                  pageSize={paginate.limit}
                  onChange={onChange} 
                  showSizeChanger={false}
                  style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', paddingBottom: '30px' }}
              />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  )
}

export default TypeProductPage