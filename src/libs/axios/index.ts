import axios from "axios"

const privateApi = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_SERVER_URL,
})

privateApi.interceptors.response.use((res) => {
    return res
}, (err) => {    
    throw new Error(err.response.data.error)
})

export default privateApi