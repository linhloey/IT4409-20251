import React, { useState } from 'react'
import imageLogo from '../../assets/images/logo-login.png'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

const SignInPage = () => {
	const [isShowPassword, setIsShowPassword] = useState(false)
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
			<div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
				<WrapperContainerLeft>
					<h1 style={{ fontSize: '32px' }}>Xin chào</h1>
					<p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Đăng nhập hoặc Tạo tài khoản</p>
					<InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" />
					<div style={{ position: 'relative' }}>
						<span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '12px', cursor: 'pointer', fontSize: '15px' }}>
							{ 
								isShowPassword ? (
									<EyeFilled />
								) : (
									<EyeInvisibleFilled />
								)
							}
						</span>
						<InputForm placeholder="password" type={isShowPassword ? "text" : "password"} />
					</div>
					<ButtonComponent
						border={false}
						size={40} 
						styleButton={{ 
							background: 'rgb(255, 57, 69)', 
							height: '48px',
							width: '100%',
							border: 'none',
							borderRadius:'4px',  
							margin: '26px 0 10px'                   
						}}
						textButton={'Đăng nhập'}
						styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
					></ButtonComponent>
					<p style={{ marginTop: '8px'}}><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
					<p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Chưa có tài khoản? <WrapperTextLight>Tạo tài khoản</WrapperTextLight></p>
				</WrapperContainerLeft>
				<WrapperContainerRight>
					<Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
					<h4>Mua sắm tại WEBSITE</h4>
				</WrapperContainerRight>
			</div>
		</div>
	)
}

export default SignInPage