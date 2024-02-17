import style from './index.module.scss';
import PropTypes from 'prop-types'
import { useMemo } from 'react';
const HouseSupport = ({ isSelectionMode, onSelected = () => { }, showedNameList = [] }) => {
    // 应该呈现的列表,选择模式下显示全部,非选择模式下显示传入的列表,如果传入的列表为空,则显示暂无数据
    const supportingList = useMemo(() => {
        const HOUSE_PACKAGE = [
            {
                id: 1,
                name: '衣柜',
                icon: 'icon-wardrobe'
            },
            {
                id: 2,
                name: '洗衣机',
                icon: 'icon-wash'
            },
            {
                id: 3,
                name: '空调',
                icon: 'icon-air'
            },
            {
                id: 4,
                name: '天然气',
                icon: 'icon-gas'
            },
            {
                id: 5,
                name: '冰箱',
                icon: 'icon-ref'
            },
            {
                id: 6,
                name: '暖气',
                icon: 'icon-Heat'
            },
            {
                id: 7,
                name: '电视',
                icon: 'icon-vid'
            },
            {
                id: 8,
                name: '热水器',
                icon: 'icon-heater'
            },
            {
                id: 9,
                name: '宽带',
                icon: 'icon-broadband'
            },
            {
                id: 10,
                name: '沙发',
                icon: 'icon-sofa'
            }
        ]
        if (isSelectionMode) return HOUSE_PACKAGE
        return HOUSE_PACKAGE.filter((item) => showedNameList.includes(item.name))
    }, [isSelectionMode, showedNameList])
    return (
        <div className={style.supporting}>
            {supportingList.length > 0 ?
                supportingList.map((item) => {
                    const itemSelected = showedNameList.includes(item.name)
                    return (
                        <div className={`${style.supportingitem} ${isSelectionMode && itemSelected && style.active}`} key={item.id} onClick={() => onSelected(item.name)}>
                            <i className={`iconfont ${item.icon} ${style.icon}`} />
                            <span className={style.name}>{item.name}</span>
                        </div>
                    )
                })
                :
                <span className={style.nodata}>暂无数据</span>
            }
        </div>
    )
}

HouseSupport.propTypes = {
    isSelectionMode: PropTypes.bool.isRequired,
    showedNameList: PropTypes.array,
    onSelected: PropTypes.func
}

export default HouseSupport;