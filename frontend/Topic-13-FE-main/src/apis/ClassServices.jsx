import axiosConfig from '../axiosConfig';

export const getClassBySemesterId = (semesterId, name, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/get-classes-by-semester/${semesterId}?name=${name}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const createClass = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/create-class',
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      //
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const updateClass = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'put',
        url: `api/admin/update-class/${id}`,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      //
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const deleteClass = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'delete',
        url: `api/admin/delete-class/${id}`,
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

export const getMentorNoClass = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/unassigned-mentors`,
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
