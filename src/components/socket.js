import io from 'socket.io-client';
import getCookie from '../utils/getCookie';
const API_URL = "https://fansmaps-node-ygset.ondigitalocean.app";
// const API_URL = "http://localhost:5000";

const createSocket = () => {
    const { id } = getCookie('loggedin');
    if (!id) {
        return null;
    }

    const socketInstance = io(API_URL, {
        query: {
            userId: id,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });

    return socketInstance;
};

export default createSocket;
