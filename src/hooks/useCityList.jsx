import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStoreCityList } from '@/store/modules/city.Store';

const useCityList = () => {
    const dispatch = useDispatch();
    const cityList = useSelector(state => state.city.cityList);

    useEffect(() => {
        if (cityList.length === 0) {
            dispatch(getStoreCityList());
        }
    }, [dispatch, cityList]);

    return cityList;
};

export { useCityList }