import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

const EditUserDetails = ({ onClose, user }) => {
    const [data, setData] = useState({
        name: user?.user || "",
        profile_pic: user?.profile_pic || ""
    })
    const uploadImageRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            ...user
        }))
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOpenUploadImage = (e) => {
        e.preventDefault()
        e.stopPropagation()

        uploadImageRef.current.click()
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const uploadImage = await uploadFile(file)
        setData((prev) => ({
            ...prev,
            profile_pic: uploadImage?.url
        }))
    }

    const handeSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("Form submitted:", data)
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
            const response = await axios({
                method : 'post',
                url : URL,
                data : data,
                withCredentials : true
            })

            console.log('response',response)
            toast.success(response?.data?.message)

            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose()
            }           
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center'>
            <div className='bg-white p-4 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm'>Edit user details</p>

                <form className='grid gap-3 mt-3'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name || ""}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5'
                        />
                    </div>

                    <div>
                        <div>Image: </div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <label htmlFor='profile_pic'>
                                <button type="button" className='font-semibold' onClick={handleOpenUploadImage}>Change Image</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadImage}
                                    ref={uploadImageRef}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider />

                    <div className='flex gap-2 w-fit ml-auto mt-3'>
                        <button type="button" onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                        <button onClick={handeSubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)
