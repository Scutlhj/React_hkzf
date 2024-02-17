import style from './index.module.scss'
import { DownFill } from 'antd-mobile-icons'
import PropTypes from 'prop-types'
const FilterTitle = ({ titleSelectedStatus, onTitleClick, visible }) => {
    const titleList = [
        { type: 'area', title: '区域' },
        { type: 'mode', title: '方式' },
        { type: 'price', title: '租金' },
        { type: 'more', title: '筛选' }
    ]
    return (
        <div className={style.filterbar} style={{ zIndex: visible }}>
            {titleList.map(item => {
                const isSelected = titleSelectedStatus[item.type]
                return (
                    <div className={`${style.baritem} ${isSelected ? style.active : ''}`} key={item.type} onClick={() => onTitleClick(item.type)}>
                        <span className={style.desc}>{item.title}</span>
                        <DownFill />
                    </div>
                )
            })
            }
        </div>
    )
}

FilterTitle.propTypes = {
    titleSelectedStatus: PropTypes.shape({
        area: PropTypes.bool.isRequired,
        mode: PropTypes.bool.isRequired,
        price: PropTypes.bool.isRequired,
        more: PropTypes.bool.isRequired
    }).isRequired,
    onTitleClick: PropTypes.func.isRequired,
    visible: PropTypes.number.isRequired,
}

export default FilterTitle