import PropTypes from 'prop-types';
import style from './index.module.scss';
import { Grid } from 'antd-mobile';
const Group = ({ groupitem }) => {
    return (
        <div className={style.group}>
            <div className={style.header}>
                <h2 className={style.title}>租房小组</h2>
                <span className={style.more}>更多</span>
            </div>
            <div className={style.content}>
                <Grid columns={2} gap={10}>
                    {
                        groupitem.map(item => (
                            <Grid.Item key={item.id}>
                                <div className={style.item}>
                                    <div className={style.desc}>
                                        <p className={style.title}>{item.title}</p>
                                        <span className={style.info}>{item.desc}</span>
                                    </div>
                                    <img className={style.img} src={`${import.meta.env.VITE_APP_BASE_URL}${item.imgSrc}`} />
                                </div>
                            </Grid.Item>
                        ))
                    }
                </Grid>
            </div>
        </div>
    )
}
Group.propTypes = {
    groupitem: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            desc: PropTypes.string.isRequired,
            imgSrc: PropTypes.string.isRequired,
        })
    ).isRequired,
};
export default Group;