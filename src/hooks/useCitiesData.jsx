import { useCityList } from '@/hooks/useCityList';
import { useHotCities } from '@/hooks/useHostCities';
import { useCurrentCity } from '@/hooks/useCurrentCity';
import _ from 'lodash';

const useCitiesData = () => {
    const currentCity = useCurrentCity();
    const hotCities = useHotCities();
    const cityList = useCityList();
    const groupedObj = {
        '#': [currentCity],
        hot: hotCities,
        ...(_.groupBy(cityList, item => item.short.slice(0, 1).toUpperCase()))
    };
    return groupedObj;
}

export { useCitiesData };