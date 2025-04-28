import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: [],
  language: [],
  services: [],
  channels: [],
  media: [],
};

const SystemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      return {
        ...state,
        currency: action.payload,
      };
    },
    setMedia: (state, action) => {
      return {
        ...state,
        media: action.payload,
      };
    },
    setLanguage: (state, action) => {
      return {
        ...state,
        language: action.payload,
      };
    },
    BulkSetSystem: (state, action) => {
      return {
        ...state,
        currency: action.payload[0],
        services: action.payload[1],
        channels: action.payload[2],
      };
    },
    ResetSystem: (state, action) => {
      return {
        currency: [],
        language: [],
        services: [],
        channels: [],
        media: [],
      };
    },
  },
});

export const {
  setCurrency,
  setLanguage,
  setMedia,
  BulkSetSystem,
  ResetSystem,
} = SystemSlice.actions;
export default SystemSlice.reducer;
