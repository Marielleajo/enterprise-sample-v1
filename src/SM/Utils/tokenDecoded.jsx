import {jwtDecode} from 'jwt-decode'

const IsTokenExpired = (token) => {
    const decoded = token ? jwtDecode(token) : null
    const exp = decoded?.exp
    const nowInSeconds = Math.floor(Date.now() / 1000)

    return exp ? nowInSeconds >= exp : true
}

export default IsTokenExpired
