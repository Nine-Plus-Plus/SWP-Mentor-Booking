import axiosConfig from '../axiosConfig';

export const getAllSemester = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: 'api/admin/get-all-semesters',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const createSemester = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/create-semester',
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const updateSemester = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'put',
        url: `api/admin/update-semester/${id}`,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const deleteSemester = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'delete',
        url: `api/admin/delete-semester/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
