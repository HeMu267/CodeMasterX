import { createSlice } from "@reduxjs/toolkit";
const initialState={
    // user:{
    //     firstName:"Himanshu",
    //     lastName:"Negi",
    //     email:"himanshunegi267@gmail.com",
    //     accountType:"Student",
    //     image:"https://res.cloudinary.com/dms0i7w80/image/upload/v1685549420/UploadedImages/r5pl2hn9xanxpc1ueuix.jpg"
    // }
    user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,
    loading:false,
}
const profileSlice=createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser:(state,action)=>
        {
            state.user=action.payload
            localStorage.setItem("user",JSON.stringify((state.user)))
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
    }
})
export const {setUser,setLoading}=profileSlice.actions
export default profileSlice.reducer;