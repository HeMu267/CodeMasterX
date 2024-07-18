import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CodeIcon } from './Icon';
import {logout} from "../services/operations/authAPI"
import { useNavigate } from 'react-router-dom'
import { useDispatch} from 'react-redux'
export const Appbar = () => {
  const {token}=useSelector((state)=>state.auth);
  const {user}=useSelector((state)=>state.profile);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  return (
    <header className="bg-gray-900 border-b-2 border-gray-700 text-white px-4 md:px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2" prefetch={false}>
        <CodeIcon className='h-6 w-6'></CodeIcon>
        <span className="text-lg font-bold">CodeMaster</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/Problems" className="hover:underline" prefetch={false}>
          Problems
        </Link>
        <Link to="/Submissions" className="hover:underline" prefetch={false}>
          Submissions
        </Link>
        <Link to="/About" className="hover:underline" prefetch={false}>
          About
        </Link>
      </nav>

      {
        token===null && (
          <div className='flex gap-6 items-center justify-between text-richblack-200'>
                            <Link to="/login" className='bg-richblack-800 border-[1px] border-richblack-600 text-base text-center rounded-md py-2 px-4'>
                                Log in
                            </Link>
                            <Link to="/signup" className='bg-richblack-800 border-[1px] border-richblack-600 text-base text-center rounded-md py-2 px-4'>
                                Sign up
                            </Link>
          </div>
        )
      }
      {
        user && <div className='flex gap-8 items-center relative'>
        <div className='flex gap-2 items-center cursor-pointer relative'>
          <Link to='/submissions'>
            <img src={`${user.image}`} alt='hello' className='w-[30px] h-[30px] rounded-full' ></img>
          </Link>
          <button onClick={()=>dispatch(logout(navigate))} className='bg-richblack-800 border-[1px] border-richblack-600 text-base text-center rounded-md py-2 px-4'>Log Out</button>
        </div>
        </div>
      }
    </header>
  )
}
