import request from "@/utils/request";
const urls = {
    getCityList: "/area/city",
    getHotCities: "/area/hot",
    getCityByName: "/area/info",
    getHouseDataByAreaId: '/area/map',
    getCommunitiesByKeyWord: '/area/community',
};

export const getCityList = () => request.get(urls.getCityList, { params: { level: 1 } });

export const getHotCities = () => request.get(urls.getHotCities);

export const getCityByName = name => request.get(urls.getCityByName, { params: { name } });

export const getHoseDataByAreaId = id => request.get(urls.getHouseDataByAreaId, { params: { id } })

export const getCommunitiesByKeyWord = (id, name) => request.get(urls.getCommunitiesByKeyWord, { params: { id, name } })