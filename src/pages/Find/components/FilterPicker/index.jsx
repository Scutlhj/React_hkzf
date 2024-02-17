import style from './index.module.scss'
import { useState } from 'react'
import { CascadePickerView } from 'antd-mobile'
import FilterFooter from '@/components/FilterFooter'

const FilterPicker = ({ data, onCancel, onConfirm, type, defaultVal }) => {
    const [value, setValue] = useState(defaultVal)
    return (
        <div className={style.filterpicker}>
            <CascadePickerView
                style={{ '--height': '250px', '--item-height': '2rem' }}
                options={data}
                value={value}
                onChange={(val) => {
                    setValue(val)
                }}
            />
            <FilterFooter onCancel={onCancel} cancelText='取消' onConfirm={() => onConfirm(type, value)}></FilterFooter>
        </div>
    )
}

export default FilterPicker