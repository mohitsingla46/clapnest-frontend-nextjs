import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
    id: string;
    name: string;
}

interface User {
    name: string;
    email: string;
    password: string;
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
        login: (state, action: PayloadAction<{ token: string; }>) => {
            state.token = action.payload.token;
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