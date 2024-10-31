import React, { useState, useEffect } from 'react'; // Import useState và useEffect
import { getAllUsers } from '../../apis/UserServices';
import { deleteUser } from '../../apis/UserServices';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllUsers(token);
        setUsers(response.data.usersDTOList);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async userId => {
    const token = localStorage.getItem('token');
    try {
      const response = await deleteUser(userId, token);
      if (response.status === 200) {
        toast.success('User deleted successfully');
        setUsers(users.filter(user => user.id !== userId)); // Cập nhật danh sách người dùng
      } else {
        toast.error('Failed to delete user: ' + response.data.message);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user: ' + error.message);
    }
  };
  const handleUpdate = async userId => {};

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Users List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Id</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Date Created</th>
              <th className="py-3 px-6 text-left">Role Name</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{user.id}</td>
                <td className="py-3 px-6 text-left">{user.username}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{new Date(user.dateCreated).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{user.role.roleName}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleUpdate(user.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 focus:outline-none"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
