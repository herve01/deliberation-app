import axios from 'axios'

//Grâce au proxy Vite, on peut utiliser directement '/api'
export const http = axios.create({
    baseURL:'/api',
    headers:{'Content-Type': 'application/json'}
})

// Intercepteru (optionnel) pour log ou gérer erreurs
http.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('API error:', err.response?.data || err.message)
        return Promise.reject(err)
    }
)