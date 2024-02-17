import PropTypes from 'prop-types';
import { Mask } from 'antd-mobile';
import style from './index.module.scss'
const ConfirmMask = ({
    title,
    cancelText = '取消',
    confirmText = '确定',
    onCancel,
    onConfirm,
    visible
}) => {
    return (
        <Mask
            visible={visible}
            color='rgba(0,0,0,0.25)'
        >
            <div className={style.confirm}>
                <span className={style.title}>{title}</span>
                <div className={style.btns}>
                    <span className={style.cancelbtn} onClick={onCancel}>{cancelText}</span>
                    <span className={style.logoutbtn} onClick={onConfirm}>{confirmText}</span>
                </div>
            </div>
        </Mask>
    )
}
ConfirmMask.propTypes = {
    title: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    visible: PropTypes.bool.isRequired
};

export default ConfirmMask;