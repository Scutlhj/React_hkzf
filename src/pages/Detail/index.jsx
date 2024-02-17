import style from './index.module.scss'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { NavBar, Toast, Swiper, Modal } from 'antd-mobile'
import { Map, CustomOverlay } from '@uiw/react-baidu-map';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { getHouseDetail, getHouses } from '@/apis/house'
import { checkIsFavorite, addFavorite, delFavorite, offShelfHouse } from '@/apis/user';
import { SendOutline } from 'antd-mobile-icons'
import { useCurrentCity } from '@/hooks/useCurrentCity';
import HouseItem from '@/components/HouseItem';
import HouseSupport from '@/components/HouseSupport';
import ConfirmMask from '@/components/ConfirmMask';
const Detail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentCity = useCurrentCity()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [visible, setVisible] = useState(false)
    const [confirmMaskVisible, setConfirmMaskVisible] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const mapElm = useRef()
    const detailRef = useRef()
    const [recommandHouseList, setRecommandHouseList] = useState([])
    const [houseInfo, setHouseInfo] = useState({})
    const center = useMemo(() => {
        return {
            lng: houseInfo.coord?.longitude,
            lat: houseInfo.coord?.latitude
        }
    }, [houseInfo])
    const currentId = useMemo(() => {
        return searchParams.get('id')
    }, [searchParams])
    const fetchHouseInfo = useCallback(async (id) => {
        const res = await getHouseDetail(id)
        if (res.status !== 200) {
            throw new Error('无对应房屋数据!')
        }
        setHouseInfo(res.body)
    }, [])
    const delHouse = async () => {
        setConfirmMaskVisible(false)
        const res = await offShelfHouse(currentId)
        if (res.status !== 200) return Toast.show({ icon: 'fail', content: '服务器偷懒了,请稍后再试' })
        Toast.show({ icon: 'success', content: '房屋下架成功', afterClose: () => navigate(-1, { replace: true }), duration: 500 })
    }
    const tabsInfo = useMemo(() => {
        return {
            cardInfo: [
                {
                    title: '租金',
                    value: houseInfo.price,
                    unit: '/月'
                },
                {
                    title: '房型',
                    value: houseInfo.roomType,
                },
                {
                    title: '面积',
                    value: `${houseInfo.size}平方米`,
                },
            ],
            attachedInfo: [
                {
                    title: '装修：',
                    value: '精装',
                },
                {
                    title: '朝向：',
                    value: houseInfo.oriented?.join('、'),
                },
                {
                    title: '楼层：',
                    value: houseInfo.floor,
                },
                {
                    title: '类型：',
                    value: '普通住宅',
                },
            ]
        }
    }, [houseInfo])
    // 判断是否有对应id的信息
    useEffect(() => {
        if (currentId) {
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0,
            })
            fetchHouseInfo(currentId).then(() => {
                Toast.clear()
            }).catch((err) => {
                Toast.show({
                    icon: 'fail',
                    content: err.message,
                })
                setTimeout(() => {
                    navigate('/find')
                }, 1000)
            })
        }
    }, [currentId, fetchHouseInfo, navigate])

    // 自动获取三个房屋数据
    useEffect(() => {
        const fetchRecList = async (id, options) => {
            const res = await getHouses(id, options)
            if (res.status !== 200) throw new Error('获取推荐房屋失败')
            setRecommandHouseList(res.body.list)
        }
        if (currentCity.value && currentId) {
            const randomNum = Math.floor(Math.random() * (1000 - 1)) + 1
            fetchRecList(currentCity.value, { start: randomNum, end: randomNum + 2 })
                .catch((err) => {
                    Toast.show({
                        icon: 'fail',
                        content: err.message,
                    })
                })
        }
    }, [currentCity, currentId])

    // 判断有没有登录,以及是否收藏
    useEffect(() => {
        const checkLoginAndFavorite = async () => {
            const res = await checkIsFavorite(currentId)
            if (res.status === 200) {
                setIsFavorite(res.body.isFavorite)
                setIsLogin(true)
            }
        }
        if (currentId) {
            checkLoginAndFavorite()
        }
    }, [currentId])

    const right = (
        <SendOutline className={style.shareicon} />
    )

    const clickHandler = (id) => {
        detailRef.current.scrollTo({
            top: 0,
        })
        navigate(`/detail?id=${id}`)
    }
    const toggleFavorite = async () => {
        const toggleAction = isFavorite ? delFavorite : addFavorite;
        Toast.show({
            icon: 'loading',
            content: '加载中...',
            duration: 0,
        })
        try {
            const res = await toggleAction(currentId)
            if (res.status === 200) {
                setIsFavorite(!isFavorite)
                Toast.show({
                    icon: 'success',
                    content: res.description + '成功',
                    duration: 1000
                })
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '操作失败，请稍后再试',
                    duration: 1000
                })
            }
        } catch (err) {
            console.log(err)
        }
    };

    const btnHandler = () => {
        if (isLogin) {
            toggleFavorite()
        }
        else {
            setVisible(true)
        }
    }
    return (
        <div className={style.detail} ref={detailRef}>
            <div className={style.header}>
                <NavBar className={style.nav} right={right} onBack={() => navigate(-1)}>
                    {houseInfo.community}
                </NavBar>
                <Swiper
                    loop
                    autoplay
                >
                    {houseInfo.houseImg?.map((url, index) => (
                        <Swiper.Item key={index}>
                            <img src={`${import.meta.env.VITE_APP_BASE_URL}${url}`} className={style.swiperimgs} />
                        </Swiper.Item>
                    ))}
                </Swiper>
            </div>
            <div className={style.housedesc}>
                <div className={style.housename}>{houseInfo.title}</div>
                <div className={style.tags}>
                    {houseInfo.tags?.map(tagitem => (
                        <div className={style.tagitem} key={tagitem}>
                            {tagitem}
                        </div>
                    ))}
                </div>
                <div className={style.houseinfotabs}>
                    <div className={style.cardinfo}>
                        {tabsInfo.cardInfo.map((item, index) => (
                            <div className={style.carditem} key={index}>
                                <div className={style.cardvalue}>
                                    <span>{item.value}</span>
                                    {item.unit &&
                                        <span className={style.valueunit}>{item.unit}</span>
                                    }
                                </div>
                                <div className={style.cardtitle}>{item.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className={style.attachedinfo}>
                        {tabsInfo.attachedInfo.map((item, index) => (
                            <div className={style.attacheditem} key={index}>
                                <div className={style.attachedtitle}>{item.title}</div>
                                <div className={style.attachedvalue}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={style.maplocation}>
                <div className={style.location}>
                    小区：{houseInfo.community}
                </div>
                <div className={style.map} ref={mapElm}>
                    <Map
                        zoom={16}
                        center={center}
                        widget={['NavigationControl']}
                        enableDragging={false}
                        enableScrollWheelZoom={false}
                        enableDoubleClickZoom={false}
                        enableContinuousZoom={false}
                    >
                        <CustomOverlay position={center} zIndex={99}>
                            <div className={style.overlay}>
                                {houseInfo.community}
                            </div>
                            <div className={style.arrow}></div>
                        </CustomOverlay>
                    </Map>
                </div>
            </div>
            <div className={style.facilities}>
                <div className={style.title}>房屋配套</div>
                {/* <div className={style.supporting}>
                    {houseInfo.supporting?.length > 0 ?
                        houseInfo.supporting.map((item) => {
                            const houseicon = HOUSE_PACKAGE.find((iconObj) => iconObj.name === item)
                            return (
                                <div className={style.supportingitem} key={houseicon.id}>
                                    <i className={`iconfont ${houseicon.icon} ${style.icon}`} />
                                    <span className={style.name}>{item}</span>
                                </div>
                            )
                        }) :
                        <span className={style.nodata}>暂无数据</span>
                    }
                </div> */}
                {/* 在这里showedNameList一开始为undifined，不过组件参数有默认值不怕报错 */}
                <HouseSupport isSelectionMode={false} showedNameList={houseInfo.supporting} />
            </div>
            <div className={style.overview}>
                <div className={style.title}>
                    房屋概况
                </div>
                <div className={style.userinfo}>
                    <div className={style.useravater}>
                        <img src={`${import.meta.env.VITE_APP_BASE_URL}/img/avatar.png`} />
                        <div className={style.hostdesc}>
                            <span className={style.hostess}>
                                张女士
                            </span>
                            <span className={style.hostauth}>
                                <i className={`iconfont icon-auth ${style.icon}`}></i>已认证房主
                            </span>
                        </div>
                    </div>
                    {
                        location.state ? (
                            <div className={style.delbtn} onClick={() => setConfirmMaskVisible(true)}>下架房屋</div>
                        ) : (
                            <div className={style.btn}>发消息</div>
                        )
                    }
                </div>
                <div className={style.desc}>{houseInfo.description || '暂无房屋数据'}</div>
            </div>
            <div className={style.more}>
                <div className={style.title}>猜你喜欢</div>
                <div className={style.housecontainer}>
                    {recommandHouseList.map(item => (
                        <HouseItem key={item.houseCode} item={item} onClickHandler={() => clickHandler(item.houseCode)} />
                    ))}
                </div>
            </div>
            <div className={style.bottombtn}>
                <div className={style.add} onClick={btnHandler}>
                    <img src={`${import.meta.env.VITE_APP_BASE_URL}/img/${!isFavorite ? 'un' : ''}star.png`} alt="收藏" />
                    <span className={style.text}>{isFavorite ? '已收藏' : '收藏'}</span>
                </div>
                <div className={style.consult} onClick={() => Toast.show('暂未开通此功能')}>
                    在线咨询
                </div>
                <div className={style.reverse}>
                    <a href="tel:15626951703">电话预约</a>
                </div>
            </div>
            <Modal
                visible={visible}
                header={
                    <div className={style.poptitle}>提示</div>
                }
                content={
                    <div className={style.popcontent}>登录后才能收藏房源，是否去登录？</div>
                }
                onClose={() => {
                    setVisible(false)
                }}
                actions={[
                    {
                        key: 'confirm',
                        text: '登录',
                        primary: true,
                        onClick: () => {
                            navigate('/login', { state: { from: location.pathname + location.search }, replace: true })
                        }
                    },
                    {
                        key: 'cancel',
                        text: '取消',
                        onClick: () => {
                            setVisible(false)
                        }
                    }
                ]}
            />
            <ConfirmMask title='确定要下架吗?' visible={confirmMaskVisible} onCancel={() => setConfirmMaskVisible(false)} onConfirm={delHouse} />
        </div>
    )
}

export default Detail