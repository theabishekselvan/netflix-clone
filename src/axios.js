import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3'
})

export default instance

//https://api.themoviedb.org/3/discover/tv?api_key=019c26e749325c20f5f7753b61415c2a&with_networks=213
//https://api.themoviedb.org/3/discover/tv?api_key=019c26e749325c20f5f7753b61415c2a&with_networks=213