import { createSlice } from "@reduxjs/toolkit";
import { getCityList, getHotCities, getCityByName } from "@/apis/area";
import { getCurCity, setCurCity } from "@/utils/city";

const cityStore = createSlice({
    name: "city",
    initialState: {
        cityList: [],
        hotCities: [],
        currentCity: getCurCity() || {},
    },
    reducers: {
        setCityList(state, action) {
            state.cityList = action.payload;
        },
        setHotCities(state, action) {
            state.hotCities = action.payload;
        },
        setCurrentCity(state, action) {
            state.currentCity = action.payload;
        }
    }
});

const { setCityList, setHotCities, setCurrentCity } = cityStore.actions;


export const getStoreCityList = () => async dispatch => {
    const res = await getCityList();
    if (res.status !== 200) return Promise.reject('获取城市列表失败');
    const cityList = res.body;
    cityList.sort((a, b) => a.short.localeCompare(b.short));
    dispatch(setCityList(cityList));
};

export const getStoreHotCities = () => async dispatch => {
    const res = await getHotCities();
    if (res.status !== 200) return Promise.reject('获取热门城市失败');
    dispatch(setHotCities(res.body));
}

export const getStoreCurrentCity = (name) => async dispatch => {
    const res = await getCityByName(name);
    if (res.status !== 200) return Promise.reject('获取当前城市失败');
    dispatch(setCurrentCity(res.body));
    setCurCity(res.body);
}

export default cityStore.reducer;