import { toast } from 'react-toastify';


const Notification = {
    success(msg, options = {}) {
        return toast.success(msg, {
            ...options
        })
    },
    error(msg, options = {}) {
        return toast.error(msg, {
            ...options
        })
    },
    info(msg, options = {}) {
        return toast.info(msg, {
            ...options
        })
    },
    warn(msg, options = {}) {
        return toast.warn(msg, {
            ...options
        })
    }
}

export default Notification;