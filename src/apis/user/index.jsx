import request from "@/utils/request";
const urls = {
    login: "/user/login",
    registered: "/user/registered",
    userInfo: "/user",
    logout: "/user/logout",
    favorite: "/user/favorites",
    rentInfo: "/user/houses",
    postHouse: "/user/houses",
    offShelf: "/user/houses"
}

export const login = (formData) => request.post(urls.login, formData)

export const registered = (formData) => request.post(urls.registered, formData)

export const getUserInfo = () => request.get(urls.userInfo)

export const patchUserInfo = (infoData) => request.patch(urls.userInfo, infoData)

export const logout = () => request.post(urls.logout)

export const checkIsFavorite = (houseCode) => request.get(urls.favorite + `/${houseCode}`)

export const addFavorite = (houseCode) => request.post(urls.favorite + `/${houseCode}`)

export const delFavorite = (houseCode) => request.delete(urls.favorite + `/${houseCode}`)

export const getFavoriteList = () => request.get(urls.favorite)

export const getRentInfo = () => request.get(urls.rentInfo)

export const postHouse = (formData) => request.post(urls.postHouse, formData)

export const offShelfHouse = (houseCode) => request.patch(urls.offShelf + `/${houseCode}`, { shelf: true })