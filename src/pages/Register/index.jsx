import style from './index.module.scss'
import { Form, Input, Button, NavBar, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons"
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { registered } from '@/apis/user';
const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passvisible, setPassVisible] = useState(false)
    const [repassvisible, setRepassVisible] = useState(false)
    const form = useRef()
    const validateRePassword = (rule, value) => {
        if (value === form.current.getFieldValue('password')) {
            return Promise.resolve()
        }
        return Promise.reject('两次输入的密码不一致!')
    }
    const checkLogin = async (value) => {
        setLoading(true)
        try {
            const res = await registered(value)
            if (res.status === 200) {
                Toast.show({
                    icon: 'success',
                    content: res.description,
                })
                setTimeout(() => {
                    navigate(-1, { replace: true })
                }, 500)
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.description,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={style.register}>
            <NavBar onBack={() => navigate(-1)} className={style.header}>账号注册</NavBar>
            <Form
                ref={form}
                requiredMarkStyle='asterisk'
                footer={
                    <Button block type='submit' color='success' size='large' loading={loading}>
                        注册
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
                    validateTrigger={'onBlur'}
                    rules={[{ required: true }, { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,16}$/, message: '密码长度为8-16位，必须且只能含有数字和大小写字母' }]}
                    extra={
                        <div className={style.eye}>
                            {!passvisible ? (
                                <EyeInvisibleOutline onClick={() => setPassVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setPassVisible(false)} />
                            )}
                        </div>
                    }
                >
                    <Input placeholder='请输入密码' type={passvisible ? 'text' : 'password'} clearable />
                </Form.Item>
                <Form.Item
                    name='repassword'
                    // dependencies={['password']}
                    validateFirst={true}
                    validateTrigger={'onBlur'}
                    label='确认密码'
                    rules={[{ required: true }, { validator: validateRePassword }]}
                    extra={
                        <div className={style.eye}>
                            {!repassvisible ? (
                                <EyeInvisibleOutline onClick={() => setRepassVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setRepassVisible(false)} />
                            )}
                        </div>
                    }
                >
                    <Input placeholder='请确认密码' type={repassvisible ? 'text' : 'password'} clearable />
                </Form.Item>
            </Form>
        </div >

    )
}
export default Register