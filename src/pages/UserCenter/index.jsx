import style from './index.module.scss'
import { Button, Grid, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserInfo } from '@/apis/user';
import { userLogout } from '@/store/modules/user.Store';
import { useDispatch } from 'react-redux';
import ConfirmMask from '@/components/ConfirmMask';

const UserCenter = () => {
    const dispatch = useDispatch()
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const [visible, setVisible] = useState(false)
    const { token } = useSelector(state => state.user)
    const logout = async () => {
        try {
            let res = await dispatch(userLogout())
            Toast.show({
                icon: 'success',
                content: res,
            })
        } catch (err) {
            Toast.show({
                icon: 'fail',
                content: err
            })
        } finally {
            setVisible(false)
        }
    }
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()
    const menus = [
        { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorite' },
        { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
        { id: 3, name: '看房记录', iconfont: 'icon-record' },
        { id: 4, name: '成为房主', iconfont: 'icon-identity' },
        { id: 5, name: '个人资料', iconfont: 'icon-myinfo', to: '/profile' },
        { id: 6, name: '联系我们', iconfont: 'icon-cust' }
    ];
    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await getUserInfo()
            if (res.status !== 200) return
            setUserInfo(res.body)
        }
        if (token) {
            fetchUserInfo()
        } else {
            // 没token的话直接把潜在的useInfo清除
            setUserInfo({})
        }
    }, [token])
    return (
        <div className={style.usercenter}>
            <div className={style.header}>
                <img src={`${baseUrl}/img/profile/bg.png`} alt="bg" className={style.bgimg} />
                <div className={style.userinfo}>
                    <img src={`${baseUrl}${userInfo?.avatar || '/img/profile/avatar.png'}`} alt="avater" className={style.useravater} />
                    <div className={style.infocard}>
                        <span className={style.username}>{userInfo?.nickname || '游客'}</span>
                        {
                            Object.keys(userInfo).length > 0 ? (
                                <Button
                                    size="small"
                                    inline
                                    onClick={() => {
                                        setVisible(true)
                                    }}
                                >登出</Button>
                            ) : (
                                <Button
                                    color="success"
                                    size="small"
                                    inline
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                >去登录</Button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={style.menus}>
                <Grid columns={3} gap={0}>
                    {menus.map(item => (
                        <Grid.Item key={item.id}>
                            <div className={style.menuitem} onClick={() => item.to && navigate(item.to)}>
                                <i className={`iconfont ${item.iconfont} ${style.icon}`} />
                                <span>{item.name}</span>
                            </div>
                        </Grid.Item>
                    ))}
                </Grid>
            </div>
            <div className={style.ad}>
                <img
                    src={`${baseUrl}/img/profile/join.png`}
                    alt="加入我们"
                />
            </div>
            <ConfirmMask visible={visible} title='确定要退出吗?' confirmText='确定退出' onCancel={() => setVisible(false)} onConfirm={logout} />
        </div>
    );
}
export default UserCenter;