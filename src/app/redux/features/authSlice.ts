import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
    name: string;
}

interface User {
    name: string;
    email: string;
    role: Role
}

interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    user: User | null;
}

const initialState: AuthState = {
    token: null,
    isLoggedIn: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; user: User  }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.token = null;
            state.isLoggedIn = false;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;