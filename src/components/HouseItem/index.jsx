import styles from './index.module.scss'
import PropTypes from 'prop-types';
const HouseItem = ({ item, style, onClickHandler }) => {
    // console.log(style)
    return (
        <div className={styles.houseitem} style={style} onClick={onClickHandler}>
            <img className={styles.bgimg} src={`${import.meta.env.VITE_APP_BASE_URL}${item.houseImg}`} />
            <div className={styles.content}>
                <div className={styles.title}>
                    {item.title}
                </div>
                <div className={styles.desc}>
                    {item.desc}
                </div>
                <div className={styles.tags}>
                    {item.tags.map(tagitem => (
                        <div className={styles.tagitem} key={`tag_${item.houseCode}_${tagitem}`}>
                            {tagitem}
                        </div>
                    ))}
                </div>
                <div className={styles.price}>
                    <p className={styles.number}>{item.price}</p>
                    <p className={styles.unit}>元/月</p>
                </div>
            </div>
        </div>
    )
}

HouseItem.propTypes = {
    item: PropTypes.shape({
        houseImg: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        tags: PropTypes.array.isRequired,
        price: PropTypes.number.isRequired,
        desc: PropTypes.string.isRequired,
        houseCode: PropTypes.string.isRequired
    }).isRequired,
    onClickHandler: PropTypes.func
};

export default HouseItem