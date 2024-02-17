import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useCitiesData } from '@/hooks/useCitiesData';
import { AutoSizer, List } from 'react-virtualized';
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getStoreCurrentCity } from '@/store/modules/city.Store';
import { Toast } from 'antd-mobile'
import ListNavBar from '@/components/ListNavBar';
import styles from './index.module.scss';
const titleHeight = 38;
const rowHeight = 42;
const switchTitle = (title) => {
    switch (title) {
        case '#':
            return '当前定位';
        case 'hot':
            return '热门城市';
        default:
            return title;
    }
}
const CityList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const listRef = useRef(null);
    const cityData = useCitiesData()
    const hotCity = cityData['hot']
    const cityDataArr = Object.entries(cityData);
    const cityNavi = Object.keys(cityData)
    const setCity = (item) => {
        // console.log(item)
        if (hotCity.some(itemCity => itemCity.value === item.value)) {
            dispatch(getStoreCurrentCity(item.label))
            navigate(-1)
        } else {
            Toast.show('暂无数据')
        }

    }
    const [activeIndex, setActiveIndex] = useState(0)
    const calcRowHeight = ({ index }) => {
        const datas = cityDataArr[index][1];
        return titleHeight + datas.length * rowHeight;
    }
    const showRows = ({ startIndex }) => {
        if (activeIndex === startIndex) return;
        setActiveIndex(startIndex)
    }
    const switchActive = (index) => {
        setActiveIndex(index)
        listRef.current.scrollToRow(index)
    }
    useEffect(() => {
        listRef.current.measureAllRows()
    })
    const rowRenderer = ({ key, index, style }) => {
        return (
            <div key={key} style={style} className={styles.rows}>
                <div className={styles.title}>
                    {switchTitle(cityDataArr[index][0])}
                </div>
                <div className={styles.datas}>
                    {
                        cityDataArr[index][1].map(item => {
                            return (
                                <div key={item.value + index} className={styles.dataitem} onClick={() => setCity(item)}>
                                    {item.label}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
    return (
        <div className={styles.citylist}>
            <NavBar onBack={() => navigate(-1)}>城市选择</NavBar>
            <div className={styles.content}>
                <AutoSizer>
                    {({ height, width }) => {
                        return (
                            <List
                                ref={listRef}
                                height={height}
                                rowCount={cityDataArr.length}
                                rowHeight={calcRowHeight}
                                rowRenderer={rowRenderer}
                                width={width}
                                scrollToAlignment={"start"}
                                onRowsRendered={showRows}
                            />
                        )
                    }}
                </AutoSizer>
            </div>
            <ListNavBar activeIndex={activeIndex} list={cityNavi} onSwitch={(index) => switchActive(index)} />
        </div>

    )
}

export default CityList;