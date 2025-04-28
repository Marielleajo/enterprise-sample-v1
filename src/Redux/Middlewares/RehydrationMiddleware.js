var jwtDecode = require("jwt-decode");
let refresh_Timer = null;

let hasRehydrated = false;

export const onRehydrationMiddleware = store => next => action => {
  next(action);

};
