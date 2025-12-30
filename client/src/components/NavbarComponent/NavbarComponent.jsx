import React, { useEffect, useState } from 'react'
import { Checkbox, Rate } from 'antd'
import { WrapperContent, WrapperLabelText, WrapperTextValue, WrapperTextPrice } from './style'
import * as ProductService from '../../services/ProductService'
import { useNavigate } from 'react-router-dom'

const NavbarComponent = () => {
    const [typeProducts, setTypeProducts] = useState([])
    const navigate = useNavigate()

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const handleNavigateType = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_')}`, { state: type })
    }

    const onChange = () => { }
    const renderContent =(type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => (
                    <WrapperTextValue 
                        key={option} 
                        onClick={() => handleNavigateType(option)}
                    >
                        {option}
                    </WrapperTextValue>
                ))
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => (
                            <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                        ))}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => (
                    <div key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                        <span style={{ fontSize: '13px' }}>{`từ ${option} sao`}</span>
                    </div>
                ))
            case 'price':
                return options.map((option) => (
                    <WrapperTextPrice key={option}>{option}</WrapperTextPrice>
                ))
            default:
                return null
        }
    }

    return (
        <div style={{backgroundColor: '#FFF', padding: '10px', borderRadius: '4px'}}>
            <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
            <WrapperContent>
                {renderContent('text', typeProducts)}
            </WrapperContent>

            <WrapperLabelText>Đánh giá</WrapperLabelText>
            <WrapperContent>
                {renderContent('star', [5, 4, 3])}
            </WrapperContent>

            <WrapperLabelText>Giá tiền</WrapperLabelText>
            <WrapperContent>
                {renderContent('price', ['Dưới 500.000', '500.000 - 2.000.000', 'Trên 2.000.000'])}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent