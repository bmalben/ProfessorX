import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  const token = sessionStorage.getItem("token");
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader || {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include token
    },
  };
  return await axios(reqConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
