import React, { useEffect, useRef, useState } from 'react'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import {PiClockCountdownBold} from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendotp, signup } from '../services/operations/authAPI'
import LoadingSpinner from '../components/Loading'
export const VerifyEmail = () => {
    const {signupData,loading}=useSelector((state=>state.auth));
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const arr=[0,1,2,3,4,5];
    const inputRefs=useRef([]);
    const [activeIndex,setActiveIndex]=useState(0);
    useEffect(()=>{
        inputRefs.current[activeIndex].focus();
    },[])
    const handlePress=(event)=>{
        event.preventDefault();
        console.log("key pressed"+event.key);
        console.log("active index",activeIndex);
        if(activeIndex < 6)
        {
            if(event.keyCode>=48 && event.keyCode<=57)
            {
                event.target.value=event.key;
                if(activeIndex!==5)
                {
                    setActiveIndex((prev)=>prev+1);
                    inputRefs.current[activeIndex+1]?.focus();
                }
            }
            if(event.keyCode===37 && activeIndex>0)
            {
                setActiveIndex((prev)=>prev-1);
                inputRefs.current[activeIndex-1]?.focus();
            }
            else if(event.keyCode===39 && activeIndex<5)
            {
                setActiveIndex((prev)=>prev+1);
                inputRefs.current[activeIndex+1]?.focus();
            }
            else if(event.keyCode===8 && activeIndex>=0)
            {
                event.target.value="";
                if(activeIndex>0)
                {
                    setActiveIndex((prev)=>prev-1);
                    inputRefs.current[activeIndex-1]?.focus();
                }
            }
        }
        else{
            console.log("active index greater");
        }
    }
    const handleClick=(event)=>{
        setActiveIndex(parseInt(event.target.getAttribute('a-key')));
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        var otp="";
        for(let i=0;i<6;i++)
        {
            otp+=inputRefs.current[i].value;
        }
        const {
            email,accountType,firstName,lastName,password,confirmPassword
        }=signupData;
        dispatch(signup(email,accountType,firstName,lastName,password,confirmPassword,otp,navigate));
    }
  return (
    <div className='flex justify-center max-[1560px]:items-center w-screen h-[calc(100vh_-_10rem)]'>
    {
        loading?(
            <LoadingSpinner/>
        ):(
            <form className='flex flex-col gap-4 min-[1560px]:mt-72 max-[500px]:scale-75' onSubmit={handleSubmit}>
            <h1 className='text-richblack-5 text-[1.875rem] leading-6'>Verify Email</h1>
            <p className='text-richblack-100 text-[1.125rem] max-w-[400px]'>A verification code has been sent to you. Enter the code below</p>
            <div className='flex gap-2'>
                {
                    arr.map((elem,index)=>{
                        return (
                            <div className='flex gap-2 items-center'>
                                <input a-key={index} ref={ref => {
                                    if (ref) {
                                        inputRefs.current[index] = ref;
                                    }
                                    }} maxLength={1} type='text' onKeyDown={handlePress} onClick={handleClick}  required className={`w-[2.8rem] rounded-md text-[1.05rem] appearance-none focus:outline-yellow-100 outline-none border-none ring-2 ring-richblack-800 text-center h-10 bg-richblack-800 text-richblack-100`}></input>
                                {
                                    index<5 &&
                                    <p className='text-richblack-300 text-lg'> - </p>
                                }
                            </div>
                        )
                    })
                }
            </div>
            <button
              type="submit"
              className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
            >
              Verify Email
          </button>
          <div className='flex items-center justify-between'>
                <div onClick={()=>{navigate("/login")}} className='flex cursor-pointer items-center gap-2'>
                    <AiOutlineArrowLeft fill='#F1F2FF'/>
                    <p className='text-richblack-5'>Back to login </p>
                </div>
                <div onClick={()=>{dispatch(sendotp(signupData.email,navigate))}} className='text-blue-300 cursor-pointer flex items-center gap-2'>
                    <PiClockCountdownBold fill='#118AB2'/>
                    <p>Resend it</p>
                </div>
          </div>
        </form>
        )
    }     
    </div>
  )
}
