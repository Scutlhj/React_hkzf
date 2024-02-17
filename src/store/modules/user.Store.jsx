import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "@/apis/user";
import { getToken, setToken, removeToken } from "@/utils/token";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || '',
    },
    reducers: {
        setStoreToken(state, action) {
            state.token = action.payload
        },
    }
});

const { setStoreToken } = userStore.actions;


export const userLogin = (formVal) => async (dispatch) => {
    const res = await login(formVal)
    if (res.status !== 200) return Promise.reject(res.description)
    dispatch(setStoreToken(res.body.token))
    setToken(res.body.token)
    return Promise.resolve(res.description)
}
export const userLogout = () => async (dispatch) => {
    // const state = getState()
    // const token = state.user.token
    const res = await logout()
    // console.log(res)
    if (res.status !== 200) return Promise.reject(res.description)
    dispatch(setStoreToken(''))
    removeToken()
    return Promise.resolve(res.description)
}

export default userStore.reducer;