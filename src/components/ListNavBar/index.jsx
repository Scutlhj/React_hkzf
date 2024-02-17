import PropTypes from 'prop-types'
import style from './index.module.scss'
const ListNavBar = ({ list, activeIndex, onSwitch }) => {
    return (
        <div className={style.container}>
            {list.map((item, index) =>
            (
                <div key={index} className={`${style.item} ${activeIndex === index ? style.active : ''}`} onClick={() => onSwitch(index)}>
                    {item === 'hot' ? '热' : item}
                </div>
            )
            )}
        </div>
    )
}
ListNavBar.propTypes = {
    list: PropTypes.array.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onSwitch: PropTypes.func.isRequired
}

export default ListNavBar