const CITY_KEY = 'cur_city'

export const setCurCity = (val) => localStorage.setItem(CITY_KEY, JSON.stringify(val))

export const getCurCity = () => JSON.parse(localStorage.getItem(CITY_KEY))

export const removeCurCity = () => localStorage.removeItem(CITY_KEY)