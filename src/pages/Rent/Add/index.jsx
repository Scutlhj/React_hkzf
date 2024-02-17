import style from './index.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getParams, postImage } from '@/apis/house'
import { postHouse } from '@/apis/user'
import { NavBar, Form, Input, CascadePicker, TextArea, ImageUploader, Toast } from 'antd-mobile'
import HouseSupport from '@/components/HouseSupport'
import FilterFooter from '@/components/FilterFooter'
const RentAdd = () => {
    // 获取选择的小区信息
    let { state } = useLocation()
    const navigate = useNavigate()
    const [textState, setTextState] = useState('')
    // 设置房源信息state
    const initialHouseValue = {
        community: '',
        price: '',
        size: '',
        roomType: '',
        floor: '',
        oriented: '',
        title: '',
        // 照片单独处理
        // houseImg: '',
        supporting: '',
        description: '',
    };
    // 设置对应中英翻译
    const houseValueMap = {
        community: '小区名称',
        price: '租金',
        size: '建筑面积',
        roomType: '户型',
        floor: '所在楼层',
        oriented: '朝向',
        title: '房屋标题',
        houseImg: '房屋图像',
        supporting: '房屋配置',
        description: '房屋描述',
    }
    const selectedList = useRef([])
    const infoFormRef = useRef()
    const titleFormRef = useRef()
    const desFormRef = useRef()
    const [fileList, setFileList] = useState([])
    const [houseValue, setHouseValue] = useState(initialHouseValue)
    const [addParams, setAddParams] = useState({
        roomType: [],
        oriented: [],
        supporting: [],
        floor: []
    })
    const toggleSelected = (name) => {
        const index = selectedList.current.findIndex((itemname) => itemname === name)
        if (index === -1) {
            // setSelectedList((prevList) => [...prevList, name])
            selectedList.current = [...selectedList.current, name]
        } else {
            selectedList.current.splice(index, 1)
            // setSelectedList((prevList) => prevList.filter((selectedItem) => selectedItem !== name))
        }
        setHouseValue((prevValue) => (
            {
                ...prevValue,
                supporting: selectedList.current.join('|')
            }
        ))
    }
    const beforeUpload = (file) => {
        if (file.size > 1024 * 1024) {
            Toast.show({ icon: 'fail', content: '请选择小于 1M 的图片' })
            return null
        }
        return file
    }
    const parseFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataURL = e.target.result;
                if (!dataURL) {
                    reject('Fail to get the image')
                    return;
                }
                resolve({
                    url: dataURL,
                    file
                });
            };
            reader.readAsDataURL(file);
        })
    }
    const reset = () => {
        // 把四个相关的state重置
        state = null
        setTextState('')
        setHouseValue(initialHouseValue)
        selectedList.current = []
        setFileList([])
        // 重置表单
        infoFormRef.current.resetFields()
        titleFormRef.current.resetFields()
        desFormRef.current.resetFields()
    }
    const onConfirm = async () => {
        // 手动校验表单数据
        const houseEntries = Object.entries(houseValue)
        for (const [key, value] of houseEntries) {
            if (value === '') {
                Toast.show({ icon: 'fail', content: `请填写${houseValueMap[key]}` })
                return
            }
            if ((key === 'price' || key === 'size') && value <= 0) {
                Toast.show({ icon: 'fail', content: `${houseValueMap[key]}不能小于0` })
                return
            }
        }
        // 处理图片list
        if (fileList.length !== 0) {
            const formData = new FormData()
            fileList.forEach((item) => {
                formData.append('file', item.file)
            })
            const res = await postImage(formData)
            if (res.status !== 200) return Toast.show({ icon: 'fail', content: '上传图片失败' })
            // 这里有一个异步问题导致后续的houseValue.houseImg没有更新,因此我把houseValue.houseImg去除了，请求时自行添加
            // setHouseValue((prevState) => (
            //     {
            //         ...prevState,
            //         houseImg: res.body.join('|')
            //     }
            // ))
            const resp = await postHouse({ ...houseValue, houseImg: res.body.join('|') })
            if (resp.status !== 200) return Toast.show({ icon: 'fail', content: '服务器偷懒了，请稍后再试' })
            Toast.show({ icon: 'success', content: '发布成功', afterClose: () => navigate('/rent', { replace: true }) })
        }

    }
    // 根据community自动更新houseValue.community
    useEffect(() => {
        if (state) {
            setHouseValue((prevValue) => (
                {
                    ...prevValue,
                    community: state.community
                }
            ));
            setTextState(state.communityName)
        }
    }, [state]);
    // 自动获取params
    useEffect(() => {
        const getAddParams = async () => {
            try {
                const res = await getParams()
                if (res.status !== 200) return new Error('获取条件失败！')
                setAddParams(res.body)
            } catch (e) {
                console.log(e)
            }
        }
        getAddParams()
    }, [])
    return (
        <div className={style.rentadd}>
            <NavBar className={style.nav} onBack={() => navigate(-1)}>发布房源</NavBar>
            <Form
                layout='horizontal'
                ref={infoFormRef}
            >
                <Form.Header className={style.mainlist}>房源信息</Form.Header>
                <Form.Item
                    // name="community"
                    label="小区名称"
                    onClick={() => navigate('/rent/search', { replace: true })}
                >
                    <Input
                        placeholder='请选择小区'
                        value={textState}
                        readOnly={true}
                    />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金"
                    extra="￥/月"
                >
                    <Input
                        type="number"
                        // min={1}
                        placeholder='请输入租金'
                        value={houseValue.price}
                        onChange={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                price: val
                            }
                        ))}
                    />
                </Form.Item>
                <Form.Item
                    name="size"
                    label="建筑面积"
                    extra="㎡"
                >
                    <Input
                        type="number"
                        // min={1}
                        placeholder='请输入建筑面积'
                        value={houseValue.size}
                        onChange={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                size: val
                            }
                        ))}
                    />
                </Form.Item>
                <Form.Item
                    name="roomType"
                    label="户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型"
                    trigger='onConfirm'
                    onClick={(e, pickerRef) => {
                        pickerRef.current?.open()
                    }}
                >
                    <CascadePicker
                        options={addParams.roomType}
                        value={houseValue.roomType}
                        onConfirm={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                roomType: val[0]
                            }
                        ))}
                    >
                        {value =>
                            value.length === 0 ? '请选择' : value[0].label
                        }
                    </CascadePicker>
                </Form.Item>
                <Form.Item
                    name="floor"
                    label="所在楼层"
                    trigger='onConfirm'
                    onClick={(e, pickerRef) => {
                        pickerRef.current?.open()
                    }}
                >
                    <CascadePicker
                        options={addParams.floor}
                        value={houseValue.floor}
                        onConfirm={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                floor: val[0]
                            }
                        ))}
                    >
                        {value =>
                            value.length === 0 ? '请选择' : value[0].label
                        }
                    </CascadePicker>
                </Form.Item>
                <Form.Item
                    name="oriented"
                    label="朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向"
                    trigger='onConfirm'
                    onClick={(e, pickerRef) => {
                        pickerRef.current?.open()
                    }}
                >
                    <CascadePicker
                        options={addParams.oriented}
                        value={houseValue.oriented}
                        onConfirm={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                oriented: val[0]
                            }
                        ))}
                    >
                        {value =>
                            value.length === 0 ? '请选择' : value[0].label
                        }
                    </CascadePicker>
                </Form.Item>
            </Form>
            <Form
                layout='horizontal'
                ref={titleFormRef}
            >
                <Form.Header className={style.mainlist}>房屋标题</Form.Header>
                <Form.Item
                    name="title"
                    label=""
                >
                    <TextArea
                        placeholder='请输入标题（例如：整租 小区名 2室 5000元）'
                        value={houseValue.title}
                        onChange={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                title: val
                            }
                        ))}
                        maxLength={50}
                        rows={3}
                        style={{ '--font-size': '14px' }}
                    />
                </Form.Item>
            </Form>
            <Form>
                <Form.Header>房屋图像</Form.Header>
                <Form.Item>
                    <ImageUploader
                        value={fileList}
                        onChange={(files) => setFileList(files)}
                        beforeUpload={beforeUpload}
                        upload={(file) => parseFile(file)}
                        maxCount={3}
                        onCountExceed={() => Toast.show({ icon: 'fail', content: '超过上传数量限制' })}
                    />
                </Form.Item>
            </Form>
            <Form>
                <Form.Header>房屋配置</Form.Header>
                <HouseSupport isSelectionMode={true} showedNameList={selectedList.current} onSelected={toggleSelected} />
            </Form>
            <Form ref={desFormRef}>
                <Form.Header>房屋描述</Form.Header>
                <Form.Item name="description">
                    <TextArea
                        placeholder="请输入房屋描述信息"
                        maxLength={100}
                        rows={5}
                        style={{ '--font-size': '14px' }}
                        value={houseValue.description}
                        onChange={(val) => setHouseValue((prevState) => (
                            {
                                ...prevState,
                                description: val
                            }
                        ))}
                    />
                </Form.Item>
            </Form>
            <div className={style.btns}>
                <FilterFooter cancelText='重置' onCancel={reset} onConfirm={onConfirm} />
            </div>
        </div>
    )
}

export default RentAdd