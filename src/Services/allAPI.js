import { commonAPI } from "./commonAPI";
import { server_url } from "./server_url";

// //registerAPI
// export const registerAPI = async (user) => {
//   return await commonAPI("POST", `${server_url}/register`, user, "");
// };

//loginAPI
export const loginAPI = async (user) => {
  return await commonAPI("POST", `${server_url}/login`, user, "");
};

//saveInterviewAPI
export const saveInterviewAPI = async (interviewData) => {
  return await commonAPI("POST", `${server_url}/interview/save`, interviewData);
};

//getInterviewsAPI
export const getInterviewsAPI = async () => {
  return await commonAPI("GET", `${server_url}/user/interviews`, "");
};
