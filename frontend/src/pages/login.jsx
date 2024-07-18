import React, { useState } from 'react'
import {AiOutlineEyeInvisible} from 'react-icons/ai';
import {AiOutlineEye} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { HighlightText } from '../homepages/HighlightText';
import { useDispatch } from 'react-redux';
import {login} from '../services/operations/authAPI';
export const LoginPage = () => {
  const [showPassword,setShowPassword]=useState(false);
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  })
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleChange=(event)=>{
    setFormData((prevData)=>({
      ...prevData,
      [event.target.name]:event.target.value
      }
    ))
  }
  const handleOnSubmit=(event)=>{
    event.preventDefault();
    // console.log("pressing sign in");
    dispatch(login(formData.email,formData.password,navigate))
  }
  return (
    <div className='w-screen min-h-[calc(100vh_-_66px)] bg-gray-900 flex items-center justify-center'>
      <div className='flex w-11/12 md:flex-row flex-col-reverse mt-9 max-w-maxContent items-center md:justify-between gap-8'>
        <div className='flex flex-col max-w-[450px] border-solid border-2 p-4 rounded-md'>
          <h1 className='text-[1.875rem] mb-4 text-white font-semibold leading-8'>Welcome Back</h1>
          <p className='text-gray-400 text-[1.225rem] mb-6 leading-6'>
            <span>Build Skills for Today</span> 
          </p>
          <form onSubmit={handleOnSubmit} className='flex flex-col w-full gap-5'>
            <div className='w-full'>
                <label className='w-full'>
                <p className='text-gray-200 mb-2'>
                    Email Address
                    <sup className='text-pink-200'>*</sup>
                </p>
                </label>
                <input required type='text' onChange={handleChange} name='email' placeholder='Enter Email Address' className='appearance-none focus:outline-none focus:shadow-outline focus:ring-richblack-50 w-full bg-richblack-700 text-richblack-5 rounded-lg py-3 px-3 shadow-md shadow-richblack-300'>
                </input>
            </div>
            <div className='relative w-full'>
                <label className='w-full'>
                <p className='text-gray-200 mb-2'>
                    Password
                    <sup className='text-pink-200'>*</sup>
                </p>
                </label>
                <input required type={`${showPassword?"text":"password"}`} onChange={handleChange} name='password' placeholder='Enter Password' className='appearance-none focus:outline-none focus:shadow-outline focus:ring-richblack-50 w-full bg-richblack-700 text-richblack-5 rounded-lg py-3 pr-[70px] pl-3 shadow-md shadow-richblack-300'>
                </input>
                {
                showPassword?
                <AiOutlineEye className='absolute z-10 bottom-[10px] right-[20px] cursor-pointer' fill='#AFB2BF' size={30} onClick={()=>{setShowPassword((prev)=>!prev)}} />:
                <AiOutlineEyeInvisible className='absolute z-10 bottom-[10px] right-[20px] cursor-pointer' fill='#AFB2BF' size={30} onClick={()=>{setShowPassword((prev)=>!prev)}}/>
                }
                <Link to='/forgotPassword'>
                <div className='absolute bottom-0 translate-y-[120%]  right-0'>
                    <HighlightText text={"Forgot Password"}></HighlightText>
                </div>
                </Link>
            </div>
            <button
                type="submit"
                className="mt-8 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
            >
                Log In
            </button>
            </form>
        </div>
        <div className='w-[700px] rounded-lg border-gray-700 border-solid'>
            <img src="https://ideogram.ai/assets/image/balanced/response/OZ93FYuyRpmpgNxX0fRMSw" className='rounded-lg'></img>
        </div>
      </div>
    </div>
    
  )
}
