import React, { useEffect, useState } from 'react';

const AboutUs = () => {
  const images = [
    'https://mentor-booking-images.s3.ap-southeast-2.amazonaws.com/banner1.png',
    'https://mentor-booking-images.s3.ap-southeast-2.amazonaws.com/banner2.png',
    'https://mentor-booking-images.s3.ap-southeast-2.amazonaws.com/banner3.png'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 2000); // 3s chuyển đổi hình ảnh

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, [images.length]);

  return (
    <div className="flex flex-col h-min-heigh-custom">
      {/* Hero Section */}
      <div className="relative w-full h-80">
        {/* Background image */}
        <div className="w-full h-full relative">
          <img
            src={images[currentIndex]}
            alt={`banner-${currentIndex}`}
            className="h-full w-full object-cover absolute inset-0"
          />
        </div>

        {/* Overlay for darkening the background image */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Hero Content */}
        <div className="absolute z-10 inset-0 flex items-center justify-center text-center text-white">
          {/* <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white"> */}
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
        </div>
      </div>

      {/* Content Section */}
      <section className="w-full py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-main-1">How it Works</h2>
          <p className="mt-4 text-black max-w-3xl mx-auto">
            At SWP391 Mentor Connect, we simplify the journey of software development for students by connecting them
            with experienced mentors. Our platform offers an easy booking system where students can find mentors skilled
            in areas like requirements analysis, development environments, and best practices. With a point-based system
            for fair access, we aim to foster a collaborative learning experience, helping students manage resources and
            improve their skills. Join us to enhance your SWP391 course experience and grow with expert guidance.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
