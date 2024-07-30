import axiosInstance from "../DataService/DataService";
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT, FILE_UPLOAD_ENDPOINT, REPORT_ENDPOINT, DOWNLOAD_ENDPOINT, PROFILE_ENDPOINT } from "../constants/constants";

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
    const userId = sessionStorage.getItem("userId");

    const payload = {
      username,
      phoneNumber,
      email,
      password,
      role
    };

    if (userId) {
      payload.id = userId;
    }

    return axiosInstance.post(REGISTER_ENDPOINT, payload);
  },
};

export const fileUploadService = {
  uploadFile(formData) {
    const userId = sessionStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("Status", 1);

    return axiosInstance.post(FILE_UPLOAD_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  downloadFile(formData) {
    const userId = sessionStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("Status", 0);

    return axiosInstance.post(FILE_UPLOAD_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const attachmentService = {
  getReport(status) {
    return axiosInstance.get(REPORT_ENDPOINT, {
      params: {
        "userId": sessionStorage.getItem("userId"),
        "status": status,
      }
    });
  },

  downloadFile(uniqueId) {
    return axiosInstance.get(DOWNLOAD_ENDPOINT, {
      params: {
        "uniquId": uniqueId,
      },
    });
  }
};

export const profileService = {
  getProfile(id) {
    return axiosInstance.post(PROFILE_ENDPOINT,  id );
  },
};
