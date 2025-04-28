import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "",
  allSelectedTabs: null,
};

const SideNavSlice = createSlice({
  name: "sideNav",
  initialState,
  reducers: {
    SideNav: (state, action) => {
      return {
        ...state,
        selectedTab: action?.payload?.selectedTab,
        allSelectedTabs: action?.payload?.allSelectedTabs,
      };
    },
  },
});

export const { SideNav } = SideNavSlice.actions;
export default SideNavSlice.reducer;
