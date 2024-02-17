import style from './index.module.scss';
import PropTypes from 'prop-types'
const NoHouse = ({ children }) => {
    const noHouseUrl = import.meta.env.VITE_APP_BASE_URL + '/img/not-found.png'
    return (
        <div className={style.nohouse}>
            <img
                className={style.img}
                src={noHouseUrl}
                alt="暂无数据"
            />
            <div className={style.msg}>{children}</div>
        </div>
    );
};

NoHouse.propTypes = {
    children: PropTypes.node.isRequired
}

export default NoHouse;