import style from './index.module.scss'
import PropTypes from 'prop-types';

const FilterFooter = ({
    cancelText = '清除',
    confirmText = '确定',
    onCancel,
    onConfirm
}) => {
    return (
        <div className={style.footer}>
            <span
                className={`${style.btn} ${style.cancel}`}
                onClick={() => onCancel()}
            >
                {cancelText}
            </span>
            <span
                className={`${style.btn} ${style.confirm}`}
                onClick={() => onConfirm()}
            >
                {confirmText}
            </span>
        </div>
    );
};

FilterFooter.propTypes = {
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default FilterFooter;