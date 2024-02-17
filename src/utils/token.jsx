const TOKEN_KEY = 'TOKEN'

export const setToken = (val) => localStorage.setItem(TOKEN_KEY, val)

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)