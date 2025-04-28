import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  refreshToken: null,
  role: null,
  username: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    SignIn: (state, action) => {
      return {
        ...state,
        token: action?.payload?.token,
        refreshToken: action?.payload?.refreshToken,
        role: action?.payload?.role,
        username: action?.payload?.username,
      };
    },
    SignOut: (state, action) => {
      return {
        token: null,
        refreshToken: null,
        role: null,
        username: null,
      };
    },
  },
});

export const { SignIn, SignOut } =
  authSlice.actions;
export default authSlice.reducer;
