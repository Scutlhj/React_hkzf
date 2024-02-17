import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStoreHotCities } from '@/store/modules/city.Store';

const useHotCities = () => {
    const dispatch = useDispatch();
    const hotCities = useSelector(state => state.city.hotCities);

    useEffect(() => {
        if (hotCities.length === 0) {
            dispatch(getStoreHotCities());
        }
    }, [dispatch, hotCities]);

    return hotCities;
};

export { useHotCities }