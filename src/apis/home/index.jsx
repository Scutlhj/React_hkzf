import request from '@/utils/request';
const urls = {
    getSwiper: '/home/swiper',
    getGroupsByAreaId: '/home/groups',
    getNewsByAreaId: '/home/news',
}

export const getSwiper = () => request.get(urls.getSwiper)

export const getGroupsByAreaId = (areaId = 'AREA|88cff55c-aaa4-e2e0') => request.get(urls.getGroupsByAreaId, { params: { area: areaId } })

export const getNewsByAreaId = (areaId = 'AREA|88cff55c-aaa4-e2e0') => request.get(urls.getNewsByAreaId, { params: { area: areaId } })