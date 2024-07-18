import { createSlice } from "@reduxjs/toolkit";
const initialState={
    loading:false,
    signupData:null,
    token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
    refreshToken:localStorage.getItem("refreshToken")?JSON.parse(localStorage.getItem("refreshToken")):null,
}
const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setToken:(state,action)=>
        {
            state.token=action.payload
        },
        setRefreshToken:(state,action)=>
        {
            state.refreshToken=action.payload
        },
        setLoading:(state,value)=>{
            state.loading=value.payload
        },
        setSignupData:(state,value)=>{
            state.signupData=value.payload
        }
    }
})
export const {setToken,setLoading,setSignupData,setRefreshToken}=authSlice.actions
export default authSlice.reducer;