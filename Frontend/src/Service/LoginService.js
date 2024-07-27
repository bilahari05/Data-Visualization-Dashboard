import axiosInstance from "../DataService/DataService";
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT, FILE_UPLOAD_ENDPOINT, REPORT_ENDPOINT } from "../constants/constants";

export const loginService = {
  login(username, password) {
    console.log(username, "username");
    console.log(password, "password");

    return axiosInstance
      .post(LOGIN_ENDPOINT, { username, password })
      .then((response) => {
        if (response.data.apiResponse.responseCode === "SC") {
          sessionStorage.setItem("userId", response.data.user.id);
        }
        return response;
      })
      .catch((error) => {
        console.error("Login failed:", error);
        throw error;
      });
  },

  register(username, phoneNumber, email, password) {
    const role = "";
    return axiosInstance.post(REGISTER_ENDPOINT, { username, phoneNumber, email, password, role });
  },
};

export const fileUploadService = {
  uploadFile(formData) {
    const userId = sessionStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("Status",1);

    return axiosInstance.post(FILE_UPLOAD_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};


export const attachmentService = {
  getReport(status){
    return axiosInstance.get(REPORT_ENDPOINT, {
      params: {
        "userId": sessionStorage.getItem("userId"),
        "status": status,
      }
    });
  }
};