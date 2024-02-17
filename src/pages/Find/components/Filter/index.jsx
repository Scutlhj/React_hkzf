import style from './index.module.scss'
import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Mask } from 'antd-mobile'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { useDispatch, useSelector } from 'react-redux'
import { setDefaultSelected, setTitleSelectedStatus } from '@/store/modules/filterSelected.Store'
import _ from 'lodash'

const Filter = ({ filterConditionData }) => {
    const { titleSelectedStatus, defaultSelected } = useSelector(state => state.filterSelected)
    const dispatch = useDispatch()
    // 控制picker是否显示，为area | mode | price显示FilterPicker
    const [openType, setOpenType] = useState('')
    // 点击item会设置status对应项为true,opentype为相应string
    const setTitleActive = (type) => {
        dispatch(setTitleSelectedStatus({
            ...titleSelectedStatus,
            [type]: true
        }))
        setOpenType(type)
    }

    const initSelected = {
        area: ['area', 'null', null, null],
        mode: ['null'],
        price: ['null'],
        more: [],
    }

    const data = useMemo(() => {
        switch (openType) {
            case 'area':
                return [filterConditionData.area, filterConditionData.subway]
            case 'mode':
                return filterConditionData.rentType
            case 'price':
                return filterConditionData.price
            case 'more':
                return [
                    {
                        title: '户型',
                        value: filterConditionData.roomType
                    }
                    ,
                    {
                        title: '朝向',
                        value: filterConditionData.oriented
                    },
                    {
                        title: '楼层',
                        value: filterConditionData.floor
                    },
                    {
                        title: '亮点',
                        value: filterConditionData.characteristic
                    }
                ]
            default:
                return []
        }
    }, [openType, filterConditionData])

    const checkTypeActive = (val) => {
        // 确定有没有val，如果点了取消或者遮罩会获取之前的defaultSelected[openType]
        const selectedValue = val ? val : defaultSelected[openType];

        dispatch(setTitleSelectedStatus({
            ...titleSelectedStatus,
            [openType]: !(_.isEqual(selectedValue, initSelected[openType]))
        }))
    }

    const onCancel = () => {
        checkTypeActive()
        setOpenType('')
    }

    const onConfirm = (type, value) => {
        checkTypeActive(value)
        dispatch(setDefaultSelected({
            ...defaultSelected,
            [type]: value
        }))
        setOpenType('')
    }

    return (
        <>
            <div className={style.filter}>
                <FilterTitle titleSelectedStatus={titleSelectedStatus} onTitleClick={setTitleActive} visible={openType && openType !== 'more' ? 1001 : 999} />
                {
                    openType && openType !== 'more' && <FilterPicker data={data} onCancel={onCancel} onConfirm={onConfirm} type={openType} defaultVal={defaultSelected[openType]} key={openType} />
                }
                {
                    openType === 'more' && <FilterMore data={data} onConfirm={onConfirm} type={openType} defaultVal={defaultSelected[openType]} />
                }
            </div>
            <Mask visible={openType} onMaskClick={onCancel} />
        </>
    )
}

Filter.propTypes = {
    filterConditionData: PropTypes.shape({
        area: PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                })
            ).isRequired
        }),
        characteristic: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        floor: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        rentType: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        oriented: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        price: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        roomType: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
        subway: PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                    children: PropTypes.arrayOf(
                        PropTypes.shape({
                            label: PropTypes.string.isRequired,
                            value: PropTypes.string.isRequired,
                        })
                    )
                })
            ).isRequired
        }),
    }).isRequired
}

export default Filter