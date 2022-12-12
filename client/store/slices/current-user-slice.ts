import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CurrentUserResult } from '../../types/user';

interface CurrentUserDataState {
    user: CurrentUserResult;
}

// Define the initial state using that type
const initialState: CurrentUserDataState = {
    user: {
        currentUser: null,
    },
};

export const CurrentUserDataSlice = createSlice({
    name: 'currentUser',

    initialState: initialState,

    reducers: {
        setCurrentUser(state, action: PayloadAction<CurrentUserResult>) {
            state.user = action.payload;
        },
    },
});

export const { setCurrentUser } = CurrentUserDataSlice.actions;

export default CurrentUserDataSlice.reducer;
