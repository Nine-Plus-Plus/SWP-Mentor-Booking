import axiosConfig from '../axiosConfig';

// Phương thức lấy tất cả người dùng
export const getStudents = token =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: 'api/admin/get-all-students',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getStudentsBySemesterId = (id, name, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/get-students-by-semester/${id}?name=${name}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

// Phương thức lấy người dùng bằng id
export const getStudentById = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/admin/get-student-by-id/${id}`,
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

export const updateStudent = (id, data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      console.log(data.student);
      formData.append('student', new Blob([JSON.stringify(data.student)], { type: 'application/json' }));
      formData.append('avatarFile', data.avatarFile);
      const response = await axiosConfig({
        method: 'put',
        url: `api/user/update-student/${id}`,
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

// Phương thức xóa người dùng
export const deleteStudent = (id, token) =>
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

export const createStudent = (data, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      console.log(data.student);

      formData.append('student', new Blob([JSON.stringify(data.student)], { type: 'application/json' }));
      formData.append('avatarFile', data.avatarFile);

      const response = await axiosConfig({
        method: 'post',
        url: `api/admin/create-student`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`
          // Không cần chỉ định 'Content-Type' cho FormData
        }
      });

      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const getStudentByIdAndSearch = (classId, name, expertise, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-student-by-name-or-expertise/`,
        params: {
          classId: classId,
          name: name,
          expertise: expertise
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

export const getStudentNotGroup = (classId, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `api/user/get-students-not-in-group/${classId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const importExcelStudent = (file, token) =>
  new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file); // Thêm tệp tin vào formData

    try {
      const response = await axiosConfig({
        method: 'post',
        url: 'api/admin/import-student',
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
