import axiosInstance from "../APIs/config/axios";

let memberUrl = "/member/api/admin/v1";



export const GET_ALL_POLICIEs_API = async ({ token }) => {

    try {
        return await axiosInstance.get(`${memberUrl}/policy/get-all`)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.get(`${memberUrl}/policy/get-all`)
    else throw e;
    }
}

export const ADD_NEW_ROLE = async ({ token, formData }) => {
    try {
        return await axiosInstance.post(`${memberUrl}/policy`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.post(`${memberUrl}/policy`,formData)
    else throw e;
    }
}

export const DELETE_ROLE = async ({ token, id }) => {

    try {
        return await axiosInstance.delete(`${memberUrl}/Policy?Id=${id}`)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.delete(`${memberUrl}/Policy?Id=${id}`)
    else throw e;
    }
}

export const GET_ALL_SCOPES_API = async ({ token }) => {

    try {
        return await axiosInstance.get(`${memberUrl}/Menu/get-scopes`)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.get(`${memberUrl}/Menu/get-scopes`)
    else throw e;
    }
}

export const UPDATE_MENU_ORDER = async ({ token, formData }) => {

    try {
        return await axiosInstance.put(`${memberUrl}/Menu/menu-order`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.put(`${memberUrl}/Menu/menu-order`, formData)
    else throw e;
    }
}

export const UPDATE_MENU = async ({ token, formData }) => {
    try {
        return await axiosInstance.put(`${memberUrl}/Menu`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.put(`${memberUrl}/Menu`, formData)
    else throw e;
    }
}

export const ADD_MENU_ACTION = async ({ token, formData }) => {
    try {
        return await axiosInstance.post(`${memberUrl}/Menu/menu-action`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.post(`${memberUrl}/Menu/menu-action`, formData)
    else throw e;
    }
}

export const SAVE_PERMISSIONS = async ({ token, formData }) => {

    try {
        return await axiosInstance.post(`${memberUrl}/permission`, formData, { headers: { client: `backend-services` } })
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.post(`${memberUrl}/permission`, formData, { headers: { client: `backend-services` } })
    else throw e;
    }

}

export const UNASSIGN_ROLE = async ({ ExternalUserId, PolicyId  }) => {
    return axiosInstance.post(`${memberUrl}/user/unassign-role` , { ExternalUserId, PolicyId })
}


export const ASSIGN_ROLE = async ({ ExternalUserId, PolicyId  }) => {
    return axiosInstance.post(`${memberUrl}/user/assign-role` , { ExternalUserId, PolicyId })
}

export const ASSIGN_ACTION_SCOPES = async ({ token, formData }) => {

    try {
        return await axiosInstance.post(`${memberUrl}/Menu/assign-menu-action-scope`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.post(`${memberUrl}/Menu/assign-menu-action-scope`, formData)
    else throw e;
    }

}

export const DELETE_MENU_ACTION = async ({ token, menu }) => {

    try {
        return await axiosInstance.delete(`${memberUrl}/Menu/menu-action?RecordGuid=${menu}`)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.delete(`${memberUrl}/Menu/menu-action?RecordGuid=${menu}`)
    else throw e;
    }
}


export const DELETE_MENU = async ({ token, menu }) => {

    try {
        return await axiosInstance.delete(`${memberUrl}/Menu?RecordGuid=${menu}`)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.delete(`${memberUrl}/Menu?RecordGuid=${menu}`)
    else throw e;
    }

}
export const ADD_MENU = async ({ token, formData }) => {

    try {
        return await axiosInstance.post(`${memberUrl}/Menu`, formData)
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.post(`${memberUrl}/Menu`, formData)
    else throw e;
    }

}
export const GET_ALL_MENU_API = async ({ token, policy }) => {
    try {
        return await axiosInstance.get(`${memberUrl}/permission/get-policy-menu-map?PolicyName=${policy}`, { headers: { client: `backend-services` } })
    } catch (e) {
    if (e == "error: 401")
        return await axiosInstance.get(`${memberUrl}/permission/get-policy-menu-map?PolicyName=${policy}`, { headers: { client: `backend-services` } })
    else throw e;
    }
}