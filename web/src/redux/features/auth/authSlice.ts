import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    fullName: null,
    email: null,
    clerkId: null,
    username: null,
    profileImage: null,
    hasAccount: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.clerkId = action.payload.clerkId;
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
    },
    setHasAccount: (state, action) => {
      state.hasAccount = action.payload;
    },
  },
});

export const { setUser, setHasAccount } = authSlice.actions;
export default authSlice.reducer;
