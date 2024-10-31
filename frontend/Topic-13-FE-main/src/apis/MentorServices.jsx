import axiosConfig from '../axiosConfig';

export const getAllMentors = (name, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/get-all-mentors?name=${name}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getTop3Mentor = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: 'api/user/get-top-mentors',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const createMentor = (data, token) =>
  new Promise(async (resolve, reject) => {
    const formData = new FormData();
    console.log(data.mentor);
    formData.append('mentor', new Blob([JSON.stringify(data.mentor)], { type: 'application/json' }));
    formData.append('avatarFile', data.avatarFile);

    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/create-mentor',
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const updateMentor = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('mentor', new Blob([JSON.stringify(data.mentor)], { type: 'application/json' }));
    formData.append('avatarFile', data.avatarFile);
    try {
      const response = await axiosConfig({
        method: 'put',
        url: `api/user/update-mentor/${id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const deleteMentor = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'delete',
        url: `api/admin/delete-user/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getClassByIdMentor = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-class-by-mentor/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getAllMentorByNameSkillDate = (name, skill, availableFrom, availableTo, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-mentor-by-name-skills/`,
        params: {
          name: name,
          skillIds: skill,
          availableFrom: availableFrom,
          availableTo: availableTo
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const importExcelMentor = (file, token) =>
  new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file); // Thêm tệp tin vào formData

    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/import-mentor',
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
