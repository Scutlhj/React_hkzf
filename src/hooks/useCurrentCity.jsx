import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStoreCurrentCity } from '@/store/modules/city.Store';

const useCurrentCity = () => {
    // 一个自动set仓库currentCity的钩子
    const dispatch = useDispatch();
    const { currentCity } = useSelector(state => state.city);
    // console.log(currentCity)
    useEffect(() => {
        if (Object.keys(currentCity).length !== 0) return;
        const localCity = new window.BMap.LocalCity();
        localCity.get(async result => {
            dispatch(getStoreCurrentCity(result.name));
        })
    }, [dispatch, currentCity])
    return currentCity;
}

export { useCurrentCity }