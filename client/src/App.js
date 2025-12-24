import React, { useEffect, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode"
import * as UserService from './services/UserService'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/slices/userSlice'
import axios from "axios";

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const {storageData, decoded} = handleDecoded()
    if(decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData )
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()

    const {decoded} = handleDecoded()
    if (decoded?.exp < currentTime.getTime()/1000) {          // Neu thoi gian het han cua token < tgian htai thi goi den refreshToken cua UserService
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`  // gắn token xác thực (JWT) vào header của request HTTP
    }
    return config;
  }, function(error) {
    return Promise.reject(error)
  })

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  // const fetchApi = async () => {
  //   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
  //   return res.data
  // }

  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader
              ? DefaultComponent
              : React.Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
