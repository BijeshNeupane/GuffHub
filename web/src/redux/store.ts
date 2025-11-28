import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./features/auth/authSlice";
import themereducer from "./features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authreducer,
    theme: themereducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
