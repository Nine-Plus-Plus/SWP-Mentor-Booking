import axiosConfig from '../axiosConfig';

export const getAllReviews = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-all-reviews`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

  export const getAllReviewsByReceiverId = (id, token) => 
    new Promise (async(resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: 'get',
          url: `api/user/reviews/receive-user/${id}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });

    export const createReview = (data, token) => 
      new Promise (async(resolve, reject) => {
        try {
          const response = await axiosConfig({
            method: 'post',
            url: `api/user/create-review`,
            data: data,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });