import style from './index.module.scss';
import { Swiper, Toast } from "antd-mobile";
import Nav1 from '@/assets/images/nav/nav-1.png';
import Nav2 from '@/assets/images/nav/nav-2.png';
import Nav3 from '@/assets/images/nav/nav-3.png';
import Nav4 from '@/assets/images/nav/nav-4.png';
import Swiper1 from '@/assets/images/swiper/1.png'
import Swiper2 from '@/assets/images/swiper/2.png'
import Swiper3 from '@/assets/images/swiper/3.png'
import Nav from './Nav';
import { useEffect, useState } from 'react';
import { getGroupsByAreaId, getNewsByAreaId } from '@/apis/home';
import { useCurrentCity } from '@/hooks/useCurrentCity';
import SearchHeader from '@/components/SearchHeader';
import Group from './Group';
import HNews from './HNews';
const Home = () => {
    const [groupsData, setGroupsData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const currentCity = useCurrentCity();
    useEffect(() => {
        getGroupsByAreaId(currentCity.value).then(res => {
            if (res.status !== 200) return Toast.show({ icon: 'fail', content: '获取租房小组失败' });
            setGroupsData(res.body);
        })
        getNewsByAreaId(currentCity.value).then(res => {
            if (res.status !== 200) return Toast.show({ icon: 'fail', content: '获取本地新闻失败' });
            setNewsData(res.body);
        })
    }, [currentCity])
    const swiper = [
        {
            id: 1,
            imgSrc: Swiper1,
            alt: 'swiper-1'
        },
        {
            id: 2,
            imgSrc: Swiper2,
            alt: 'swiper-2'
        },
        {
            id: 3,
            imgSrc: Swiper3,
            alt: 'swiper-3'
        }
    ]
    const nav = [
        {
            id: 1,
            img: Nav1,
            des: '整租',
            to: '/find'
        },
        {
            id: 2,
            img: Nav2,
            des: '合租',
            to: '/find'
        },
        {
            id: 3,
            img: Nav3,
            des: '地图找房',
            to: '/map'
        },
        {
            id: 4,
            img: Nav4,
            des: '去出租',
            to: '/rent/add'
        }
    ]
    return (
        <div className={style.home}>
            <div className={style.swiper}>
                <Swiper
                    loop
                    autoplay
                >
                    {swiper.map(item => (
                        <Swiper.Item key={item.id} className={style.swiperitem}>
                            <img src={item.imgSrc} alt={item.alt} style={{ width: '100%', verticalAlign: 'Top' }} />
                        </Swiper.Item>
                    ))}
                </Swiper>
                <SearchHeader city={currentCity.label} />
            </div>
            <Nav items={nav} />
            <Group groupitem={groupsData} />
            <HNews newsItem={newsData} />
        </div>
    );
}
export default Home;