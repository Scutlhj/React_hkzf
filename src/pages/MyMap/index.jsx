import { useRef, useEffect, useState, useCallback } from 'react';
import { useMap } from '@uiw/react-baidu-map';
import style from './index.module.scss'
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useCurrentCity } from '@/hooks/useCurrentCity';
import { getHouses } from '@/apis/house';
import { getHoseDataByAreaId } from '@/apis/area';
import MapOverlay from '@/components/MapOverlay';
import HouseList from '@/components/HouseList';
import { Toast } from 'antd-mobile'

const initCenterPoint = {
    '广州': {
        lng: 113.2644,
        lat: 23.1291
    },
    '北京': {
        lng: 116.4074,
        lat: 39.9042
    },
    '上海': {
        lng: 121.4737,
        lat: 31.2304
    },
    '深圳': {
        lng: 114.0579,
        lat: 22.5431
    },
}

const MyMap = () => {
    const mapElm = useRef();
    const navigate = useNavigate()
    const [curHouseData, setCurHouseData] = useState([])
    const [overlayType, setOverlayType] = useState('circle')
    const [mapZoom, setMapZoom] = useState(11)
    const currentCity = useCurrentCity()
    const [showList, setShowList] = useState(false)
    const [HouseLists, setHouseLists] = useState([])

    const { setContainer, map } = useMap({
        enableScrollWheelZoom: true, // 启用滚轮放大缩小，默认禁用
        center: initCenterPoint[currentCity.label],
        zoom: mapZoom,
        widget: ['GeolocationControl', 'NavigationControl']
    });

    /*
     * 刚开始zoom为11，点击区级别为13，点击镇级别放到15，最后点击小区级别不缩放了
     */
    const getTypeAndZoom = () => {
        const zoom = map.getZoom()
        if (zoom >= 10 && zoom <= 12) {
            setMapZoom(13)
            setOverlayType('circle')
        } else if (zoom >= 13 && zoom <= 14) {
            setMapZoom(15)
            setOverlayType('rect')
        }
    }

    const fetchHouse = useCallback(async (id) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
        })
        try {
            const res = await getHoseDataByAreaId(id)
            if (res.status !== 200) return
            setCurHouseData(res.body)
        } finally {
            Toast.clear()
        }
    }, [])

    const changeOverLay = (id) => {
        // 获取下一级类型与缩放级别
        getTypeAndZoom()
        // 清除本级覆盖物
        map.clearOverlays()
        // 重新设置缩放
        map.setZoom(mapZoom)
        // 获取下一级数据
        fetchHouse(id)
    }

    const setList = async (id) => {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
        })
        try {
            const res = await getHouses(id)
            if (res.status !== 200) return
            setHouseLists(res.body.list)
            setShowList(true)
            map.addEventListener('movestart', () => {
                setShowList(false)
            })
        } finally {
            Toast.clear()
        }
    }

    useEffect(() => {
        if (Object.keys(currentCity).length > 0) {
            fetchHouse(currentCity.value)
        }
    }, [currentCity, fetchHouse])

    useEffect(() => {
        if (mapElm.current && !map) {
            setContainer(mapElm.current);
        }
    }, [map, setContainer]);
    return (
        <div className={style.mymap}>
            <NavBar onBack={() => navigate(-1)}>地图找房</NavBar>
            <div ref={mapElm} className={style.mapelm} />
            {curHouseData.map(item => (
                <MapOverlay map={map} key={item.value} data={item} changeOverLay={changeOverLay} type={overlayType} setList={setList} />
            ))}
            <HouseList showList={showList} data={HouseLists} />
        </div>
    )
}

export default MyMap;
