const BASE_URL=process.env.REACT_APP_BASE_URL;

export const endpoints={
    GET_PROBLEMS:BASE_URL+"/problems/getAllProblems",
    LOGIN_API:BASE_URL+"/auth/login",
    SIGNUP_API:BASE_URL+"/auth/signup",
    SENDOTP_API:BASE_URL+"/auth/sendotp",
    GET_PROBLEM:BASE_URL+"/problems/getProblem",
    GET_ALL_SUBMISSION:BASE_URL+"/submission/getAllSubmission",
    SUBMIT_PROBLEM:BASE_URL+"/submission/submitProblem",
    GET_SUBMISSION:BASE_URL+"/submission/getSubmission",
}