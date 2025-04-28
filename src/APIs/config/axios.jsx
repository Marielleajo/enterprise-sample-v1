import axios from "axios";
import {handleMessageError} from "../../SM/Utils/Functions";
import {SignIn, SignOut} from "../../Redux/New/Redux/Reducers/Authentication";
import {SetMenus} from "../../Redux/New/Redux/Reducers/Menus";
import {store} from "../../Redux/New/Redux/Redux";
import {setMedia} from "../../Redux/New/Redux/Reducers/System";

const pendingRequests = new Map();

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_IDENTITY_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store?.getState()?.authentication?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.tenant =
            config?.baseURL === `${import.meta.env.REACT_APP_API_KEYSTORE_URL}`
                ? `${import.meta.env.REACT_APP_KEYSTORE_TENANT}`
                : `${import.meta.env.VITE_TENANT}`;

        const requestKey = `${config.method}-${config.url}-${JSON.stringify(
            config.params
        )}-${JSON.stringify(config.data)}`;
        if (pendingRequests.has(requestKey)) {
            pendingRequests
                .get(requestKey)
                .cancel("Request cancelled due to duplicate request.");
        }

        const cancelTokenSource = axios.CancelToken.source();
        config.cancelToken = cancelTokenSource.token;
        pendingRequests.set(requestKey, cancelTokenSource);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        const requestKey = `${response.config.method}-${
            response.config.url
        }-${JSON.stringify(response.config.params)}-${JSON.stringify(
            response.config.data
        )}`;
        pendingRequests.delete(requestKey);
        return response;
    },
    async (error) => {
        const {config} = error;

        // if (!error.response) {
        //   console.error("Network Error: No internet connection or CORS issue.");
        //
        //   return Promise.reject(error);
        // }

        if (error.config) {
            const requestKey = `${error.config.method}-${
                error.config.url
            }-${JSON.stringify(error.config.params)}-${JSON.stringify(
                error.config.data
            )}`;
            pendingRequests.delete(requestKey);
        }

        if (axios.isCancel(error)) {
            console.warn("Request cancelled:", error.message);
            return new Promise(() => {
            });
        }

        window?.dataLayer?.push({
            event: "api_error",
            path: window.location.pathname,
            value: handleMessageError({e: error, type: "validation"}),
        });

        if (error.response.status === 401) {
            try {
                const token = await refreshToken(
                    store?.getState()?.authentication?.refreshToken
                );
                config.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(config);
            } catch (refreshError) {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

const refreshToken = (_refreshToken) => {
    return axios
        .post(
            `${
                import.meta.env.VITE_API_IDENTITY_URL
            }/member/api/v1/auth/refresh-token`,
            {RefreshToken: _refreshToken},
            {
                headers: {
                    Authorization: `Bearer ${store?.getState()?.authentication?.token}`,
                    tenant: `${import.meta.env.VITE_TENANT}`,
                },
            }
        )
        .then((res) => {
            if (res?.data?.data && res?.data?.data?.accessToken) {
                let {accessToken, refreshToken, roles, clientId} = res?.data?.data;
                store?.dispatch(
                    SignIn({
                        token: accessToken,
                        refreshToken,
                        role: roles,
                        clientId: clientId || null,
                        username: store?.getState()?.authentication?.username,
                        email: store?.getState()?.authentication?.email,
                    })
                );
            }
            return res?.data?.data?.accessToken;
        })
        .catch((error) => {
            store?.dispatch(
                SignIn({
                    token: null,
                    refreshToken: null,
                    role: null,
                    clientId: null,
                })
            );
            store?.dispatch(SignOut());
            store?.dispatch(SetMenus([]));
            store?.dispatch(setMedia({}));
            window.location.href = "/";
            return Promise.reject(error);
        });
};

export function cancelAllRequests() {
    for (const [key, cancelToken] of pendingRequests) {
        cancelToken.cancel("Requests cancelled");
        pendingRequests.delete(key);
    }
}

export default axiosInstance;
