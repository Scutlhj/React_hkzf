import { Form, Input, Button, NavBar, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons"
import style from "./index.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "@/store/modules/user.Store";
const Login = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    // console.log(location)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false)
    const checkLogin = async (value) => {
        setLoading(true)
        try {
            let res = await dispatch(userLogin(value))
            const redirectHref = location.state?.from || '/'
            Toast.show({
                icon: 'success',
                content: res,
            })
            setTimeout(() => {
                navigate(redirectHref,{replace:true})
            }, 500)
        } catch (e) {
            Toast.show({
                icon: 'fail',
                content: e,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={style.login}>
            <NavBar onBack={() => navigate(-1)} className={style.header}>账号登录</NavBar>
            <Form
                requiredMarkStyle='asterisk'
                // validateTrigger={'onBlur'}
                footer={
                    <Button block type='submit' color='success' size='large' loading={loading}>
                        登录
                    </Button>
                }
                initialValues={{
                    username: '',
                    password: ''
                }}
                onFinish={checkLogin}
            >
                <Form.Header>用户信息</Form.Header>
                <Form.Item
                    name='username'
                    label='账号'
                    validateTrigger={'onBlur'}
                    rules={[{ required: true }, { pattern: /^[a-zA-Z0-9]{5,8}$/, message: '账号长度为5-8位，且只能含有数字和字母' }]}
                >
                    <Input placeholder='请输入账号' clearable />
                </Form.Item>
                <Form.Item
                    name='password'
                    label='密码'
                    rules={[{ required: true }, { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,16}$/, message: '密码长度为8-16位，必须且只能含有数字和大小写字母' }]}
                    validateTrigger={'onBlur'}
                    extra={
                        <div className={style.eye}>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>
                    }
                >
                    <Input placeholder='请输入密码' type={visible ? 'text' : 'password'} clearable autoComplete='off' />
                </Form.Item>
            </Form>
            <span className={style.toreg} onClick={() => navigate('/registered')}>还没有账号，去注册~</span>
        </div >

    )
}
export default Login