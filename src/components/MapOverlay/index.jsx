import { useCustomOverlay } from '@uiw/react-baidu-map'
import PropTypes from 'prop-types'
import style from './index.module.scss'

const MapOverlay = ({ map, data, changeOverLay, type, setList }) => {
    const point = {
        lng: data.coord.longitude,
        lat: data.coord.latitude
    }

    // 清除老一批的圆，创建一批新的圆
    function handleCircleClick(event) {
        event.stopPropagation();
        // 设置中心点为点击点
        map.setCenter(point)
        // 更改覆盖物
        changeOverLay(data.value)
        // map.enableDragging()
    }

    function handleRectClick(event) {
        event.stopPropagation();
        const target = event.changedTouches[0]
        map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 300) / 2 - target.clientY)
        setList(data.value)
    }

    const Overlay = () => {
        if (type === 'circle') {
            return (
                <div className={style.overlay_circle} onTouchStart={handleCircleClick}>
                    <p className={style.name}>{data.label}</p>
                    <p className={style.count}>{data.count}套</p>
                </div>
            )
        } else {
            // onClick={handleRectClick}
            return (
                <div className={style.overlay_rect} onTouchStart={handleRectClick}>
                    <p className={style.name}>{data.label}</p>
                    <p className={style.count}>{data.count}套</p>
                </div>
            )
        }
    }

    const { portal } = useCustomOverlay({
        map,
        position: point,
        children: <Overlay />
    });
    return (
        <>
            {portal}
        </>
    )
}

MapOverlay.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        coord: PropTypes.shape({
            latitude: PropTypes.string.isRequired,
            longitude: PropTypes.string.isRequired,
        }).isRequired
    }).isRequired,
    changeOverLay: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    setList: PropTypes.func.isRequired
}

export default MapOverlay