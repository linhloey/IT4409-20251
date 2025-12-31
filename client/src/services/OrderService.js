import { axiosJWT } from "./UserService"

// export const createOrder = async (data, access_token) => {
//     const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

export const createOrder = async (data, access_token) => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/order/create`;
        console.log("==> Calling API URL:", url); // Kiểm tra xem url có bị undefined không
        console.log("==> Token gửi đi:", access_token);

        const res = await axiosJWT.post(url, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        })
        return res.data
    } catch (error) {
        console.error("Axios Error:", error.response || error.message);
        throw error; // Ném lỗi để useMutation nhận biết được isError
    }
}

export const getOrdersByUser = async (userId, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${userId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder = async (orderId, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${orderId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrders = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updateOrder = async (orderId, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update/${orderId}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteOrder = async (orderId, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete/${orderId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}