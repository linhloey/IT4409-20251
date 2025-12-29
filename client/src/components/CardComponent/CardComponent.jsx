import React from 'react'
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle,WrapperStyleTextSell, WrapperOriginalPriceText } from './style'
import { StarFilled } from '@ant-design/icons' 
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'

const CardComponent = (props) => {
    const { countInStock, image, name, price, rating, type, selled, discount, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    const priceAfterDiscount = discount  ? price - (price * discount / 100)  : price;

  return (
    <WrapperCardStyle
        hoverable
        headStyle={{ width: '200px', height: '200px' }}
        style={{ width: 200 }}
        bodyStyle ={{ padding: '10px' }}
        cover={ <img draggable={false} alt="example" src={image}/>}
        onClick={() => handleDetailsProduct(id)}
    >
        <img 
            src={logo} 
            style={{ 
                width: '68px', 
                height: '14px', 
                position: 'absolute', 
                top: -1, 
                left: -1,
                borderTopLeftRadius: '3px'
            }} 
        />
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReportText>
            <span style={{ marginRight: '4px' }}>
                <span>{rating} </span><StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)'}} />
            </span>
            <WrapperStyleTextSell>| Đã bán {selled || 1000}</WrapperStyleTextSell>
        </WrapperReportText>
        <WrapperPriceText>
            <span>{priceAfterDiscount?.toLocaleString()} đ</span>
            
            {discount > 0 && (
                <WrapperDiscountText>-{discount}%</WrapperDiscountText>
            )}
        </WrapperPriceText>

        {discount > 0 && (
            <WrapperOriginalPriceText>
                {price?.toLocaleString()} đ
            </WrapperOriginalPriceText>
        )}
    </WrapperCardStyle>
  )
}

export default CardComponent