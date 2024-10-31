import React from 'react';
import { Link } from 'react-router-dom';
import path from '../../utils/path';
import { useUserStore } from '../../store/useUserStore';

const PublicHome = () => {
  const { isLoggedIn } = useUserStore();
  return (
    <div className="flex flex-col items-center justify-center h-min-heigh-custom">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-main-1">Welcome to the Booking Mentor System</h1>
        <p className="mt-4 text-lg text-gray-600">Find the right mentor for your project</p>
      </header>
      <section className="text-center mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-600">How it Works</h2>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Our system allows students to create groups, search for mentors based on their skills, and book sessions for
            guidance. Mentors can manage their availability and provide support in various domains.
          </p>
        </div>
        <div className="space-x-4">
          <Link to={isLoggedIn ? '/' : path.LOGIN}>
            <button className="px-6 py-3 bg-amber-200 text-orange-900 font-semibold rounded-md hover:bg-amber-800 hover:text-white">
              Get Started
            </button>
          </Link>
          <Link to={path.ABOUT_US}>
            <button className="px-6 py-3 bg-amber-400 text-orange-900 font-semibold rounded-md hover:bg-amber-700 hover:text-white">
              Learn More
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
