import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'  
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'  
import InputForm from '../../components/InputForm/InputForm'  
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel } from './style'
import * as UserService from '../../services/UserService'
import { useMutation } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice'


const ProfilePage = () => {

    const user = useSelector((state) => state.user) 
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutation(
        (data) => {
            const { id, access_token, ...rest } = data
            UserService.updateUser(id, rest, access_token)
        }
    )


    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation



    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])



    useEffect(() => {
        if(isSuccess) {
            message.success()
           handleGetDetailsUser(user?.id, user?.access_token)
        } else if(isError) {
            message.error()
        }
    }, [isSuccess, isError])


     const handleGetDetailsUser = async (id, token) => {
         if (!id || !token) return   // ⛔ CHẶN TẠI ĐÂY
                const res = await UserService.getDetailsUser(id, token)
                dispatch(updateUser({...res?.data, access_token: token}))
            }

    const handleonchangeEmail = (value) => {
        setEmail(value)
    }

    const handleonchangeName = (value) => {
        setName(value)
    }

    const handleonchangePhone = (value) => {
        setPhone(value)
    }

    const handleonchangeAddress = (value) => {
        setAddress(value)
    }

    const handleonchangeAvatar = (value) => {
        setAvatar(value)
    }


    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }
    return (  
<div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>  
<WrapperHeader>Thông tin người dùng</WrapperHeader>
<Loading isLoading={isLoading}>  
    <WrapperContentProfile>  
        <WrapperInput>  
            <WrapperLabel htmlFor='name'>Name</WrapperLabel>  
            <InputForm style={{ width: '300px' }} id='name' value={name} onChange={handleonchangeName} />  
            <ButtonComponent
					onClick={handleUpdate}
					size={40} 
					styleButton={{ 
					height: '30px',
					width: 'fit-content',
					borderRadius:'4px',  
                    padding: '2px 6px 6px'                   
				}}
				textButton={'Cập nhật'}
				styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>  
        </WrapperInput>

        <WrapperInput>  
            <WrapperLabel htmlFor='email'>Email</WrapperLabel>  
            <InputForm style={{ width: '300px' }} id='email' value={email} onChange={handleonchangeEmail} />  
            <ButtonComponent
					onClick={handleUpdate}
					size={40} 
					styleButton={{ 
					height: '30px',
					width: 'fit-content',
					borderRadius:'4px',  
                    padding: '2px 6px 6px'                   
				}}
				textButton={'Cập nhật'}
				styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>  
        </WrapperInput>

        <WrapperInput>  
            <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>  
            <InputForm style={{ width: '300px' }} id='phone' value={phone} onChange={handleonchangePhone} />  
            <ButtonComponent
					onClick={handleUpdate}
					size={40} 
					styleButton={{ 
					height: '30px',
					width: 'fit-content',
					borderRadius:'4px',  
                    padding: '2px 6px 6px'                   
				}}
				textButton={'Cập nhật'}
				styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>  
        </WrapperInput>

        <WrapperInput>  
            <WrapperLabel htmlFor='address'>Address</WrapperLabel>  
            <InputForm style={{ width: '300px' }} id='address' value={address} onChange={handleonchangeAddress} />  
            <ButtonComponent
					onClick={handleUpdate}
					size={40} 
					styleButton={{ 
					height: '30px',
					width: 'fit-content',
					borderRadius:'4px',  
                    padding: '2px 6px 6px'                   
				}}
				textButton={'Cập nhật'}
				styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>  
        </WrapperInput>

        <WrapperInput>  
            <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>  
            <InputForm style={{ width: '300px' }} id='avatar' value={avatar} onChange={handleonchangeAvatar} />  
            <ButtonComponent
					onClick={handleUpdate}
					size={40} 
					styleButton={{ 
					height: '30px',
					width: 'fit-content',
					borderRadius:'4px',  
                    padding: '2px 6px 6px'                   
				}}
				textButton={'Cập nhật'}
				styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>  
        </WrapperInput>

    </WrapperContentProfile>
</Loading>  
</div>
    )  
}
export default ProfilePage