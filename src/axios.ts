import a from "axios";

export const axios = a.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
});

export const axios2 = a.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
});

axios.interceptors.request.use(function (config) {
  const token = config.headers.Authorization;
  const skipTokenCheck = config.headers.skipTokenCheck;

  if (!token && !skipTokenCheck) {
    return Promise.reject("No token provided");
  }

  return config;
});

axios2.interceptors.request.use(function (config) {
  const token = config.headers.Authorization;
  const skipTokenCheck = config.headers.skipTokenCheck;

  if (!token && !skipTokenCheck) {
    return Promise.reject("No token provided");
  }

  return config;
});
