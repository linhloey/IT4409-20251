import React from 'react'
import { Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { 
        size, placeholder, textButton, 
        allowClear = false, bordered, backgroundColorInput = '#fff', 
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = '#fff'
    } = props;

  return (
    <div style={{ display: 'flex' }}>
        <InputComponent 
            size={size} 
            bordered={bordered} 
            placeholder={placeholder} 
            allowClear={allowClear} 
            style={{ backgroundColor: backgroundColorInput, borderRadius:'0'}}
            {...props} 
        />
        <ButtonComponent 
            type="primary"
            size={size} 
            icon={<SearchOutlined style={{ color: colorButton }}/> }
            styleButton={{ backgroundColor: backgroundColorButton, borderRadius:'0', border: !bordered && 'none'}}
            textButton={textButton}
            styleTextButton={{ color: colorButton }}
        />
    </div>
  )
}

export default ButtonInputSearch