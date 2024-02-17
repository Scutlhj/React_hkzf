import request from "@/utils/request";

const urls = {
    getHouses: "/houses",
    getFilterCondition: '/houses/condition',
    getHouseDetail: '/houses',
    getParams: "/houses/params",
    postImage: "/houses/image",
}

export const getHouses = (cityId, options) => {
    // 如果没有则使用''代替
    if (!options) return request.get(urls.getHouses, { params: { cityId } })
    const { area = '', subway = '', rentType = '', price = '', more = '', start = 1, end = 20 } = options
    return request.get(urls.getHouses, { params: { cityId, area, subway, rentType, price, more, start, end } })
}

export const getFilterCondition = (id) => request.get(urls.getFilterCondition, { params: { id } })

export const getHouseDetail = (id) => request.get(urls.getHouseDetail + `/${id}`)

export const getParams = ()=> request.get(urls.getParams)

export const postImage = (formData) => request.post(urls.postImage, formData, { headers: { 'Content-Type': 'multipart/form-data' } })