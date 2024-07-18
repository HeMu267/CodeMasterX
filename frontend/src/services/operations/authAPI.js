import { toast } from "react-hot-toast"
import {setLoading,setSignupData,setToken} from "../../slices/authSlice"
import {setUser} from "../../slices/profileSlice"
import {apiConnector} from '../apiconnector'
import {endpoints} from '../endpoints'
const {
    LOGIN_API,
    SIGNUP_API,SENDOTP_API,
}=endpoints
export function sendotp(email,navigate)
{
    return async(dispatch)=>{
        const toastID=toast.loading("Loading...");
        console.log(email);
        dispatch(setLoading(true));
        try{
            const res=await apiConnector("POST",SENDOTP_API,{
                email
            });
            console.log("SEND OTP",res);
            if(!res.data.success)
            {
                throw new Error(res.data.message)
            }
            toast.success("OTP SEND to "+email);
            navigate("/verify-email");
        }catch(err)
        {
            console.log("SENDOTP API ERROR............", err)
            toast.error("Signup Failed")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastID);
    }
}
export function signup(email,accountType,firstName,lastName,password,confirmPassword,otp,navigate)
{
    return async(dispatch)=>{
        const toastID=toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const res=await apiConnector("POST",SIGNUP_API,{
                email,accountType,firstName,lastName,password,confirmPassword,otp
            });
            console.log("sign up res",res);
            if(!res.data.success)
            {
                throw new Error(res.data.message)
            }
            toast.success("Sign up success");
            setSignupData(null);
            navigate("/login");
        }catch(err)
        {
            console.log("SIGNUP_ERROR",err);
            toast.error("SIGNUP FAILED");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastID);
    }
}
export function login(email,password,navigate){
    return async(dispatch)=>{
        const toastID=toast.loading("Loading...")
        dispatch(setLoading(true));
        try{
            const res=await apiConnector("POST",LOGIN_API,{
                email,password
            })
            console.log("LOGIN response",res);
            if(!res.data.success)
            {
                throw new Error(res.data.message);
            }
            toast.success("Login Successful");
            dispatch(setToken(res.data.token));
            const userImage = res.data?.user?.image
              ? res.data.user.image
              : `https://api.dicebear.com/5.x/initials/svg?seed=${res.data.user.firstName} ${res.data.user.lastName}`
            dispatch(setUser({ ...res.data.user, image: userImage }));
            localStorage.setItem("token", JSON.stringify(res.data.token));
            navigate("/problems")
        }
        catch(err)
        {
            console.log("LOGIN API ERROR............", err)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastID);
    }
}
export function logout(navigate){
    return (dispatch)=>{
        dispatch(setUser(null));
        dispatch(setToken(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("User logged out succesfully");
        navigate("/");
    }
    
}
