import style from './index.module.scss'
import { useState, useEffect, useRef, useMemo } from 'react'
import { SearchBar } from 'antd-mobile'
import { getCommunitiesByKeyWord } from '@/apis/area'
import { useCurrentCity } from '@/hooks/useCurrentCity'
import { useNavigate } from 'react-router-dom'
import NoHouse from '@/components/NoHouse'
const RentSearch = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [searchList, setSearchList] = useState([])
    const currentCity = useCurrentCity()
    // useRef创建的变量，每次组件渲染时都会保持不变，不会重新创建。且其修改不会触发组件重新渲染
    const timer = useRef(null)
    const isComposing = useRef(false)
    const [loading, setLoading] = useState(false)
    const resEmpty = useMemo(() => {
        return searchList.length === 0 && searchValue !== '' && !isComposing.current
    }, [searchList, searchValue])
    const searchCommunityList = (value) => {
        if (!value) {
            setSearchList([])
            return
        }
        // 延时0.5秒再执行搜索，防止频繁请求，0.5秒内多次输入只会执行一次
        clearTimeout(timer.current)
        // 切换为加载状态
        setLoading(true)
        timer.current = setTimeout(async () => {
            const { status, body } = await getCommunitiesByKeyWord(currentCity.value, value)
            // 切换为非加载状态
            setLoading(false)
            if (status === 200) {
                setSearchList(body)
            }
        }, 500)
    }
    // 在切换中文输入法时，会先触发compositionstart事件，每次输入会触发change事件，最后选择词语后触发一次change后触发compositionend事件
    const handleCompositionStart = () => {
        isComposing.current = true
    }
    const handleCompositionEnd = () => {
        isComposing.current = false
        // 输入法输入完成后执行搜索
        searchCommunityList(searchValue)
    }

    const handleChange = (value) => {
        // 无论是否在使用输入法都需要更新输入框的值
        setSearchValue(value)
        // 在输入法输入过程中不执行搜索
        if (!isComposing.current) {
            searchCommunityList(value)
        }
    }
    useEffect(() => {
        return () => {
            // 组件卸载时清除定时器
            clearTimeout(timer.current);
        };
    }, []);
    // useEffect(() => {
    //     if (!loading) {
    //         Toast.clear()
    //     } else {
    //         Toast.show({
    //             icon: 'loading',
    //             content: '加载中…',
    //             duration: 0,
    //         })
    //     }
    // }, [loading])

    return (
        <div className={style.rentsearch}>
            <div className={style.header}>
                <SearchBar
                    placeholder='请输入内容'
                    showCancelButton
                    style={{
                        '--border-radius': '100px',
                        '--background': '#ffffff',
                        '--height': '32px',
                        '--padding-left': '12px',
                    }}
                    value={searchValue}
                    onChange={handleChange}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                />
            </div>
            <div className={style.content}>
                {!loading && resEmpty && <NoHouse>没有找到相应小区，请换个搜索词吧~</NoHouse>}
                {searchList.map((item) => (
                    <div className={style.item} key={item.community} onClick={() => navigate('/rent/add', { replace: true, state: item })}>
                        {item.communityName}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RentSearch