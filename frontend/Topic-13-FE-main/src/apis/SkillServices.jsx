import axiosConfig from '../axiosConfig';

export const getAllSkill = (name, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-all-skills?name=${name}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const createSkill = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/create-skill',
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

export const deleteSkill = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'delete',
        url: `api/admin/delete-skill/${id}`,
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

export const updateSkill = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'put',
        url: `api/admin/update-skill-by-id/${id}`,
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
