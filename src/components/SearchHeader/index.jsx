import style from './index.module.scss'
import { EnvironmentOutline, DownFill, SearchOutline, LeftOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
const SearchHeader = ({ city, hasBack }) => {
    const navigate = useNavigate()
    return (
        <div className={`${style.searchwrapper} ${hasBack ? style.hasback : ''}`}>
            {hasBack ? (
                <div className={style.backbtn} onClick={() => navigate(-1)}>
                    <LeftOutline />
                </div>
            ) : ''}
            <div className={style.searchbox}>
                <div className={style.location} onClick={() => navigate('/citylist')}>
                    <span className={style.city}>{city}</span>
                    <DownFill color='#999999' fontSize={8} />
                </div>

                <div className={style.search}>
                    <SearchOutline color='#999999' fontSize={12} />
                    <span className={style.searchtext}>请输入小区或地址</span>
                </div>

            </div>
            <div className={style.map} onClick={() => navigate('/map')}>
                <EnvironmentOutline />
            </div>
        </div>
    )
}

SearchHeader.propTypes = {
    city: PropTypes.string
}

export default SearchHeader