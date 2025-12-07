import React from 'react'
import { Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const ButtonInputSearch = (props) => {
    const { 
        size, placeholder, textButton, 
        allowClear = false, bordered, backgroundColorInput = '#fff', 
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = '#fff'
    } = props;

  return (
    <div style={{ display: 'flex' }}>
        <Input 
            size={size} 
            bordered={bordered} 
            placeholder={placeholder} 
            allowClear={allowClear} 
            style={{ backgroundColor: backgroundColorInput, borderRadius:'0'}} 
        />
        <Button 
            size={size} 
            icon={<SearchOutlined style={{ color: colorButton }}/> }
            style={{ backgroundColor: backgroundColorButton, borderRadius:'0', border: !bordered && 'none'}}
        ><span style={{ color: colorButton }}>{textButton}</span></Button>
    </div>
  )
}

export default ButtonInputSearch