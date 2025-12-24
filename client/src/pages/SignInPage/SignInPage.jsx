import React, { useEffect, useState } from 'react'
import imageLogo from '../../assets/images/logo-login.png'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode"
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice'

const SignInPage = () => {
	const navigate = useNavigate()

	const [isShowPassword, setIsShowPassword] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const dispatch = useDispatch()

	const mutation = useMutationHooks(
		data => UserService.loginUser(data)
	)
	const { data, isPending, isSuccess } = mutation

	useEffect(() => {
		if (isSuccess) {
			navigate('/')
			localStorage.setItem('access_token', JSON.stringify(data?.access_token))
			if(data?.access_token) {
				const decoded = jwtDecode(data?.access_token)
				if(decoded?.id) {
					handleGetDetailsUser(decoded?.id, data?.access_token )
				}
			}
		}
	}, [isSuccess])

	const handleGetDetailsUser = async (id, token) => {
		const res = await UserService.getDetailsUser(id, token)
		dispatch(updateUser({...res?.data, access_token: token}))
	}

	console.log('mutation', mutation)

	const handleOnChangeEmail = (value) => {
		setEmail(value)
	}

	const handleOnChangePassword = (value) => {
		setPassword(value)
	}

	const handleNavigateSignUp = () => {
		navigate('/sign-up')
	}

	const handleSignIn = () => {
		mutation.mutate({
			email,
			password
		})
		console.log('sign-in', email, password)
	}

	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
			<div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
				<WrapperContainerLeft>
					<h1 style={{ fontSize: '32px' }}>Xin chào</h1>
					<p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Đăng nhập hoặc Tạo tài khoản</p>
					<InputForm 
						style={{ marginBottom: '10px' }} 
						placeholder="abc@gmail.com" 
						value={email} 
						onChange={handleOnChangeEmail}
					/>
					<div style={{ position: 'relative' }}>
						<span 
							style={{ zIndex: 10, position: 'absolute', top: '4px', right: '12px', cursor: 'pointer', fontSize: '15px' }}
							onClick={() => setIsShowPassword(!isShowPassword)}
						>
							{ 
								isShowPassword ? (
									<EyeFilled />
								) : (
									<EyeInvisibleFilled />
								)
							}
						</span>
						<InputForm 
							placeholder="password" 
							type={isShowPassword ? "text" : "password"} 
							value={password} 
							onChange={handleOnChangePassword}
						/>
					</div>
					{data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
					<Loading isLoading={isPending}>
						<ButtonComponent
							disabled={!email.length || !password.length }
							onClick={handleSignIn}
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
					</Loading>
					<p style={{ marginTop: '8px'}}><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
					<p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
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