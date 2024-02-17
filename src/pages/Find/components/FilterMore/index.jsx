import style from './index.module.scss'
import FilterFooter from '@/components/FilterFooter'
import { useState } from 'react'

const FilterMore = ({ type, data, onConfirm, defaultVal }) => {
    const [selectedItem, setSelectedItem] = useState(defaultVal)
    const tagClickHandler = (value) => {
        setSelectedItem(pre => {
            if (pre.includes(value)) {
                return pre.filter(item => item !== value)
            } else {
                return [...pre, value]
            }
        })
    }
    const clearSelected = () => {
        setSelectedItem([])
    }
    return (
        <div className={style.filtermore}>
            <div className={style.morewrapper}>
                {
                    data.map(item => {
                        return (
                            <div className={style.filtermoreitem} key={item.title}>
                                <div className={style.title}>{item.title}</div>
                                <div className={style.content}>
                                    {item.value.map(tagItem => {
                                        const isSelected = selectedItem.includes(tagItem.value)
                                        return (
                                            <div className={`${style.tag} ${isSelected ? style.active : ''}`} key={tagItem.value} onClick={() => tagClickHandler(tagItem.value)}>{tagItem.label}</div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <FilterFooter onCancel={clearSelected} onConfirm={() => onConfirm(type, selectedItem)}></FilterFooter>
        </div>
    )
}

export default FilterMore