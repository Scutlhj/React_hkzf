import ReactDOM from 'react-dom/client'
import './index.scss'
import '@/assets/fonts/iconfont.css'
import 'react-virtualized/styles.css'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { APILoader, Provider as BaiduMapProvider } from '@uiw/react-baidu-map'
import { Provider } from 'react-redux'
import store from '@/store'

ReactDOM.createRoot(document.getElementById('root')).render(
    <APILoader akay="uP77Tbnp2f11mY2cYPyoMi2Z27PfI4xl">
        <BaiduMapProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </BaiduMapProvider>
    </APILoader>
)
