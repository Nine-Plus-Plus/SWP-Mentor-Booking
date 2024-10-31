import axiosConfig from '../axiosConfig';

export const createProject = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'post',
        url: `api/student/create-project`,
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

  export const getAllProjects = token =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: 'get',
          url: 'api/user/get-all-projects',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
  
        resolve(response?.data);
      } catch (error) {
        reject(error);
      }
    });
