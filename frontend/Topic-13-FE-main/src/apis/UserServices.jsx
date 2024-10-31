import axiosConfig from '../axiosConfig';

export const StudentLogin = payload =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: '/api/auth/login',
        data: payload
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

// Phương thức lấy profile từ token
export const getMyProfile = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: '/api/user/get-my-profile',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getProfileById = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `/api/user/view-user-detail-by-id/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

// Phương thức lấy tất cả người dùng
export const getAllUsers = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: 'api/admin/get-all-users',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
      console.log(response);
    } catch (error) {
      reject(error);
    }
  });
  
// Phương thức lấy người dùng bằng id
export const getUserById = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/get-user-by-id/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
// Phương thức cập nhập người dùng

export const updateUser = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'put',
        url: `api/admin/update-user/${id}`,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

// Phương thức xóa người dùng
export const deleteUser = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'delete',
        url: `api/admin/delete-user/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

// Phương thức thêm người dùng
export const createUser = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: `api/admin/create-user`,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const checkExistEmail = data =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: `api/auth/email-existed`,
        data: data
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const checkOtpCorrect = data =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: `api/auth/otp-existed`,
        data: data
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const changePassword  = data =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: `api/auth/change-password`,
        data: data
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

/**
 *  Update user avatar
 */
export const updateAvatar = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('avatarFile', data.avatarFile);
    } catch (error) {}
  });

  /**
   * Setting change password for user
   */
  export const settingChangePassword = data =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: 'post',
          url: `api/user/change-password-user`,
          data: data
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });