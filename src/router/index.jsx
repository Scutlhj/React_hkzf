import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import Authen from "@/components/Authen";
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('@/pages/Login'))
const Home = lazy(() => import('@/pages/Home'))
const Find = lazy(() => import('@/pages/Find'))
const News = lazy(() => import('@/pages/News'))
const UserCenter = lazy(() => import('@/pages/UserCenter'))
const CityList = lazy(() => import('@/pages/CityList'))
const MyMap = lazy(() => import('@/pages/MyMap'))
const Detail = lazy(() => import('@/pages/Detail'))
const Register = lazy(() => import('@/pages/Register'))
const Rent = lazy(() => import('@/pages/Rent'))
const RentAdd = lazy(() => import('@/pages/Rent/Add'))
const RentSearch = lazy(() => import('@/pages/Rent/Search'))
const Favorite = lazy(() => import('@/pages/Favorite'))
const Profile = lazy(() => import('@/pages/Profile'))

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Suspense fallback={'加载中'}><Home /></Suspense>
            },
            {
                path: "find",
                element: <Suspense fallback={'加载中'}><Find /></Suspense>
            },
            {
                path: "news",
                element: <Suspense fallback={'加载中'}><News /></Suspense>
            },
            {
                path: "ucenter",
                element: <Suspense fallback={'加载中'}><UserCenter /></Suspense>
            }
        ]
    },
    {
        path: "/login",
        element: <Suspense fallback={'加载中'}><Login /></Suspense>
    },
    {
        path: "/registered",
        element: <Suspense fallback={'加载中'}><Register /></Suspense>
    },
    {
        path: "/citylist",
        element: <Suspense fallback={'加载中'}><CityList /></Suspense>
    },
    {
        path: '/map',
        element: <Suspense fallback={'加载中'}><MyMap /></Suspense>
    },
    {
        path: "/detail",
        element: <Suspense fallback={'加载中'}><Detail /></Suspense>
    },
    {
        path: "/rent",
        element: <Authen><Suspense fallback={'加载中'}><Rent /></Suspense></Authen>
    },
    // 伪装成二级路由的一级路由
    {
        path: "/rent/add",
        element: <Authen><Suspense fallback={'加载中'}><RentAdd /></Suspense></Authen>
    },
    {
        path: "/rent/search",
        element: <Authen><Suspense fallback={'加载中'}><RentSearch /></Suspense></Authen>
    },
    {
        path: "/favorite",
        element: <Authen><Suspense fallback={'加载中'}><Favorite /></Suspense></Authen>
    },
    {
        path: "/profile",
        element: <Authen><Suspense fallback={'加载中'}><Profile /></Suspense></Authen>
    }
])

export default router;