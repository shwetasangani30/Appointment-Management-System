import { io } from 'socket.io-client'
import { API_URL } from './Constants'

const socket = io(API_URL)
// const socket = io(API_URL, { autoConnect: false })

export default socket
