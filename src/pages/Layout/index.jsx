import style from './index.module.scss'
import { TabBar } from 'antd-mobile'
import { AppOutline, CompassOutline, ContentOutline, UserOutline } from 'antd-mobile-icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
const tabs = [
    {
        key: '/',
        title: '首页',
        icon: <AppOutline />,
    },
    {
        key: '/find',
        title: '找房',
        icon: <CompassOutline />,
    },
    {
        key: '/news',
        title: '资讯',
        icon: <ContentOutline />
    },
    {
        key: '/ucenter',
        title: '我的',
        icon: <UserOutline />,
    },
]
const Layout = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    return (
        <div className={style.layout}>
            <div className={style.content}>
                <Outlet />
            </div>
            <TabBar className={style.tabbar} activeKey={pathname} onChange={(key) => navigate(key)}>
                {tabs.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                ))}
            </TabBar>
        </div>
    )
}

export default Layout