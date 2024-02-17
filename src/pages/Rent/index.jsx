import style from './index.module.scss'
import { useState, useEffect } from 'react'
import { getRentInfo } from '@/apis/user'
import { Link, useNavigate } from 'react-router-dom'
import { Toast, NavBar } from 'antd-mobile'
import NoHouse from '@/components/NoHouse'
import HouseItem from '@/components/HouseItem'
const Rent = () => {
    const navigate = useNavigate()
    const toDetail = (houseCode) => {
        navigate(`/detail?id=${houseCode}`, { state: { shelf: true } })
    }
    const [rentHouseList, setRentHouseList] = useState([])
    useEffect(() => {
        const getRentHouses = async () => {
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0,
            })
            try {
                const res = await getRentInfo()
                if (res.status !== 200) throw new Error('获取数据失败！')
                setRentHouseList(res.body)
            } catch (err) {
                console.log(err)
            } finally {
                Toast.clear()
            }
        }
        getRentHouses()
    }, [])
    return (
        <div className={style.rent}>
            <NavBar onBack={() => navigate(-1)} className={style.nav}>房屋管理</NavBar>
            {
                rentHouseList.length > 0 ?
                    (
                        <div className={style.rentlist}>
                            {
                                rentHouseList.map(item => <HouseItem item={item} key={item.houseCode} onClickHandler={() => toDetail(item.houseCode)} />)
                            }
                        </div>
                    ) :
                    (
                        <NoHouse>
                            <p>您还没有房源，去<Link to="/rent/add">发布房源</Link>吧~</p>
                        </NoHouse>
                    )
            }
        </div>
    )
}

export default Rent