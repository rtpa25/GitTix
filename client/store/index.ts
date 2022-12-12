import { configureStore } from '@reduxjs/toolkit';
import currentUserReducers from './slices/current-user-slice';

export const store = configureStore({
    reducer: {
        currentUser: currentUserReducers,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
