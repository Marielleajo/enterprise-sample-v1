import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const UserMenuSlice = createSlice({
  name: "userMenu",
  initialState,
  reducers: {
    SetUserMenus: (state, action) => {
      return action?.payload;
    },
  },
});

export const { SetUserMenus } = UserMenuSlice.actions;
export default UserMenuSlice.reducer;
