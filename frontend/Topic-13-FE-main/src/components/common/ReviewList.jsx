import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { Table, Form, Modal } from 'antd';
import { getAllReviewsByReceiverId } from '../../apis/ReviewServices';
import { formatDateTransaction } from '../../utils/commonFunction';
import Button from './Button';
import Rating from '@mui/material/Rating';
import { Stack } from '@mui/material';

export const ReviewList = () => {
  const { userData, role } = useUserStore();
  const [reviews, setReviews] = useState([]);
  const [isReviewModal, setIsReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [form] = Form.useForm();
  const { name, id } = useParams();
  let roleProfile = name ? name.toUpperCase() : role;

  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Sender',
      dataIndex: ['user', 'fullName'],
      key: 'name'
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: date => formatDateTransaction(date)
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <a onClick={() => handleViewReview(record)}>View</a>
    }
  ];

  const handleViewReview = review => {
    setSelectedReview(review);
    setIsReviewModalVisible(true);
  };

  useEffect(() => {
    const fetchAllReviewByReceiverId = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllReviewsByReceiverId(userData?.user?.id, token);
        console.log('API get Review: ', response);
        if (response?.statusCode === 200) {
          setReviews(response.reviewsDTOList);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.log('ERROR API get Review: ', error);
      }
    };

    fetchAllReviewByReceiverId();
  }, [userData]);

  return (
    <div className="w-full h-full bg-gray-100 p-2">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Review List</h1>
      <Table columns={columns} bordered dataSource={reviews} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={null}
        open={isReviewModal}
        onCancel={() => {
          form.resetFields();
          setIsReviewModalVisible(false);
          setSelectedReview(null);
        }}
        footer={null}
      >
        <Form form={form} className="bg-white p-8 rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-4">
            How are you feeling about {selectedReview?.user?.fullName}?
          </h2>
          <p className="text-center mb-4 text-gray-400 text-sm">
            Your input is valuable in helping us better understand your needs and tailor our service accordingly.
          </p>
          {roleProfile === 'MENTOR' && (
            <Stack spacing={2} className="mb-6">
              <div className="flex justify-center mb-6">
                <Rating
                  name="Review-rating"
                  value={selectedReview?.rating || 0}
                  precision={0.5}
                  size="large"
                  readOnly
                />
              </div>
            </Stack>
          )}
          <div className="mb-6">
            <textarea
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="6"
              placeholder="Add a Comment..."
              value={selectedReview?.comment || ''}
              readOnly
            />
          </div>
          <button
            type="button"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
            disabled
          >
            Submit Now
          </button>
          <button
            type="button"
            className="w-full mt-2 text-gray-500 py-2"
            onClick={() => setIsReviewModalVisible(false)}
          >
            Cancel
          </button>
        </Form>
      </Modal>
    </div>
  );
};
export default ReviewList;
