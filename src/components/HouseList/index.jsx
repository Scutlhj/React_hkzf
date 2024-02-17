import style from './index.module.scss'
import PropTypes from 'prop-types'
import HouseItem from '../HouseItem'
const HouseList = ({ showList, data }) => {
    return (
        <div className={`${style.houselist} ${showList ? '' : style.hide}`}>
            <div className={style.header}>
                <p className={style.title}>房屋列表</p>
                <p className={style.more}>更多房源</p>
            </div>
            <div className={style.container}>
                {data.map(item => (
                    <HouseItem item={item} key={item.houseCode} />
                )
                )}
            </div>
        </div>
    )
}

HouseList.propTypes = {
    showList: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            houseImg: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            tags: PropTypes.array.isRequired,
            price: PropTypes.number.isRequired,
            desc: PropTypes.string.isRequired,
            houseCode: PropTypes.string.isRequired
        })
    ).isRequired,
}

export default HouseList