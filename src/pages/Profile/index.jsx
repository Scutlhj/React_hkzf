import { useEffect, useState, useRef } from "react"
import { getUserInfo, patchUserInfo } from "@/apis/user"
import { Form, Radio, Toast, NavBar, Input, Space, ImageUploader, Button } from "antd-mobile"
import { postImage } from "@/apis/house"
import { useNavigate } from "react-router-dom"
import style from "./index.module.scss"
const Profile = () => {
    // const initUserInfo = {
    //     avatar: "",
    //     gender: "",
    //     nickname: "",
    //     phone: ""
    // }
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const navigate = useNavigate()
    // const [userInfo, setUserInfo] = useState(initUserInfo)
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()
    const imgRef = useRef()
    useEffect(() => {
        const fetchUserInfo = async () => {
            Toast.show({ icon: 'loading', content: '加载中...', duration: 0 })
            const res = await getUserInfo()
            Toast.clear()
            if (res.status !== 200) return Toast.show({ icon: 'fail', content: '获取个人信息失败', afterClose: () => navigate(-1, { replace: true }) })
            // setUserInfo(res.body)
            // console.log(res.body)
            form.setFieldsValue(res.body)
            setFileList([
                {
                    url: baseUrl + res.body.avatar,
                }
            ])
        }
        fetchUserInfo()
    }, [navigate, form, baseUrl])
    const uploadImg = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await postImage(formData)
        if (res.status !== 200) {
            Toast.show({ icon: 'fail', content: '更新头像失败' })
            throw new Error('更新头像失败')
        }
        return res.body[0]
    }
    const saveInfo = async () => {
        await form.validateFields()
        const { gender, nickname, phone } = form.getFieldsValue(true)
        const { file } = fileList[0]
        let avatar = fileList[0].url - baseUrl
        if (file) {
            avatar = await uploadImg(file)
        }
        const res = await patchUserInfo({ avatar, gender, nickname, phone })
        if (res.status !== 200) return Toast.show({ icon: 'fail', content: '更新个人信息失败' })
        Toast.show({ icon: 'success', content: '更新个人信息成功' })
        navigate(-1, { replace: true })
    }
    const Right = () => {
        return (
            <div className={style.savebtn} onClick={saveInfo}>保存</div>
        )
    }
    const beforeUpload = (file) => {
        if (file.size > 1024 * 1024) {
            Toast.show({ icon: 'fail', content: '请选择小于 1M 的图片' })
            return null
        }
        return file
    }
    // 处理上传的file,这里先把他处理返回一个url能预览
    const parseFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataURL = e.target.result;
                if (!dataURL) {
                    reject('Fail to get the image')
                    return;
                }
                setFileList([
                    {
                        url: dataURL,
                        file
                    }
                ])
                resolve({
                    url: dataURL,
                });
            };
            reader.readAsDataURL(file);
        })
    }
    const onOpen = () => {
        const nativeInput = imgRef.current?.nativeElement
        if (nativeInput) {
            nativeInput.click()
        }
    }
    return (
        <div className={style.profile}>
            <NavBar className={style.nav} right={<Right />} onBack={() => navigate(-1)}>
                个人资料
            </NavBar>
            <Form
                layout='horizontal'
                mode='card'
                footer={
                    <Button block color='success' size='large' onClick={onOpen}>
                        上传新头像
                    </Button>
                }
            >
                <Form.Header>用户头像</Form.Header>
                <Form.Item>
                    <Space justify='center' block>
                        <ImageUploader
                            ref={imgRef}
                            value={fileList}
                            maxCount={2}
                            deletable={false}
                            beforeUpload={beforeUpload}
                            showUpload={false}
                            upload={parseFile}
                            preview={false}
                            imageFit={'fill'}
                            style={{ '--cell-size': '70px' }}
                        />
                    </Space>
                </Form.Item>
            </Form>
            <Form
                form={form}
                layout='horizontal'
                mode='card'
                style={{ '--prefix-width': '6rem' }}
                requiredMarkStyle='none'
            >
                <Form.Header>个人信息</Form.Header>
                <Form.Item
                    label='用户名'
                    name='nickname'
                    rules={[
                        { required: true, message: '请输入用户名' },
                        { type: 'string', max: 10, message: '用户名长度不能超过10位' }
                    ]}
                    validateTrigger='onBlur'
                >
                    <Input
                        placeholder='请输入用户名'
                    />
                </Form.Item>
                <Form.Item
                    label='手机号'
                    name='phone'
                    rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号' }
                    ]}
                    validateTrigger='onBlur'
                >
                    <Input
                        placeholder='请输入手机号'
                    />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="性&nbsp;&nbsp;&nbsp;&nbsp;别"
                    rules={[
                        { required: true },
                        { type: 'enum', enum: ['0', '1'] }
                    ]}
                >
                    <Radio.Group>
                        <Space style={{ '--gap': '24px' }}>
                            <Radio value='1'>男</Radio>
                            <Radio value='0'>女</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Profile