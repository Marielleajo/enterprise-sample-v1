import { LOCATION_CHANGE } from 'connected-react-router';
import dictionary from "./directionsDictionary";
let refresh_Timer = null;
/*
  This is a description of the association between signIn (and _signIn) action, refresher_Initialization action and refresh function
  A- First signIn action is dispatched, of course it is only dispatched on the success of the API call that was made in the Container that made the dispatch request.
  B- This action then dispatches 2 actions: 1- _signIn action 2- refresher_Initialization action.
  C- The _signIn simply has stores the 'token' and 'expiry' in the state.
  The refresher_Initialization depends on _signIn action (and later refreshSuccess), since dispatch itself is synchronous then refresher_Initialization is excuted after _signIn.
  D- What refresher_Initialization does is extract the token from the state, check its expiry time then set up a timer to call refresh function 
  one minute before expiring.
  refresh function will make an axios call to get the new token, when it gets it successfully it makes two dispatches, one dispatch call to
  refreshSuccess which stores the new token, the following dispatch is to refresher_Initialization itself. This means step D is repeated again in recursive manner!
*/

export const signIn = (token) => {
  return (dispatch) => {
    dispatch(refreshPages([], token));
    dispatch(_signIn(token));
    // dispatch(refresher_Initialization());
  }
}

export const changeState = payload => ({
  type: "STATE_CHANGED",
  payload
});
export const clearState = () => ({ type: "CLEAR_STATE" });

export const _signIn = (token) => ({
  type: 'SIGN_IN',
  token: token,
  refresh_token: token?.refreshToken
})

export const signOut = () => {
  return (dispatch) => {
    dispatch(clearState());
    dispatch(refreshPages([]));
    dispatch(_signOut());
    dispatch(accessTypeNone());
    dispatch(deleteRouteMemory());
    dispatch(deleteKeys());
    dispatch(deleteAPIEndPoints());
  }
}

export const _signOut = () => {
  // we must clear the timeout of refresh because it might have been declared, which means  
  // it will refresh token even after being signed out, this leads to being signed in AGAIN!!
  clearTimeout(refresh_Timer);
  return {
    type: 'SIGN_OUT'
  }
}

// notifies me that the user is not logged in
export const nonRegistered = () => ({
  type: 'NON_REGISTERED_USER'
})

export const refreshSuccess = token => ({
  type: 'REFRESH_TOKEN',
  token: token
})

export const setLanguagesData = (data) => {
  return (dispatch) => {
    dispatch(_setLanguagesData(data));
  }
}

export const _setLanguagesData = (data) => ({
  type: 'SET_LANGUAGES_DATA',
  payload: data,
})

export const setCriteriaData = (data) => {
  return (dispatch) => {
    dispatch(_setCriteriaData(data));
  }
}

export const _setCriteriaData = (data) => ({
  type: 'SET_CRITERIA_DATA',
  payload: data,
})

export const languageChange = lang => {
  return (dispatch) => {
    dispatch(_languageChange(lang));
    dispatch(dltr_rtl_dir(dictionary[lang]));
  }
}

export const mainSignIn = (token) => ({
  type: 'MAIN_SIGN_IN',
  token: token
})

export const _languageChange = lang => ({
  type: 'LANGUAGE_CHANGE',
  lang: lang
})

export const dltr_rtl_dir = (dir) => ({
  type: "DIRECTION_CHANGE",
  dir: dir
})

export const serviceAccessType = () => ({
  type: "SERVICE"
})

export const branchAccessType = () => ({
  type: "BRANCH"
})

export const multiBranchAccessType = () => ({
  type: "MULTIBRANCH"
})

export const accessTypeNone = () => ({
  type: "NO_ACCESS_TYPE"
})

export const routeChange = (path) => ({
  type: LOCATION_CHANGE,
  payload: path
})

export const deleteRouteMemory = () => ({
  type: "DELETE_ROUTES"
})

export const tenantKey = (tenant_key) => ({
  type: "TENANT_KEY",
  tenant_key
})

export const refreshTokenKey = (refresh_token_key) => ({
  type: "REFRESH_TOKEN_KEY",
  refresh_token_key
})

export const deleteKeys = () => ({
  type: "DELETE_KEYS"
})

export const mainEndPointURL = (endPointURL) => ({
  type: "MAIN_ENDPOINT_URL",
  endPointURL
})

export const refreshPages = (pages, data) => ({
  type: "REFRESH",
  pages,
  data
});

export const deleteAPIEndPoints = () => ({
  type: "DELETE_API_ENDPOINTS"
})

export const memberPages = pages => ({
  type: 'MEMBER_PAGES',
  pages: pages
})

export const customTheme = theme => ({
  type: 'CUSTOM_THEME',
  theme
})

// export const refresher_Initialization = () => {
//   return (dispatch, getState) => {
//     if (getState().authentication.token) {
//       const decoded = jwtDecode(getState().authentication.token);
//       if (getState().authentication && getState().authentication.token) {
//         refresh_Timer = setInterval(() => {
//           const remainingSeconds = decoded.exp - new Date().getTime() / 1000;
//           if (remainingSeconds < 30) {
//             clearInterval(refresh_Timer);
//             refresh(getState().authentication.token, getState().authentication.refreshToken, dispatch);
//           }
//         }, 1000);
//       } else {

//         dispatch(nonRegistered())
//         dispatch(deleteRouteMemory())
//       }
//     }
//   }
// }


export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}