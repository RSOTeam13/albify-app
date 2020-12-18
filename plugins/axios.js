const requestInterceptor = (app) => {
  app.$axios.interceptors.request.use((config) => {
    const jwt = localStorage.getItem('JWT') || ''
    if (jwt) {
      config.headers.Authorization = jwt
    }

    return config
  }, (err) => {
    return Promise.reject(err)
  })
}

const responseInterceptor = (app) => {
  app.$axios.interceptors.response.use((config) => {
    return config
  }, (error) => {
    let originalRequest = error.config
    if (!originalRequest._retry && error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('JWT')
        app.router.push('/login')
        return
      }
    }
    return Promise.reject(error)
  })
}

export default ({ app }) => {
  requestInterceptor(app)
  responseInterceptor(app)
}
