import React from 'react'
import { Input } from 'antd'

const InputComponent = ({size, placeholder, allowClear = false, bordered, style, ...rests}) => {
  return (
        <Input 
            size={size} 
            bordered={bordered} 
            placeholder={placeholder} 
            allowClear={allowClear} 
            style={style} 
            {...rests}
        />
  )
}

export default InputComponent