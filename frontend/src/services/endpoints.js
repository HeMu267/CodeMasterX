const BASE_URL="http://localhost:4000/api/v1"
export const endpoints={
    GET_PROBLEMS:BASE_URL+"/problems/getAllProblems",
    LOGIN_API:BASE_URL+"/auth/login",
    SIGNUP_API:BASE_URL+"/auth/signup",
    SEND_OTP:BASE_URL+"/auth/sendotp",
    GET_PROBLEM:BASE_URL+"/problems/getProblem",
    GET_ALL_SUBMISSION:BASE_URL+"/submission/getAllSubmission",
    SUBMIT_PROBLEM:BASE_URL+"/submission/submitProblem",
    GET_SUBMISSION:BASE_URL+"/submission/getSubmission"
}