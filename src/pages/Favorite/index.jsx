import { NavBar, Toast } from "antd-mobile"
import { useNavigate,Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getFavoriteList } from "@/apis/user"
import HouseItem from "@/components/HouseItem"
import NoHouse from "@/components/NoHouse"
import style from "./index.module.scss"
const Favorite = () => {
    const navigate = useNavigate()
    const toDetail = (houseCode) => {
        navigate(`/detail?id=${houseCode}`)
    }
    const [favoriteHouseList, setFavoriteHouseList] = useState([])
    useEffect(() => {
        const getRentHouses = async () => {
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0,
            })
            try {
                const res = await getFavoriteList()
                if (res.status !== 200) throw new Error('获取数据失败！')
                setFavoriteHouseList(res.body)
            } catch (err) {
                console.log(err)
            } finally {
                Toast.clear()
            }
        }
        getRentHouses()
    }, [])
    return (
        <div className={style.favorite}>
            <NavBar onBack={() => navigate(-1)} className={style.nav}>我的收藏</NavBar>
            {
                favoriteHouseList.length > 0 ?
                    (
                        <div className={style.favoritelist}>
                            {
                                favoriteHouseList.map(item => <HouseItem item={item} key={item.houseCode} onClickHandler={() => toDetail(item.houseCode)} />)
                            }
                        </div>
                    ) :
                    (
                        <NoHouse>
                            <p>您还没有收藏，去<Link to="/find">收藏房源</Link>吧~</p>
                        </NoHouse>
                    )
            }
        </div>
    )
}
export default Favorite