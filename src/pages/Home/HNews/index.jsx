import style from './index.module.scss';
import PropTypes from 'prop-types';
const HNews = ({ newsItem }) => {
    return (
        <div className={style.hnews}>
            <h2 className={style.title}>最新资讯</h2>
            <div className={style.content}>
                {newsItem.map(item => (
                    <div className={style.item} key={item.id}>
                        <div className={style.imgwrap}>
                            <img className={style.img} src={`${import.meta.env.VITE_APP_BASE_URL}${item.imgSrc}`} />
                        </div>
                        <div className={style.info}>
                            <h3 className={style.title}>{item.title}</h3>
                            <div className={style.desc}>
                                <span className={style.from}>{item.from}</span>
                                <span className={style.date}>{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
HNews.propTypes = {
    newsItem: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            from: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            imgSrc: PropTypes.string.isRequired,
        })
    ).isRequired,
};
export default HNews;