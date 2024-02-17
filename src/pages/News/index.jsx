import style from './index.module.scss';
import { getNewsByAreaId } from '@/apis/home';
import { useCurrentCity } from '@/hooks/useCurrentCity';
import { useEffect, useState } from 'react';
import { Toast } from 'antd-mobile';
const News = () => {
    const currentCity = useCurrentCity()
    const [news, setNews] = useState([])
    useEffect(() => {
        if (!currentCity) return
        const fetchNews = async () => {
            Toast.show({ icon: 'loading', content: '加载中...', duration: 0 })
            try {
                const res = await getNewsByAreaId(currentCity.value)
                Toast.clear()
                if (res.status !== 200) throw new Error('获取最新资讯失败')
                setNews(res.body)
            } catch (e) {
                Toast.show({ icon: 'fail', content: e.message })
            }
        }
        fetchNews()
    }, [currentCity])
    return (
        <div className={style.news}>
            {news.map(item => (
                <div className={style.item} key={item.id}>
                    <div className={style.imgwrap}>
                        <img className={style.img} src={`${import.meta.env.VITE_APP_BASE_URL}${item.imgSrc}`} />
                    </div>
                    <div className={style.info}>
                        <h3 className={style.title}>{item.title}</h3>
                        <div className={style.desc}>
                            <span className={style.from}>{item.from}</span>
                            <span className={style.date}>{item.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default News;