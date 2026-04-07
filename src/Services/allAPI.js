import { commonAPI } from "./commonAPI";
import { server_url } from "./server_url";

//registerAPI
export const registerAPI = async (user) => {
  return await commonAPI("POST", `${server_url}/register`, user, "");
};

//loginAPI
export const loginAPI = async (user) => {
  return await commonAPI("POST", `${server_url}/login`, user, "");
};

//saveInterviewAPI
export const saveInterviewAPI = async (interviewData) => {
  const token = localStorage.getItem("professorX_token");
  return await commonAPI("POST", `${server_url}/interview/save`, interviewData, { Authorization: `Bearer ${token}` });
};

//getInterviewsAPI
export const getInterviewsAPI = async () => {
  const token = localStorage.getItem("professorX_token");
  return await commonAPI("GET", `${server_url}/user/interviews`, "", { Authorization: `Bearer ${token}` });
};

//getAnalyticsAPI
export const getAnalyticsAPI = async () => {
  const token = localStorage.getItem("professorX_token");
  return await commonAPI("GET", `${server_url}/user/analytics`, "", { Authorization: `Bearer ${token}` });
};

//generateQuestionsAPI
export const generateQuestionsAPI = async (data) => {
  const token = localStorage.getItem("professorX_token");
  return await commonAPI("POST", `${server_url}/ai/generate-questions`, data, { Authorization: `Bearer ${token}` });
};

//evaluateAnswerAPI
export const evaluateAnswerAPI = async (data) => {
  const token = localStorage.getItem("professorX_token");
  return await commonAPI("POST", `${server_url}/ai/evaluate-answer`, data, { Authorization: `Bearer ${token}` });
};
