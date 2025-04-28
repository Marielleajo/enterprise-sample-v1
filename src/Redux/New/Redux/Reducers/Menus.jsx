import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const MenuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    SetMenus: (state, action) => {
      return action?.payload;
    },
  },
});

export const { SetMenus } = MenuSlice.actions;
export default MenuSlice.reducer;
