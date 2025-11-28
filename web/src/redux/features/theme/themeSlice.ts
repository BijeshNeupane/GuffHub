import { createSlice } from "@reduxjs/toolkit";
import { darkTheme, lightTheme } from "../../../constants/theme";

const savedMode = localStorage.getItem("themeMode");
const mode = savedMode ? savedMode : "dark";

const initialColors = mode === "dark" ? darkTheme : lightTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode, colors: initialColors },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      state.colors = state.mode === "dark" ? darkTheme : lightTheme;

      // save to localStorage
      localStorage.setItem("themeMode", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
