import PropTypes from 'prop-types';
import style from './index.module.scss';
import { useNavigate } from 'react-router-dom';
const Nav = ({ items }) => {
    const navigate = useNavigate()
    return (
        <div className={style.nav}>
            {items.map(item => (
                <div className={style.navitem} key={item.id} onClick={() => navigate(item.to)}>
                    <img src={item.img} alt={item.des} />
                    <p>{item.des}</p>
                </div>
            ))}
        </div>
    );
}
Nav.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            img: PropTypes.string.isRequired,
            des: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
        })
    ).isRequired,
};
export default Nav;