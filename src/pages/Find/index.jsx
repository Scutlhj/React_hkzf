import styles from './index.module.scss'
import SearchHeader from '@/components/SearchHeader';
import { useCurrentCity } from '@/hooks/useCurrentCity';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Filter from './components/Filter';
import { getHouses } from '@/apis/house';
import { useNavigate } from 'react-router-dom';
import { getFilterCondition } from '@/apis/house';
import { Toast } from 'antd-mobile';
import { useDispatch } from 'react-redux';
import { autoResetState } from '@/store/modules/filterSelected.Store';
import { AutoSizer, List, WindowScroller, InfiniteLoader } from 'react-virtualized';
import { useSelector } from 'react-redux';
import HouseItem from '@/components/HouseItem';
import NoHouse from '@/components/NoHouse';
import Sticky from '@/components/Sticky';

const Find = () => {
    const dispatch = useDispatch()
    const currentCity = useCurrentCity()
    const navigate = useNavigate()
    const findHome = useRef()
    const [houseList, setHouseList] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const [filterData, setFilterData] = useState({});
    const needReset = useRef(true)
    // 把之前的selected数据放仓库里了
    const { defaultSelected } = useSelector(state => state.filterSelected)
    // const { scrollTop } = useSelector(state => state.filterSelected)
    const [rowCount, setRowCount] = useState(0)
    const fetchHouseData = useCallback(async (cityId, options) => {
        const res = await getHouses(cityId, options)
        if (res.status !== 200) return
        // 如果是useEffect的请求的话，就不会有start和end,也不会走下面的房源show
        if (options.start && options.end) {
            setHouseList(pre => {
                return [...pre, ...res.body.list]
            })
            setRowCount(res.body.count)
            return
        }
        setHouseList(res.body.list)
        setRowCount(res.body.count)
        if (res.body.count !== 0) {
            setTimeout(() => {
                Toast.show(`共找到${res.body.count}套房源`)
            }, 200)
        }
    }, [])

    const areaData = useMemo(() => {
        if (defaultSelected.area[0] === 'subway') return
        return defaultSelected.area.findLast(item => item !== 'area' && item !== 'null' && item !== null)
    }, [defaultSelected.area])

    const subwayData = useMemo(() => {
        if (defaultSelected.area[0] === 'area') return
        return defaultSelected.area.findLast(item => item !== 'subway' && item !== 'null' && item !== null)
    }, [defaultSelected.area])

    const options = useMemo(() => {
        return {
            area: areaData,
            subway: subwayData,
            rentType: defaultSelected.mode[0],
            price: defaultSelected.price[0],
            more: defaultSelected.more.join(','),
        }
    }, [defaultSelected, areaData, subwayData])

    const fetchFilterCondition = useCallback(async (id) => {
        try {
            const res = await getFilterCondition(id)
            if (res.status !== 200) return
            setFilterData(res.body)
        } catch {
            Toast.show('网络错误')
        }
    }, [])

    useEffect(() => {
        if (currentCity.value) {
            fetchFilterCondition(currentCity.value)
        }
    }, [currentCity, fetchFilterCondition]);

    useEffect(() => {
        const initLoadingHouseData = async () => {
            if (currentCity.value) {
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                })
                try {
                    await fetchHouseData(currentCity.value, options)
                } finally {
                    Toast.clear()
                    setHasLoaded(true)
                }
            }
        }
        setHasLoaded(false)
        initLoadingHouseData()
        findHome.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        })
    }, [options, currentCity, fetchHouseData])

    const naviToDetail = useCallback((id) => {
        needReset.current = false
        // dispatch(setScrollTop(top))
        navigate(`/detail?id=${id}`)
    }, [navigate])

    const rowRenderer = ({ key, index, style }) => {
        const item = houseList[index];
        // 渲染正常的列表项
        if (!item) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}>loading</p>
                </div>
            )
        }
        return (
            <HouseItem key={key} item={item} style={style} onClickHandler={() => naviToDetail(item.houseCode)} />
        );
    }
    const isRowLoaded = ({ index }) => {
        return !!houseList[index]
    }

    const loadMoreRows = useCallback(({ startIndex, stopIndex }) => {
        return fetchHouseData(currentCity.value, { ...options, start: startIndex, end: stopIndex })
    }, [currentCity, fetchHouseData, options])

    // 判断是否清除筛选条件,如果有需要回滚则回滚至当前模样
    useEffect(() => {
        // if (scrollTop > 0) {
        //     setTimeout(() => {
        //         findHome.current.scrollTo({
        //             top: scrollTop,
        //             left: 0,
        //             behavior: "smooth",
        //         })
        //     }, 1000)
        // }
        return () => {
            dispatch(autoResetState(needReset.current))
        }
    }, [needReset, dispatch])

    return (
        <>
            <div className={styles.findhome} ref={findHome}>
                <SearchHeader city={currentCity.label} hasBack={true} />
                <Sticky scrollElement={findHome}>
                    <Filter filterConditionData={filterData}></Filter>
                </Sticky>
                <div className={styles.homelist}>
                    {houseList.length === 0 && hasLoaded ? <NoHouse >没有找到房源，请您换个搜索条件吧</NoHouse> : null}
                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={rowCount}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <WindowScroller scrollElement={findHome.current}>
                                {({ height, isScrolling, scrollTop, onChildScroll }) => {
                                    return (
                                        <AutoSizer disableHeight>
                                            {({ width }) => {
                                                return (
                                                    <List
                                                        autoHeight
                                                        onRowsRendered={onRowsRendered}
                                                        onScroll={onChildScroll}
                                                        ref={registerChild}
                                                        width={width}
                                                        height={height}
                                                        rowCount={rowCount}
                                                        rowHeight={120}
                                                        rowRenderer={rowRenderer}
                                                        isScrolling={isScrolling}
                                                        scrollTop={scrollTop}
                                                    />
                                                )
                                            }
                                            }
                                        </AutoSizer>
                                    )
                                }}
                            </WindowScroller>
                        )}
                    </InfiniteLoader>
                </div>
            </div>
        </>
    );
}
export default Find;